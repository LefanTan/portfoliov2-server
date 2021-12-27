import {
  Table,
  Column,
  Model,
  BelongsToMany,
  ForeignKey,
  HasOne,
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import Profile from "./profile.model";
import Project from "./project.model";
import Role from "./role.model";
import UserRoles from "./user_roles.model";

@Table
export default class User extends Model {
  @AllowNull(false)
  @Column
  username: string;

  @Column
  email: string;

  @AllowNull(false)
  @Column
  password: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @HasOne(() => Profile)
  profile: Profile;

  @HasMany(() => Project)
  projects: Project[];
}
