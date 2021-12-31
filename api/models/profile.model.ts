import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user.model";

@Table
export default class Profile extends Model {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  profilePhotoUrl: string;

  @Column
  otherPhotosUrl: string;

  @Column
  resumePdfUrl: string;

  @Column
  aboutMe: string;

  @Column
  github: string;

  @Column
  linkedin: string;

  @Column
  skills: string;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User, {
    onDelete: "CASCADE",
  })
  user: User;
}
