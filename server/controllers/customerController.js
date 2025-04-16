import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { isValidEmail, isValidPhoneNumber } from "../utils/validation.js"; // Import validation functions

dotenv.config();

const prisma = new PrismaClient();

export const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", tags = "" } = req.query;
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    if (isNaN(pageInt) || pageInt < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }
    if (isNaN(limitInt) || limitInt < 1) {
      return res.status(400).json({ error: "Invalid limit number" });
    }

    let where = {};
    if (search) {
      where = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    if (tags) {
      const tagList = tags.split(",").map(tag => tag.trim().toLowerCase());
    
      where = {
        AND: [
          ...(Object.keys(where).length ? [where] : []),
          {
            tags: {
              hasEvery: tagList,
            }
          },
        ],
      };
    }

    const customers = await prisma.customer.findMany({
      where,
      skip: (pageInt - 1) * limitInt,
      take: limitInt,
      orderBy: {
        name: "asc",
      },
    });

    const totalCustomers = await prisma.customer.count({ where });

    res.status(200).json({
      customers,
      totalCustomers,
      currentPage: pageInt,
      totalPages: Math.ceil(totalCustomers / limitInt),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCustomer = async (req, res) => {
  const { name, email, phone, company, tags } = req.body;
  const { userId } = req.user;

  if (!name || !email || !phone || !company || !userId) {
    return res
      .status(400)
      .json({ error: "Name, email, phone, company, and userId are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Optional: Add back phone validation if needed
  // if (!isValidPhoneNumber(phone)) {
  //   return res.status(400).json({ error: "Invalid phone number format" });
  // }

  // Process tags safely
  let processedTags = [];

  if (typeof tags === "string") {
    processedTags = tags.split(",").map((tag) => tag.trim().toLowerCase());
  } else if (Array.isArray(tags)) {
    processedTags = tags.map((tag) => tag.toLowerCase());
  }

  try {
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        company,
        tags: processedTags,
        user: {
          connect: { id: userId },
        },
      },
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company, tags } = req.body;

  if (!name || !email || !phone || !company) {
    return res
      .status(400)
      .json({ error: "Name, email, phone, and company are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Optional: Add back phone validation if needed
  // if (!isValidPhoneNumber(phone)) {
  //   return res.status(400).json({ error: "Invalid phone number format" });
  // }

  // Process tags safely
  let processedTags = [];

  if (typeof tags === 'string') {
    processedTags = tags.split(',').map(tag => tag.trim().toLowerCase());
  } else if (Array.isArray(tags)) {
    processedTags = tags.map(tag => tag.toLowerCase());
  }

  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        email,
        phone,
        company,
        tags: processedTags,
      },
    });

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the customer
    const deletedCustomer = await prisma.customer.delete({
      where: { id: parseInt(id, 10) },
    });

    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer deleted successfully",
      deletedId: parseInt(id, 10),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUniqueTags = async (req, res) => {
  try {
    // 1. Fetch all customers from the database.
    const customers = await prisma.customer.findMany();

    // 2. Extract tags from all customers and store them in a Set to ensure uniqueness.
    const uniqueTags = new Set();
    customers.forEach((customer) => {
      if (customer.tags && Array.isArray(customer.tags)) {
        customer.tags.forEach((tag) => uniqueTags.add(tag));
      }
    });

    // 3. Convert the Set to an array before sending the response.
    const tagsArray = Array.from(uniqueTags);

    // 4. Send the unique tags as a JSON response.
    res.status(200).json(tagsArray);
  } catch (error) {
    // 5. Handle any errors that occur during the process.
    res.status(500).json({ error: "Failed to retrieve unique tags" });
  }
};
