import { check, oneOf } from "express-validator";
import db from "../config/db.config";

const checkIfRolesExisted = oneOf([
  check("roles").isIn(db.ROLES).withMessage("Invalid Roles type"),
  check("roles").isEmpty(),
]);

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
  check("username").isString().withMessage("Username has to be alphanumeric"),
  check("email")
    .custom((value: string) => {
      if (
        !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
          value
        )
      ) {
        throw Promise.reject();
      }
      return true;
    })
    .withMessage("Not a valid email"),
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

export const updateUserValidate = [
  check("username")
    .isAlphanumeric()
    .withMessage("Username has to be alphanumeric"),
  check("email").custom((value: string) => {
    if (
      !value
        .toString()
        .match(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      throw Promise.reject("Not a valid email");
    }
  }),
];
