import { Router } from "express";
import authController from "../controllers/auth.controller";
import { signinValidate, signupValidate } from "../middleware/auth.validation";

const authRoutes = Router();
export default authRoutes;

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - username
 *              - password
 *          properties:
 *              id:
 *                  type: integer
 *                  description: auto-generated id of the User
 *              username:
 *                  type: string
 *                  description: username that belongs to the User
 *              password:
 *                  type: string
 *                  description: password that belongs to the User
 *              email:
 *                  type: string
 *                  description: email associated with user
 *              apiKey:
 *                  type: string
 *                  description: used to access information for this user
 *
 *      ApiKeyAuth:
 *          type: apiKey
 *          in: header
 *          name: Authorization
 *
 *      Profile:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: auto-generated id of the profile
 *              firstName:
 *                  type: string
 *              lastName:
 *                  type: string
 *              mainMediaUrl:
 *                  type: string
 *                  description: The url of the "Main" media asscociated with this profile, could be use as profile photo etc
 *              mediaUrls:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: An array of urls linked to any form of media, could be videos, photos, gifs.
 *              resumeUrl:
 *                  type: string
 *                  description: The url of the resume file
 *              aboutMe:
 *                  type: string
 *                  description: A quick description about the profile
 *              github:
 *                  type: string
 *                  description: Github URL
 *              linkedin:
 *                  type: string
 *                  description: LinkedIn URL
 *              skills:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: Skills such as "React", "Woodworking", "Fortnite" etc
 *      Projects:
 *          type: object
 *          required:
 *              - title
 *              - description
 *          properties:
 *              id:
 *                  type: integer
 *                  description: auto-generated id of the project
 *              title:
 *                  type: string
 *                  description: auto-generated id of the project
 *              description:
 *                  type: string
 *                  description: auto-generated id of the project
 *              mainMediaUrl:
 *                  type: string
 *                  description: The url of the "Main" media asscociated with this project, could be a photo of your project's Home Pageetc
 *              mediaUrls:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: An array of urls linked to any form of media, could be videos, photos, gifs.
 *              repo:
 *                  type: string
 *                  description: link to the repo of this project
 *              link:
 *                  type: string
 *                  description: link to the website of this project
 *              type:
 *                  type: string
 *                  description: work, academic, personal
 *              stack:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: The tech stack associated with this project
 *              purposeAndGoal:
 *                  type: string
 *                  description: Why start this project
 *              problems:
 *                  type: string
 *                  description: Talk about the problems that came up during this project
 *              lessonsLearned:
 *                  type: string
 *                  description: What did you learn
 *              inProgress:
 *                  type: boolean
 *                  description: Is this project in progress
 *              order:
 *                  type: integer
 *                  description: order of this project relative to the user's other projects
 */

/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: api to authenticate user
 */

/**
 * @swagger
 *  /auth/signup/:
 *      post:
 *          summary: Creates a new user
 *          tags: [Authentication]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/User"
 *          responses:
 *              "200":
 *                  description: returns the created user
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/User"
 */
authRoutes.post("/signup", signupValidate, authController.signup);

/**
 * @swagger
 *  /auth/signin/:
 *      post:
 *          summary: Signs in to an existing account
 *          tags: [Authentication]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/User"
 *          responses:
 *              "200":
 *                  description: Successfully authenticated the user
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/User"
 *              "400":
 *                  description: Bad request
 *              "401":
 *                  description: Unauthorized
 */
authRoutes.post("/signin", signinValidate, authController.signin);

/**
 * @swagger
 *  /auth/signout/:
 *      post:
 *          summary: Clears the jwt cookie on the client
 *          tags: [Authentication]
 */
authRoutes.post("/signout", authController.signout);
