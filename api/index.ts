import { Op } from "sequelize";
import { main } from "./main";
import db from "./config/db.config";
import portfolioStorage from "./config/storage.config";

require("dotenv").config();

const PORT = process.env.PORT || 3001;
const faker = require("faker");
const bcrypt = require("bcryptjs");

main().listen(PORT, () => {
  console.log("app listening on port " + PORT);
});

if (process.env.NODE_ENV !== "production") {
  db.sequelize.sync({ force: true }).then(async () => {
    console.log("Dropped and Resync DB");

    await portfolioStorage.profileBucket.deleteFiles();
    await portfolioStorage.projectBucket.deleteFiles();
    console.log("Purged all cloud storage files");

    init();

    console.log("Server ready");
  });
} else {
  db.sequelize.sync({ alter: true });
}

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

      db.project
        .create({
          title: "Popin",
          description:
            "A mobile application designed to help students on campus to host or find events. It's designed to be simple and fun to use!",
          repo: "https://github.com/LefanTan/popin-spike",
          stack: ["react native", "firebase"],
          inProgress: true,
          order: 2,
        })
        .then((project) => user.$add("project", project));

      db.project
        .create({
          title: "Big 2",
          description: "Online card game to play with your friends!",
          link: "https://lefantan.github.io/big2/",
          repo: "https://github.com/LefanTan/big2",
          stack: ["react", "javascript", "firebase"],
          purposeAndGoal:
            "I wanted to create a fun and easy to use website to play Big 2 with my friends",
          problems: "The website is not responsive",
          order: 1,
        })
        .then((project) => user.$add("project", project));

      let randomStack = [];
      for (let i = 0; i < Math.random() * 10; i++) {
        randomStack.push(faker.vehicle.type());
      }

      db.project
        .create({
          title: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          link: faker.internet.url(),
          repo: faker.internet.url(),
          stack: randomStack,
          purposeAndGoal: faker.lorem.paragraphs(),
          problems: faker.lorem.paragraphs(),
          lessonsLearned: faker.lorem.paragraphs(),
          inProgress: faker.datatype.boolean(),
          order: 3,
        })
        .then((project) => user.$add("project", project));
    });

  // Create 10 users, their profile and some projects
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

        db.project
          .create({
            title: faker.lorem.words(),
            description: faker.lorem.paragraph(),
            link: faker.internet.url(),
            repo: faker.internet.url(),
            stack: faker.vehicle.type(),
            purposeAndGoal: faker.lorem.paragraphs(),
            problems: faker.lorem.paragraphs(),
            lessonsLearned: faker.lorem.paragraphs(),
            inProgress: faker.datatype.boolean(),
            order: i,
          })
          .then((project) => user.$add("project", project));
      });
  }
};
