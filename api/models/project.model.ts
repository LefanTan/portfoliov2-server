import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user.model";

@Table
export default class Project extends Model {
  @AllowNull(false)
  @Column
  title: string;

  @Column(DataType.TEXT)
  shortDescription: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.TEXT)
  mainMediaUrl: string;

  @Column(DataType.JSON)
  mediaUrls: string[];

  @Column(DataType.JSON)
  stack: string[];

  @Column
  link: string;

  @Column
  repo: string;

  @Column
  type: string;

  @Column(DataType.TEXT)
  purposeAndGoal: string;

  @Column(DataType.TEXT)
  problems: string;

  @Column(DataType.TEXT)
  lessonsLearned: string;

  @Default(false)
  @Column
  inProgress: boolean;

  @Default(0)
  @Column
  order: number;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User, { onDelete: "CASCADE" })
  user: User;
}
