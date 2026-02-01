import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';

// Middleware to ensure every user has a guest_id
export const guestIdentifier = (req, res, next) => {

    if (!req.cookies.guest_id) {
        const guestId = randomUUID();
        const isProduction = process.env.NODE_ENV === 'production';
        
        res.cookie('guest_id', guestId, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
        });

        req.cookies.guest_id = guestId;
    }
    next();
};

const keyGenerator = (req) => {
    // 1. Authenticated User 
    if (req.id) return req.id;

    // 2. Guest ID for unauthenticated users
    if (req.cookies && req.cookies.guest_id) {
        return req.cookies.guest_id;
    }
    // 3. IP Fallback
    console.log(req.ip);
    return req.ip;
};

export const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3,
    message: { error: "Too many OTP requests, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyGenerator,
});

export const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3,
    message: { error: "Too many password reset attempts, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyGenerator,
});


export const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: { error: "Too many login attempts, please try again after 10 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: keyGenerator,
});

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, 
    message: { error: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyGenerator,
});