import { Router } from "express";
import authMiddleWare from "../middleware/authMiddleware.js";
import pdfMiddleware from "../middleware/pdfMiddleware.js";
import {
    deleteSem,
    getAllMissingCourses,
    handleAddCourses,
    handleCourseUpdate,
    handleDeleteCourses,
    handleEditCourse,
    handleDeleteCourseByType,
    handleGetAllCourses,
    uploadFile,
} from "../controller/semesterController.js";
import multer from "multer";

const router = Router();

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

// File filter to only accept PDFs
const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: pdfFileFilter
});

// Wrapper to handle multer errors
const uploadWithErrorHandling = (req, res, next) => {
    upload.single("pdf")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size exceeds 1MB limit' });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

router.post(
    "/upload",
    authMiddleWare,
    uploadWithErrorHandling,
    pdfMiddleware,
    uploadFile
);
// delete user added courses
router.delete("/deleteCourse", authMiddleWare, handleDeleteCourses);

router.get("/getAllCourses", authMiddleWare, handleGetAllCourses);
router.post("/addCourses", authMiddleWare, handleAddCourses);
router.put("/updateCourse", authMiddleWare, handleCourseUpdate);
router.put("/editCourse", authMiddleWare, handleEditCourse);
router.delete("/deleteCourseById", authMiddleWare, handleDeleteCourseByType);
router.get("/missingCourses", getAllMissingCourses);
router.delete("/:semester", authMiddleWare, deleteSem);

export default router;
