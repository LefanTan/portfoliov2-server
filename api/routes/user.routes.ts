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
userRoutes.get("/:id", authJwt.verifyTokenIdMatching, userController.getUser);
userRoutes.put(
  "/:id",
  [...updateUserValidate, authJwt.verifyTokenIdMatching],
  userController.updateUser
);
userRoutes.delete(
  "/:id",
  authJwt.verifyTokenIdMatching,
  userController.deleteUser
);

//userRoutes.post('/signout/:id), userController.signout);
