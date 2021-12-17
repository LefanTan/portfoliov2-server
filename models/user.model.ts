import { Sequelize, STRING } from "sequelize";

export default function userInit(sequelize: Sequelize) {
  const User = sequelize.define("users", {
    username: {
      type: STRING,
    },
    email: {
      type: STRING,
    },
    password: {
      type: STRING,
    },
  });

  return User;
}
