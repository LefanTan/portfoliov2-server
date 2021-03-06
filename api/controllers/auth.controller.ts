import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import db from "../config/db.config";
import authJwt from "../middleware/authJwt";
import Role from "../models/role.model";
import User from "../models/user.model";
import { UserAuthRequest } from "../types/request";
import moment from "moment";

const bcrypt = require("bcryptjs");

const signup = (req: UserAuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  // Save user data to database
  db.user
    .create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    })
    .then((user) => {
      // Check if roles is provided, if not, set role as "user"
      if (req.body.roles) {
        db.role
          .findAll({
            where: {
              name: {
                [Op.or]: req.body.roles,
              },
            },
          })
          .then((roles) => {
            user.$set("roles", roles).then(() => {
              // Token will expire in 5hrs
              let token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET || authJwt.default_secret,
                { expiresIn: "5h" }
              );
              res.cookie("jwt", token, {
                maxAge: req.body.rememberMe
                  ? moment.duration(30, "days").asMilliseconds()
                  : moment.duration(5, "hours").asMilliseconds(),
                sameSite: true,
                httpOnly: true, // prevents front-end javascript from accessing cookie
                secure: false, // set true if using https
              });
              res.send({
                message: "User created successfully",
                user: {
                  id: user.id,
                  email: user.email,
                  username: user.username,
                },
              });
            });
          });
      } else {
        // Add "user" role to this user
        db.role
          .findOne({ where: { name: "user" } })
          .then((role) => user.$add("role", role!))
          .then(() =>
            res.send({
              message: "User created successfully",
              user: { id: user.id, email: user.email, username: user.username },
            })
          );
      }

      // Create profile for the user
      db.profile
        .create({
          userId: user.id,
        })
        .then((profile) => user.$set("profile", profile));
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const signin = (req: UserAuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  User.findOne({
    where: {
      [Op.or]: {
        username: req.body.username || null,
        email: req.body.email || null,
      },
    },
    include: [Role],
  }).then((user) => {
    if (user) {
      // Check if request password is the same as the one in db
      let validPassword = bcrypt.compareSync(req.body.password, user.password);

      if (!validPassword) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      // Token will expire in 30 days or 5 hrs
      let token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || authJwt.default_secret,
        { expiresIn: req.body.rememberMe ? "30d" : "5h" }
      );

      user.$get("roles").then(() => {
        res.cookie("jwt", token, {
          maxAge: req.body.rememberMe
            ? moment.duration(30, "days").asMilliseconds()
            : moment.duration(5, "hours").asMilliseconds(),
          sameSite: true,
          httpOnly: true, // prevents front-end javascript from accessing cookie
          secure: false, // set true if using https
        });
        return res.send({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      });
    } else {
      return res.status(404).send({ message: "User not found" });
    }
  });
};

const signout = (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: true,
    secure: false,
  });
  return res.send({ message: "Signout successful" });
};

const authController = {
  signup,
  signin,
  signout,
};
export default authController;
