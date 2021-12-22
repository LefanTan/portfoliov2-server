import { check, oneOf } from "express-validator";
import db from "../models";

const checkIfRolesExisted = check("roles")
  .isIn(db.ROLES)
  .withMessage("Invalid Roles type");

const checkDuplicateUsernameOrEmail = check("username").custom(
  (username, { req }) => {
    // Check if username exist
    return db.user
      .findOne({
        where: {
          username: username || null,
        },
      })
      .then((user) => {
        if (user) {
          return Promise.reject("Username already in use");
        }

        db.user
          .findOne({
            where: {
              email: req.body.email || null,
            },
          })
          .then((email) => {
            if (email) {
              return Promise.reject("Email already in use");
            }
          });
      });
  }
);

export const signupValidate = [
  check("username").exists().withMessage("Username can not be empty"),
  check("password").exists().withMessage("Password can not be empty"),
  check("email").exists().withMessage("Email can not be empty"),
  checkIfRolesExisted,
  checkDuplicateUsernameOrEmail,
];

export const signinValidate = [
  oneOf(
    [check("username").exists(), check("email").exists()],
    "Either username or email needed"
  ),
  check("password").exists().withMessage("Password can not be empty"),
];
