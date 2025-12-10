import { Router } from "express";
import { submitFeedback } from "../controller/feedbackController.js";
import { validateFeedback } from "../middleware/feedbackValidation.js";
import { feedbackLimiter } from "../middleware/rateLimitMiddleware.js";

const router = Router();

router.post("/", feedbackLimiter, validateFeedback, submitFeedback);

export default router;