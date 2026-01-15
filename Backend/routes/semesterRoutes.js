import { Router } from "express";
import authMiddleWare from "../middleware/authMiddleware.js";
import pdfMiddleware from "../middleware/pdfMiddleware.js";
import {
    deleteSem,
    getAllMissingCourses,
    getExistingSemesters,
    handleAddCourses,
    handleCourseUpdate,
    handleDeleteCourses,
    handleEditCourse,
    handleDeleteCourseByType,
    handleGetUserAddedCourses,
    handleGetAllCourses,
    uploadFile,
} from "../controller/semesterController.js";
import multer from "multer";

const router = Router();

const upload = multer();

router.post(
    "/upload",
    authMiddleWare,
    upload.single("pdf"),
    pdfMiddleware,
    uploadFile
);
// delete user added courses
router.delete("/deleteCourse", authMiddleWare, handleDeleteCourses);

// router.get("/existingSemesters", authMiddleWare, getExistingSemesters);
// router.get("/getCourses", authMiddleWare, handleGetUserAddedCourses);
router.get("/getAllCourses", authMiddleWare, handleGetAllCourses);
router.post("/addCourses", authMiddleWare, handleAddCourses);
router.put("/updateCourse", authMiddleWare, handleCourseUpdate);
router.put("/editCourse", authMiddleWare, handleEditCourse);
router.delete("/deleteCourseById", authMiddleWare, handleDeleteCourseByType);
router.get("/missingCourses", getAllMissingCourses);
router.delete("/:semester", authMiddleWare, deleteSem);

export default router;
