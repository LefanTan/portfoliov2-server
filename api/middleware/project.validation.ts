import { check } from "express-validator";

// Make sure types are correct for project
export const projectValidate = [
  check("title").isString(),
  check("description").isString(),
  check("mainDemoUrl").isString(),
  check("stack").isString(),
  check("link").isString(),
  check("repo").isString(),
  check("purposeAndGoal").isString(),
  check("problems").isString(),
  check("lessonsLearned").isString(),
  check("inProgress").isBoolean(),
];
