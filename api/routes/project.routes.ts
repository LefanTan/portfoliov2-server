import { Router } from "express";
import { check } from "express-validator";
import projectController from "../controllers/project.controller";
import authJwt from "../middleware/authJwt";
import { projectValidate } from "../middleware/project.validation";

const projectRoutes = Router();

projectRoutes.use(authJwt.verifyToken);

/**
 * @swagger
 * tags:
 *  name: Project
 *  description: api related to Projects
 */

/**
 * @swagger
 *  /projects/{userId}:
 *      get:
 *          summary: Get information on all projects associated with User
 *          tags: [Project]
 *          responses:
 *              "200":
 *                  description: returns all the project belonged to userId
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/Project"
 */
projectRoutes.get("/projects/:id", projectController.getAllProjects);

/**
 * @swagger
 *  /project/{projectId}:
 *      get:
 *          summary: Get information on a specific project
 *          tags: [Project]
 *          responses:
 *              "200":
 *                  description: returns the project
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/Project"
 */
projectRoutes.get("/project/:projectId", projectController.getProject);

/**
 * @swagger
 *  /projects/{userId}:
 *      post:
 *          summary: Create a new project
 *          tags: [Project]
 *          responses:
 *              "200":
 *                  description: returns the created project
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/Project"
 */
projectRoutes.post(
  "/projects/:id",
  [check("title").exists().isString(), ...projectValidate],
  projectController.createProject
);

/**
 * @swagger
 *  /project/{projectId}:
 *      put:
 *          summary: Updates a project
 *          tags: [Project]
 *          responses:
 *              "200":
 *                  description: returns the updated project
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/Project"
 */
projectRoutes.put(
  "/project/:projectId",
  projectValidate,
  projectController.updateProject
);

/**
 * @swagger
 *  /project/{projectId}:
 *      put:
 *          summary: Delete a project
 *          tags: [Project]
 *          responses:
 *              "200":
 *                  description: successfully deleted the project
 */
projectRoutes.delete("/project/:projectId", projectController.deleteProject);

export default projectRoutes;
