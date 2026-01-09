import { Router } from "express";
const router = Router();
import { loginLimiter,otpLimiter } from "../middleware/rateLimiter.js";
import { forgotPassword, login, logout, register, sendOtp } from '../controller/authController.js'
import verifyOtpMiddleware from "../middleware/verifyOtp.js";

router.post("/send-otp", otpLimiter, sendOtp);
router.post("/register", verifyOtpMiddleware('registration'), register);
router.post("/forgot-password", verifyOtpMiddleware('password_reset'), forgotPassword);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);

export default router;