import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());

// Prisma Client
const prisma = new PrismaClient(); // Initialize PrismaClient

// Test the database connection (Prisma automatically does this on first query)
async function testPrismaConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connected successfully (Prisma)");
  } catch (error) {
    console.error("Database connection error (Prisma):", error);
    process.exit(1); // Exit if Prisma cannot connect
  }
}
testPrismaConnection();

// Routes
app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/upload", uploadRoutes);

// Error handling middleware
app.use((err, res) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
