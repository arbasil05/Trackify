import express from "express";
import {
    login,
    logout,
    register,
    uploadFile,
    userDetails,
    courseByUser,
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

export default router;
