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

/**
 * @swagger
 * tags:
 *  name: User
 *  description: api to related to User and their Profile
 */

userRoutes.get("/", userController.userBoard);

/**
 * @swagger
 *  /user/{id}:
 *      get:
 *          summary: Get information on the user and it's profile
 *          tags: [User]
 *          responses:
 *              "200":
 *                  description: returns the user and profile
 */
userRoutes.get("/:id", authJwt.verifyTokenIdMatching, userController.getUser);

/**
 * @swagger
 *  /user/{id}:
 *      put:
 *          summary: Update information on the user and it's profile
 *          tags: [User]
 *          responses:
 *              "200":
 *                  description: returns the updated user and profile
 */
userRoutes.put(
  "/:id",
  [...updateUserValidate, authJwt.verifyTokenIdMatching],
  userController.updateUser
);

/**
 * @swagger
 *  /user/{id}:
 *      delete:
 *          summary: Deletes the user and its profile
 *          tags: [User]
 *          responses:
 *              "200":
 *                  description: Deletion successful
 */
userRoutes.delete(
  "/:id",
  authJwt.verifyTokenIdMatching,
  userController.deleteUser
);

/**
 * @swagger
 *  /user/{id}/generate:
 *      post:
 *          summary: Generate a new API Key associated to the user
 *          tags: [User]
 *          responses:
 *              "200":
 *                  description: Returns the newly generated api key
 *                  content:
 *                      text/plain:
 *                          schema:
 *                            type: string
 *
 */
userRoutes.post(
  "/:id/generate",
  authJwt.verifyTokenIdMatching,
  userController.createApiKey
);
