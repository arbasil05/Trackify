import { Router } from "express";

const router = Router();
import { forgotPassword, login, logout, register, sendOtp } from '../controller/authController.js'
import verifyOtpMiddleware from "../middleware/verifyOtp.js";

router.post("/send-otp", sendOtp);
router.post("/register", verifyOtpMiddleware('registration'), register);
router.post("/forgot-password", verifyOtpMiddleware('password_reset'), forgotPassword);
router.post("/login", login);
router.post("/logout", logout);

export default router;