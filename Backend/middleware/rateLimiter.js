import rateLimit from 'express-rate-limit';

export const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3,
    message: { error: "Too many OTP requests, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
    
});

export const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: { error: "Too many login attempts, please try again after 10 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});