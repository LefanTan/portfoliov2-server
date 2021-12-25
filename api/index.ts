import { Op } from "sequelize";
import { main } from "./main";
import db from "./config/db.config";

require("dotenv").config();

const PORT = process.env.PORT || 3001;
const faker = require("faker");
const bcrypt = require("bcryptjs");

main().listen(PORT, () => {
  console.log("app listening on port " + PORT);
});

// force = true only during development, as it drops all data
// use alter?
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync DB");
  init();
});

// seed some data
const init = () => {
  db.ROLES.forEach((type, idx) => db.role.create({ id: idx + 1, name: type }));

  db.user
    .create({
      username: "lefan",
      password: bcrypt.hashSync("admin", 8),
      email: "lefantan@hotmail.com",
    })
    .then((user) => {
      db.role.findOne({ where: { name: "admin" } }).then((role) => {
        user.$add("role", role!);
      });

      db.profile
        .create({
          id: user.id,
        })
        .then((profile) => user.$set("profile", profile));
    });

  // Create 10 users and their profile
  for (let i = 0; i < 10; i++) {
    db.user
      .create({
        username: faker.internet.userName(),
        password: bcrypt.hashSync(faker.internet.password(), 8),
        email: faker.internet.email().toLowerCase(),
      })
      .then((user) => {
        db.role
          .findAll({
            where: { [Op.or]: [{ name: "user" }, { name: "admin" }] },
          })
          .then((roles) => {
            roles.forEach((role) => user.$add("role", role!));
          });

        db.profile
          .create({
            id: user.id,
          })
          .then((profile) => user.$set("profile", profile));
      });
  }
};
