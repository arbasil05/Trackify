import express from "express";
import {
    userDetails,
    courseByUser,
    updateProfile,
    recommendation,
    courseByUserWithUserAdded,
} from "../controller/userController.js";
import authMiddleWare from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/userDetails", authMiddleWare, userDetails);
router.get("/courseByUser", authMiddleWare, courseByUser);
router.get("/courseByUserAdded",authMiddleWare,courseByUserWithUserAdded);
router.get("/recommendation",authMiddleWare,recommendation);
router.put("/updateProfile",authMiddleWare,updateProfile);

export default router;
