import { Router } from "express";
import profileController from "../controllers/profile.controller";
import authJwt from "../middleware/authJwt";

const profileRoutes = Router();
export default profileRoutes;

profileRoutes.use(authJwt.verifyToken);

/**
 * NOTE: No post method for profile as each
 * user will have a profile created during signup
 */

profileRoutes.get("/:userId", profileController.getProfile);
profileRoutes.put("/:userId", profileController.updateProfile);
