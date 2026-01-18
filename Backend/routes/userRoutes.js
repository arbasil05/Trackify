import express from "express";
import {
    userDetails,
    updateProfile,
    recommendation,
    courseByUserWithUserAdded,
    getAchievements
} from "../controller/userController.js";
import authMiddleWare from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/userDetails", authMiddleWare, userDetails);
router.get("/courseByUser", authMiddleWare, courseByUserWithUserAdded);
router.get("/recommendation",authMiddleWare,recommendation);
router.put("/updateProfile",authMiddleWare,updateProfile);
router.get("/achievements", authMiddleWare, getAchievements);

export default router;
