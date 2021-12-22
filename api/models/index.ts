import { Sequelize } from "sequelize-typescript";
import sequelizeConnection from "./sequelize-connection";
import Role from "./role.model";
import User from "./user.model";

// Contain everything into one object
const db = {
  sequelize: sequelizeConnection,
  user: User,
  role: Role,
  ROLES: ["user", "admin"],
};

export default db;
