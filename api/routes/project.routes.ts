import { Router } from "express";
import { check } from "express-validator";
import projectController from "../controllers/project.controller";
import authJwt from "../middleware/authJwt";
import { projectValidate } from "../middleware/project.validation";

const projectRoutes = Router();

projectRoutes.use(authJwt.verifyToken);

projectRoutes.get("/projects/:userId", projectController.getAllProjects);
projectRoutes.get("/project/:projectId", projectController.getProject);
projectRoutes.post(
  "/projects/:userId",
  [check("title").exists().isString(), ...projectValidate],
  projectController.createProject
);
projectRoutes.put(
  "/project/:projectId",
  projectValidate,
  projectController.updateProject
);
projectRoutes.delete("/project/:projectId", projectController.deleteProject);

export default projectRoutes;
