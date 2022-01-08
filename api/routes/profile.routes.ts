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

/**
 * @swagger
 * tags:
 *  name: Profile
 *  description: api related to Profiles
 */

/**
 * @swagger
 *  /user/{userId}:
 *      get:
 *          summary: Get information on the user and it's profile
 *          tags: [Profile]
 *          responses:
 *              "200":
 *                  description: returns the profile
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/Profile"
 */
profileRoutes.get("/:userId", profileController.getProfile);

/**
 * @swagger
 *  /user/{userId}:
 *      put:
 *          summary: Update information on the user and it's profile
 *          tags: [Profile]
 *          responses:
 *              "200":
 *                  description: returns the updated profile
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/Profile"
 */
profileRoutes.put("/:userId", profileController.updateProfile);
