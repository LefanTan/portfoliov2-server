import { NextFunction, Request, Response } from "express";
import db from "../models";
import { UserAuthRequest } from "../types/request";

const checkDuplicateUsernameOrEmail = (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Check if username exist
  db.user
    .findOne({
      where: {
        username: req.body.username || null,
      },
    })
    .then((user) => {
      if (user) {
        return res.status(400).send({
          message: "Error: Username already in use",
        });
      }

      db.user
        .findOne({
          where: {
            email: req.body.email || null,
          },
        })
        .then((email) => {
          if (email) {
            return res.status(400).send({
              message: "Error: Email already in use",
            });
          }

          next();
        });
    });
};

const checkRolesExisted = (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.body.roles) {
    req.body.roles.forEach((role: string) => {
      if (!db.ROLES.includes(req.body.roles)) {
        return res
          .status(400)
          .send({ message: `Error: "${role}" type doesn't exist` });
      }
    });
  }

  next();
};

const verifySignup = {
  checkRolesExisted: checkRolesExisted,
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

export default verifySignup;
