import express from "express";
import { upload, uploadCustomers } from "../controllers/uploadController.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = express.Router();

router.post("/csv", checkToken, upload.single("file"), uploadCustomers);

export default router;
