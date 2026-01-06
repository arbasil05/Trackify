import { Router } from "express";
import authMiddleWare from "../middleware/authMiddleware.js";
import pdfMiddleware from "../middleware/pdfMiddleware.js";
import {
    deleteSem,
    getExistingSemesters,
    handleAddCourses,
    handleCourseUpdate,
    handleDeleteCourses,
    handleGetUserAddedCourses,
    handlGetAllCourses,
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

router.get("/existingSemesters", authMiddleWare, getExistingSemesters);
router.get("/getCourses", authMiddleWare, handleGetUserAddedCourses);
router.get("/getAllCourses", authMiddleWare, handlGetAllCourses);
router.post("/addCourses", authMiddleWare, handleAddCourses);
router.put("/updateCourse", authMiddleWare, handleCourseUpdate);
router.delete("/:semester", authMiddleWare, deleteSem);

export default router;
