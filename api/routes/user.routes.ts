import { Router } from "express";
import userController from "../controllers/user.controller";
import { updateUserValidate } from "../middleware/auth.validation";
import authJwt from "../middleware/authJwt";

const userRoutes = Router();
export default userRoutes;

/**
 * COMMENTS:
 * No need for a POST method, since user and profile is created during sign up
 */

userRoutes.use(authJwt.verifyToken);

userRoutes.get("/", userController.userBoard);
userRoutes.get("/:id", userController.getUser);
userRoutes.put("/:id", updateUserValidate, userController.updateUser);
userRoutes.delete("/:id", userController.deleteUser);
