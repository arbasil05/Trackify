import { Router } from "express";
import authMiddleWare from "../middleware/authMiddleware.js";
import pdfMiddleware  from "../middleware/pdfMiddleware.js";
import { deleteSem, getExistingSemesters, uploadFile } from "../controller/semesterController.js";

const router = Router();

import multer from "multer";

const upload = multer();

router.post(
    "/upload",
    authMiddleWare,
    upload.single("pdf"),
    pdfMiddleware,
    uploadFile
);
router.delete("/:semester", authMiddleWare, deleteSem);
router.get("/existingSemesters", authMiddleWare, getExistingSemesters);

export default router;