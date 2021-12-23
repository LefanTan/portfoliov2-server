import { Sequelize } from "sequelize-typescript";
import sequelizeConnection from "./sequelize-connection";
import Role from "./role.model";
import User from "./user.model";
import Profile from "./profile.model";
import Project from "./project.model";

// Contain everything into one object
const db = {
  sequelize: sequelizeConnection,
  user: User,
  role: Role,
  profile: Profile,
  project: Project,
  ROLES: ["user", "admin"],
};

export default db;
