import { Dialect } from "sequelize";

const config = {
  HOST: "mysql",
  USER: "root",
  PASSWORD: "admin",
  DB: "portfolio",
  dialect: "mysql" as Dialect,
};
export default config;
