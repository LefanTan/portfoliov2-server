import { AllowNull, Column, Model, Table } from "sequelize-typescript";
import { ARRAY, STRING } from "sequelize";

@Table
export default class Project extends Model {
  @AllowNull(false)
  @Column
  title: string;

  @Column
  description: string;

  @Column
  mainDemoUrl: string;

  @Column
  stack: string;

  @Column
  link: string;

  @Column
  repo: string;

  @Column
  purposeAndGoal: string;

  @Column
  problems: string;

  @Column
  lessonsLearned: string;

  @Column
  inProgress: boolean;
}
