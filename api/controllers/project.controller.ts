import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { resolve } from "path/posix";
import db from "../config/db.config";
import portfolioStorage from "../config/storage.config";
import Project from "../models/project.model";

const fs = require("fs");

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

      user
        .$get("projects")
        .then((projects) => res.send(projects))
        .catch((err) => res.status(404).send({ error: err }));
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
        clearProjectBucket(project).then(() =>
          res.send({
            message: `Project - {${req.params.projectId}} successfully deleted`,
          })
        )
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
      include: [Project],
    })
    .then((user) => {
      if (!user)
        return res
          .status(400)
          .send({ error: `user id - {${req.params.userId}} doesn't exist` });

      const largestOrder = user.projects.length > 0 ? user.projects.sort((a, b) => b.order - a.order)[0]
        .order : 0;

      console.log(largestOrder + 1);

      db.project
        .create({
          ...req.body,
          order: largestOrder + 1,
        })
        .then(async (project) => {
          let [newMainMediaUrl, newMediaUrls] = await uploadProjectMedia(
            req,
            project
          );
          newMediaUrls = Array.isArray(newMediaUrls)
            ? newMediaUrls
            : [newMediaUrls];

          let oldMediaUrls = req.body.mediaUrls
            ? Array.isArray(req.body.mediaUrls)
              ? req.body.mediaUrls
              : [req.body.mediaUrls]
            : [];

          project
            .update({
              mediaUrls: newMediaUrls.concat(oldMediaUrls),
              mainMediaUrl: newMainMediaUrl,
            })
            .then((project) => {
              clearProjectBucket(project).then((project) =>
                user.$add("project", project).then(() => res.send(project))
              );
            });
        });
    });
};

/**
 * Update a Project
 * @param req.params.projectId
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
    .then(async (project) => {
      if (!project)
        return res.status(400).send({
          error: `project id - {${req.params.projectId}} doesn't exist`,
        });

      let [newMainMediaUrl, newMediaUrls] = await uploadProjectMedia(
        req,
        project
      );
      newMediaUrls = Array.isArray(newMediaUrls)
        ? newMediaUrls
        : [newMediaUrls];

      let oldMediaUrls = req.body.mediaUrls
        ? Array.isArray(req.body.mediaUrls)
          ? req.body.mediaUrls
          : [req.body.mediaUrls]
        : [];

      project
        .update({
          ...req.body,
          mediaUrls: newMediaUrls.concat(oldMediaUrls),
          mainMediaUrl: newMainMediaUrl || req.body.mainMediaUrl,
        })
        .then((project) => {
          clearProjectBucket(project).then((project) => res.send(project));
        });
    });
};

const uploadProjectMedia = async (req: Request, project: Project) => {
  let mainMediaUrl: string = "";
  let mediaUrls: string[] = [];

  if (req.files?.mainMedia && !Array.isArray(req.files.mainMedia)) {
    mainMediaUrl = await portfolioStorage.uploadFile(
      portfolioStorage.projectBucket,
      req.files.mainMedia.tempFilePath,
      `${project.userId}/${project.id}/${req.files.mainMedia.name}`
    );

    try {
      fs.unlinkSync(req.files.mainMedia.tempFilePath);
    } catch (err) {
      console.error(err);
    }
  }

  if (req.files?.medias) {
    let mediaList = Array.isArray(req.files.medias)
      ? req.files.medias
      : [req.files.medias];
    let tasks: Promise<string>[] = [];

    mediaList.forEach((media) =>
      tasks.push(
        portfolioStorage.uploadFile(
          portfolioStorage.projectBucket,
          media.tempFilePath,
          `${project.userId}/${project.id}/${media.name}`
        )
      )
    );

    mediaUrls = mediaUrls.concat(await Promise.all(tasks));

    // Delete all files after they're uploaded
    mediaList.forEach((media) => {
      try {
        fs.unlinkSync(media.tempFilePath);
      } catch (err) {
        console.error(err);
      }
    });
  }

  return [mainMediaUrl, mediaUrls];
};

const clearProjectBucket = (project: Project) => {
  // Delete all files not used by checking if the file name is present
  // in any of the links
  // This is by no means efficient, because uuid changes everytime,
  // the same file might be replaced instead of getting reused again,
  // Definitely should revisit this function
  return portfolioStorage.projectBucket
    .getFiles({
      autoPaginate: false,
      prefix: `${project.userId}/${project.id}`,
    })
    .then((data) => {
      // Overkill for sure, but I wanted to play around with
      // regex a little!
      let regex = new RegExp(`^(${project.userId}\/${project.id})\/`, "g");

      data[0].forEach((file) => {
        let fileName = encodeURIComponent(file.name.replace(regex, ""));

        if (
          project.mainMediaUrl?.includes(fileName) ||
          project.mediaUrls?.find((url) => url.includes(fileName))
        ) {
          return;
        }

        console.log(`Deleting ${fileName}...`);
        portfolioStorage.projectBucket.file(file.name).delete();
      });

      return project;
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
