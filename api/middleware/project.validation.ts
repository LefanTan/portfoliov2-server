import { check } from "express-validator";

// Make sure types are correct for project
export const projectValidate = [
  check("title").isString().exists().withMessage("Title is required"),
  check("shortDescription")
    .isString()
    .exists()
    .withMessage("Description is required"),
];
