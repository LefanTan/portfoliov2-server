import { Router } from "express";
import { check } from "express-validator";
import projectController from "../controllers/project.controller";
import authJwt from "../middleware/authJwt";
import { projectValidate } from "../middleware/project.validation";

const projectRoutes = Router();

projectRoutes.use(authJwt.verifyToken);

projectRoutes.get("/:userId", projectController.getAllProjects);
projectRoutes.get("/:projectId", projectController.getProject);
projectRoutes.post(
  "/:userId",
  [check("title").exists().isString(), ...projectValidate],
  projectController.createProject
);
projectRoutes.put(
  "/:projectId",
  projectValidate,
  projectController.updateProject
);
projectRoutes.delete("/:projectId", projectController.deleteProject);

export default projectRoutes;
