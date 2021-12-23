import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";

const config = {
  HOST: "mysql",
  USER: "root",
  PASSWORD: "admin",
  DB: "portfolio",
  dialect: "mysql" as Dialect,
};

// Intialize sequelize connection
const sequelizeConnection = new Sequelize({
  username: config.USER,
  password: config.PASSWORD,
  database: config.DB,
  storage: ":memory:",
  host: config.HOST,
  dialect: "mysql",
  models: ["/app/**/*.model.ts"],
});

export default sequelizeConnection;
