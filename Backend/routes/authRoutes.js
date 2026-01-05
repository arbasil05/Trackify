import { Router } from "express";

const router = Router();
import { login, logout, register, sendOtp } from '../controller/authController.js'
import verifyOtpMiddleware from "../middleware/verifyOtp.js";

router.post("/send-otp", sendOtp);
router.post("/register", verifyOtpMiddleware('registration'), register);
router.post("/forgot-password", verifyOtpMiddleware('password_reset'), (req, res) => {
    res.status(200).json({ message: "forgot pass wip" });
});
router.post("/login", login);
router.post("/logout", logout);

export default router;