import express from "express";
import { login, logout, register,protectedRoute,uploadFile,userDetails,courseByUser } from "../controller/trackifyController.js";
import multer from "multer";
import { pdfMiddleware } from "../middleware/pdfMiddleware.js";
import authMiddleWare from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer();

router.post("/register", register);
router.post("/login", login);
router.post("/logout",logout);
router.post("/upload",upload.single('pdf'),pdfMiddleware,uploadFile);

router.get("/protected",protectedRoute);
router.get("/userDetails",authMiddleWare,userDetails);
router.get("/coruseByUser",authMiddleWare,courseByUser);

export default router;