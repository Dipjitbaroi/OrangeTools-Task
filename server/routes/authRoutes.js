import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", checkToken, getMe);

export default router;
