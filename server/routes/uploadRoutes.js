import express from "express";
import { uploadCSV } from "../controllers/uploadController.js";
import multer from "multer";
import { checkToken } from "../middlewares/checkToken.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory

router.post("/csv", upload.single("file"), checkToken, uploadCSV);

export default router;
