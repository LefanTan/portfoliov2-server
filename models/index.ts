import config from "../config/db.config";
import userInit from "./user.model";
import { Model, ModelCtor, Sequelize } from "sequelize";

type DB = {
  sequelize: Sequelize;
  user: ModelCtor<Model>;
};

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
});

const db: DB = { sequelize: sequelize, user: userInit(sequelize) };

export default db;
