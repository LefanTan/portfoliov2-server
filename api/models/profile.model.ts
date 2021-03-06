import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user.model";

@Table
export default class Profile extends Model {
  @Column({})
  firstName: string;

  @Column
  lastName: string;

  @Column(DataType.TEXT)
  mainMediaUrl: string;

  @Column(DataType.JSON)
  mediaUrls: string[];

  @Column(DataType.TEXT)
  resumeUrl: string;

  @Column(DataType.TEXT)
  aboutMe: string;

  @Column
  github: string;

  @Column
  linkedin: string;

  @Column(DataType.JSON)
  skills: string[];

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User, {
    onDelete: "CASCADE",
  })
  user: User;
}
