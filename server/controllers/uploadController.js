import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import dotenv from 'dotenv';
import { isValidEmail, isValidPhoneNumber } from '../utils/validation.js';

dotenv.config();

const prisma = new PrismaClient();

const rowQueue = [];
let isProcessing = false;

async function processRow(row, userId) {
    let skipped = 0;
    let success = false;
    let skippingReason = null;

    const name = row[0]?.trim();
    const email = row[1]?.trim();
    const phone = row[2]?.trim();
    const company = row[3]?.trim();
    const location = row[4]?.trim();
    const tags = row[5] ? row[5].split(',').map(tag => tag.trim()) : [];

    if (!name || !email || !phone || !company || !location) {
        skippingReason = 'Missing required fields (name, email, phone, company, location)';
        skipped++;
        return { skipped, success, skippingReason };
    }

    if (!isValidEmail(email)) {
        skippingReason = 'Invalid email format';
        skipped++;
        return { skipped, success, skippingReason };
    }

    if (!isValidPhoneNumber(phone)) {
        skippingReason = 'Invalid phone number format';
        skipped++;
        return { skipped, success, skippingReason };
    }

    try {
        const existingUser = await prisma.customer.findUnique({
            where: { email: email },
        });
        if (existingUser) {
            skippingReason = 'Duplicate email';
            skipped++;
            return { skipped, success, skippingReason };
        }
        const newCustomer = await prisma.customer.create({
            data: {
                name,
                email,
                phone,
                company,
                location,
                tags: tags || [],
                userId,
            },
        });
        success = true;
    } catch (dbErr) {
        console.error('Database error:', dbErr);
        skippingReason = 'Database error';
        skipped++;
        return { skipped, success, skippingReason };
    }
    return { skipped, success, skippingReason };
}

async function processQueue(res) {
    if (rowQueue.length === 0 || isProcessing) return;
    isProcessing = true;

    let totalProcessed = 0;
    let skipped = 0;
    let successCount = 0;
    const skippingReasonsArray = []; // Store unique skipping reasons with counts

    try {
        const skippingReasonsCount = {};
        while (rowQueue.length > 0) {
            const { row, userId } = rowQueue.shift();
            totalProcessed++;
            const { skipped: rowSkipped, success, skippingReason } = await processRow(row, userId);
            skipped += rowSkipped;
            if (success) {
                successCount++;
            } else if (skippingReason) {
                skippingReasonsCount[skippingReason] = (skippingReasonsCount[skippingReason] || 0) + 1;
            }
        }
        for (const reason in skippingReasonsCount) {
            skippingReasonsArray.push({ [reason]: skippingReasonsCount[reason] });
        }

        res.status(200).json({
            message: 'CSV upload completed',
            totalProcessed,
            skipped,
            successCount,
            skippingReasons: skippingReasonsArray, // Include the count of each reason
        });
    } catch (error) {
        console.error("Error in processQueue:", error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    } finally {
        isProcessing = false;
        if (rowQueue.length > 0) {
            processQueue(res);
        }
    }
}

export const uploadCSV = async (req, res) => {
    const { userId } = req.user;
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    let rowNumber = 0;

    try {
        const parser = readableStream.pipe(parse({
            delimiter: ',',
            skip_empty_lines: true,
        }));

        parser.on('data', (row) => {
            rowNumber++;
            rowQueue.push({ row: [...row, rowNumber], userId });
            if (!isProcessing) {
                processQueue(res);
            }
        });

        parser.on('error', (err) => {
            console.error('Error parsing CSV:', err);
            res.status(500).json({ error: 'Error parsing CSV', message: err.message });
            isProcessing = false;
        });

    } catch (error) {
        console.error("Error during uploadCSV:", error);
        res.status(500).json({ error: "Internal server error", message: error.message });
        isProcessing = false;
    }
};