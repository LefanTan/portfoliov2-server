import { Router } from "express";
import userController from "../controllers/user.controller";
import authJwt from "../middleware/authJwt";

const userRoutes = Router();
export default userRoutes;

/**
 * COMMENTS:
 * No need for a POST method, since user and profile is created during sign up
 */

userRoutes.get("/", [authJwt.verifyToken], userController.userBoard);
userRoutes.get("/:id", [authJwt.verifyToken], userController.getUser);
userRoutes.put("/:id", [authJwt.verifyToken], userController.updateUser);
userRoutes.delete("/:id", [authJwt.verifyToken], userController.deleteUser);
