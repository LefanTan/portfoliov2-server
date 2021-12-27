import { Table, Model, ForeignKey } from "sequelize-typescript";
import Role from "./role.model";
import User from "./user.model";

@Table
export default class UserRoles extends Model {
  @ForeignKey(() => User)
  userId: number;

  @ForeignKey(() => Role)
  roleId: number;
}
