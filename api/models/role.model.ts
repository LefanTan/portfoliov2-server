import { INTEGER, Sequelize, STRING } from "sequelize";

export default function roleInit(sequelize: Sequelize) {
  const Role = sequelize.define("roles", {
    id: {
      type: INTEGER,
      primaryKey: true,
    },
    name: {
      type: STRING,
    },
  });

  return Role;
}
