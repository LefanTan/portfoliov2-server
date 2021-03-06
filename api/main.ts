import express from "express";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import userRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";
import profileRoutes from "./routes/profile.routes";
import fileUpload from "express-fileupload";
import swaggerJsdoc from "swagger-jsdoc";

require("dotenv").config();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJson = require("./swagger.json");

export const TEMP_STORAGE_PATH = __dirname + "/tmp";
export function main() {
  var app = express();

  /**
   * Setup Global Middlewares
   */

  app.use(cookieParser());

  // Allow the following response headers
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      //"x-access-token, Origin, Content-Type, Accept"
      "x-access-token, Content-Type, Authorization"
    );

    // Credentials: If client request with this set to true,
    // browser will expose the respond to the client
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  // Enable CORS on all origin
  // Access-Control-Allow-Origin: *
  app.use(cors());

  // parse requests of content-type - application/json
  app.use(express.json());

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  // parse requests of content-type - multipart/form-data
  // Limits to 250mb file upload
  app.use(
    fileUpload({
      limits: { fileSize: 1048576 * 250 },
      useTempFiles: true,
      tempFileDir: TEMP_STORAGE_PATH,
    })
  );

  // use src folder to serve static html
  app.use(express.static("src"));

  // serve swagger docs
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsdoc(swaggerJson), { explorer: true })
  );

  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use(projectRoutes);
  app.use("/profile", profileRoutes);

  return app;
}
