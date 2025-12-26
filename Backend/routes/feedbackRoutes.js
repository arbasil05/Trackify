import { Router } from "express";
import { submitFeedback } from "../controller/feedbackController.js";
import { validateFeedback } from "../middleware/feedbackValidation.js";

const router = Router();

router.post("/", validateFeedback, submitFeedback);

export default router;