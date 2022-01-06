import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Dialect } from "sequelize";
import User from "../models/user.model";
import Profile from "../models/profile.model";
import Role from "../models/role.model";
import UserRoles from "../models/user_roles.model";
import Project from "../models/project.model";

require("dotenv").config();

const config: SequelizeOptions = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT!),
  host: process.env.DB_HOST,
  logging: process.env.DB_LOGGING === "true",
  storage: ":memory:",
  dialect: "mysql",
  models: [User, Profile, Role, UserRoles, Project],
};

// Intialize sequelize connection
const sequelizeConnection = new Sequelize(config);
sequelizeConnection
  .authenticate()
  .then(() => console.log("Sequelize Connection established"))
  .catch((err) => console.error("Unable to connect to database: ", err));

export default sequelizeConnection;
