import rateLimit from "express-rate-limit";

export const feedbackLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: { message: "Too many feedback submissions. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
