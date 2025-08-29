import express from "express";
import {
    login,
    logout,
    register,
    uploadFile,
    userDetails,
    courseByUser,
    deleteSem,
    updateProfile,
    recommendation,
    getExistingSemesters
} from "../controller/trackifyController.js";
import multer from "multer";
import { pdfMiddleware } from "../middleware/pdfMiddleware.js";
import authMiddleWare from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post(
    "/upload",
    authMiddleWare,
    upload.single("pdf"),
    pdfMiddleware,
    uploadFile
);

router.get("/userDetails", authMiddleWare, userDetails);
router.get("/courseByUser", authMiddleWare, courseByUser);
router.get("/recommendation",authMiddleWare,recommendation);

router.put("/updateProfile",authMiddleWare,updateProfile)

router.delete("/semester/:semester", authMiddleWare, deleteSem);
router.get("/existingSemesters", authMiddleWare, getExistingSemesters);


export default router;
