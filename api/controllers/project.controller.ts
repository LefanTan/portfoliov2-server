import { Request, Response } from "express";
import { validationResult } from "express-validator";
import db from "../config/db.config";

/**
 * Return all projects belong to a User
 * @param req.params.userId
 */
const getAllProjects = (req: Request, res: Response) => {
  db.user
    .findOne({
      where: {
        id: req.params.userId,
      },
    })
    .then((user) => {
      if (!user)
        return res
          .status(400)
          .send({ error: `user id - ${req.params.userId} doesn't exist` });

      user.$get("projects").then((projects) => res.send(projects));
    });
};

/**
 * Return a Project based on its id
 * @param req.params.projectId
 */
const getProject = (req: Request, res: Response) => {
  db.project
    .findOne({
      where: {
        id: req.params.projectId,
      },
    })
    .then((project) => {
      if (!project)
        return res.status(400).send({
          error: `project id - {${req.params.projectId}} doesn't exist`,
        });

      return res.send(project);
    });
};

/**
 * Delete a Project based on its id
 * @param req.params.projectId
 */
const deleteProject = (req: Request, res: Response) => {
  db.project
    .findOne({
      where: {
        id: req.params.projectId,
      },
    })
    .then((project) => {
      if (!project)
        return res.status(400).send({
          error: `project id - {${req.params.projectId}} doesn't exist`,
        });

      project.destroy().then(() =>
        res.send({
          message: `Project - {${req.params.projectId}} successfully deleted`,
        })
      );
    });
};

/**
 * Create a Project for a User
 * @param req.params.userId
 */
const createProject = (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).send({ error: error.array() });
  }

  db.user
    .findOne({
      where: {
        id: req.params.userId,
      },
    })
    .then((user) => {
      if (!user)
        return res
          .status(400)
          .send({ error: `user id - {${req.params.userId}} doesn't exist` });

      db.project.create(req.body).then((project) => {
        user.$add("project", project).then(() => res.send(project));
      });
    });
};

/**
 * Update a Project
 * @param req.params.userId
 */
const updateProject = (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).send({ error: error.array() });
  }

  db.project
    .findOne({
      where: {
        id: req.params.projectId,
      },
    })
    .then((project) => {
      if (!project)
        return res.status(400).send({
          error: `project id - {${req.params.projectId}} doesn't exist`,
        });

      project.update(req.body).then(() => res.send(project));
    });
};

const projectController = {
  getAllProjects,
  getProject,
  deleteProject,
  createProject,
  updateProject,
};

export default projectController;
