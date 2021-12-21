import config from "../config/db.config";
import userInit from "./user.model";
import { Model, ModelCtor, Sequelize } from "sequelize";
import roleInit from "./role.model";

type DB = {
  sequelize: Sequelize;
  user: ModelCtor<Model>;
  role: ModelCtor<Model>;
  ROLES: string[];
};

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
});

// Initialize the DB instance
const db: DB = {
  sequelize: sequelize,
  user: userInit(sequelize),
  role: roleInit(sequelize),
  ROLES: ["user", "admin"],
};

// Setup relationships
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
});

export default db;
