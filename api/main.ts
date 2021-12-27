import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import userRoutes from "./routes/user.routes";

require("dotenv").config();
const cors = require("cors");

export function main() {
  var app = express();

  /**
   * Setup Global Middlewares
   */

  // Enable cors to all origins
  // Access-Control-Allow-Origin: *
  app.use(cors());

  // Allow the following response headers
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      //"x-access-token, Origin, Content-Type, Accept"
      "x-access-token"
    );
    next();
  });

  // parse requests of content-type - application/json
  app.use(express.json());

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  // use src folder to serve static html
  app.use(express.static("src"));

  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use("/project", projectRoutes);

  return app;
}
