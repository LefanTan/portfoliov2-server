import { Sequelize } from "sequelize-typescript";
import config from "../config/db.config";

// Intialize sequelize connection
const sequelizeConnection = new Sequelize({
  username: config.USER,
  password: config.PASSWORD,
  database: config.DB,
  storage: ":memory:",
  host: config.HOST,
  dialect: "mysql",
  models: [__dirname + "/**/*.model.ts"],
});
export default sequelizeConnection;
