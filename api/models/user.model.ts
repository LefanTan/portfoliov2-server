import {
  Table,
  Column,
  Model,
  BelongsToMany,
  ForeignKey,
} from "sequelize-typescript";
import Role from "./role.model";
import UserRoles from "./user_roles.model";

@Table
export default class User extends Model {
  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}
