import { Router } from "express";
import authController from "../controllers/auth.controller";
import { signinValidate, signupValidate } from "../middleware/auth.validation";

const authRoutes = Router();
export default authRoutes;

authRoutes.post("/signup", signupValidate, authController.signup);
authRoutes.post("/signin", signinValidate, authController.signin);
