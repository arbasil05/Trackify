import { Router } from "express";

const router = Router();

import { login, logout, register } from '../controller/authController.js'

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;