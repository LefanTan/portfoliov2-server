import { Sequelize } from "sequelize-typescript";
import Profile from "../models/profile.model";
import Project from "../models/project.model";
import Role from "../models/role.model";
import User from "../models/user.model";
import sequelizeConnection from "./sequelize-connection";

type DB = {
  sequelize: Sequelize;
  user: typeof User;
  role: typeof Role;
  profile: typeof Profile;
  project: typeof Project;
  ROLES: string[];
};

// Contain everything into one object
const db: DB = {
  sequelize: sequelizeConnection,
  user: User,
  role: Role,
  profile: Profile,
  project: Project,
  ROLES: ["user", "admin"],
};

export default db;
