import { Router } from "express";
import userController from "../controllers/user.controller";
import authJwt from "../middleware/authJwt";

const userRoutes = Router();
export default userRoutes;

userRoutes.get("/all", userController.allAccess);
userRoutes.get("/user", [authJwt.verifyToken], userController.userBoard);
userRoutes.get(
  "/admin",
  [authJwt.isAdmin, authJwt.verifyToken],
  userController.adminBoard
);
