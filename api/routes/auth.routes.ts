import { Router } from "express";
import authController from "../controllers/auth.controller";
import verifySignup from "../middleware/verifySignup";

const authRoutes = Router();
export default authRoutes;

authRoutes.post(
  "/signup",
  [verifySignup.checkDuplicateUsernameOrEmail, verifySignup.checkRolesExisted],
  authController.signup
);

authRoutes.post("/signin", authController.signin);
