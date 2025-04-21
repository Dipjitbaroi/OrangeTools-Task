import multer from "multer";
import { parse } from "csv-parse";
import validator from "validator";
import { PrismaClient } from "@prisma/client";
import fsPromises from "fs/promises";
import fs from "fs";

const prisma = new PrismaClient();
const upload = multer({ dest: "uploads/" });

// Validation function
const validateRecord = (record) => {
  const errors = [];
  if (!record.name || record.name.trim() === "") {
    errors.push("Name is required");
  }
  if (!record.email || !validator.isEmail(record.email)) {
    errors.push("Valid email is required");
  }
  if (!record.phone || record.phone.trim() === "") {
    errors.push("Phone is required");
  }
  if (!record.company || record.company.trim() === "") {
    errors.push("Company is required");
  }
  if (!record.location || record.location.trim() === "") {
    errors.push("Location is required");
  }
  if (record.tags && typeof record.tags !== "string") {
    errors.push("Tags must be a comma-separated string");
  }
  return errors;
};

// Process a batch of records
const processBatch = async (batch, userId) => {
  const results = {
    processed: 0,
    skipped: 0,
    failed: 0,
    errorSummary: { validation: 0, duplicates: 0, failed: 0 },
  };

  // Check for duplicate emails in the batch
  const emails = batch.map((r) => r.email);
  const existingEmails = await prisma.customer.findMany({
    where: { email: { in: emails } },
    select: { email: true },
  });
  const existingEmailSet = new Set(existingEmails.map((e) => e.email));

  const validRecords = [];
  for (const record of batch) {
    const errors = validateRecord(record);
    if (errors.length > 0) {
      results.skipped++;
      results.errorSummary.validation++;
      continue;
    }
    if (existingEmailSet.has(record.email)) {
      results.skipped++;
      results.errorSummary.duplicates++;
      continue;
    }
    validRecords.push({
      name: record.name,
      email: record.email,
      phone: record.phone,
      company: record.company,
      location: record.location,
      tags: record.tags ? record.tags.split(",").map((tag) => tag.trim()) : [],
      userId,
    });
  }

  // Batch insert valid records
  if (validRecords.length > 0) {
    try {
      await prisma.customer.createMany({
        data: validRecords,
        skipDuplicates: true,
      });
      results.processed += validRecords.length;
    } catch (error) {
      results.failed += validRecords.length;
      results.errorSummary.failed += validRecords.length;
    }
  }

  return results;
};

// Upload controller
const uploadCustomers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated" });
    }

    // Verify user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });
    if (!user || !user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin access required" });
    }

    const filePath = req.file.path;
    const results = {
      processed: 0,
      skipped: 0,
      failed: 0,
      errorSummary: { validation: 0, duplicates: 0, failed: 0 },
    };
    let batch = [];
    const batchSize = 1000;

    // Stream CSV file
    const stream = fs.createReadStream(filePath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })
    );

    for await (const record of stream) {
      batch.push(record);
      if (batch.length >= batchSize) {
        const batchResults = await processBatch(batch, userId);
        results.processed += batchResults.processed;
        results.skipped += batchResults.skipped;
        results.failed += batchResults.failed;
        results.errorSummary.validation += batchResults.errorSummary.validation;
        results.errorSummary.duplicates += batchResults.errorSummary.duplicates;
        results.errorSummary.failed += batchResults.errorSummary.failed;
        batch = [];
      }
    }

    // Process remaining records
    if (batch.length > 0) {
      const batchResults = await processBatch(batch, userId);
      results.processed += batchResults.processed;
      results.skipped += batchResults.skipped;
      results.failed += batchResults.failed;
      results.errorSummary.validation += batchResults.errorSummary.validation;
      results.errorSummary.duplicates += batchResults.errorSummary.duplicates;
      results.errorSummary.failed += batchResults.errorSummary.failed;
    }

    // Clean up file
    await fsPromises.unlink(filePath);

    // Send summary
    res.json({
      message: "File processed successfully",
      summary: {
        totalProcessed: results.processed,
        totalSkipped: results.skipped,
        totalFailed: results.failed,
        errorSummary: results.errorSummary,
      },
    });
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      await fsPromises.unlink(req.file.path).catch(() => {});
    }
    res
      .status(500)
      .json({ error: "Error processing file", details: error.message });
  }
};

export { uploadCustomers, upload };
