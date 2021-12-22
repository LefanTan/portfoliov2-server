import {
  Model,
  Table,
  Column,
  BelongsToMany,
  PrimaryKey,
} from "sequelize-typescript";
import User from "./user.model";
import UserRoles from "./user_roles.model";

@Table
export default class Role extends Model {
  @PrimaryKey
  @Column
  id: number;

  @Column
  name: string;

  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}
