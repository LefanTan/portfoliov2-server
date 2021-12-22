import express, { Request, Response } from "express";
import { Op } from "sequelize";
import db from "./models/index";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

require("dotenv").config();

const PORT = process.env.PORT || 3001;
const cors = require("cors");
const bcrypt = require("bcryptjs");

var app = express();

/**
 * Setup Global Middlewares
 */

// Enable cors to all origins
// Access-Control-Allow-Origin: *
app.use(cors());

// Allow the following response headers
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// use src folder to serve static html
app.use(express.static("src"));

app.use("/auth", authRoutes);
app.use(userRoutes);

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
      password: bcrypt.hashSync("test", 8),
      email: "lefanta@hotmail.com",
    })
    .then((user) => {
      db.role.findOne({ where: { name: "admin" } }).then((role) => {
        user.$add("role", role!);
      });
    });

  db.user
    .create({
      username: "selene",
      password: bcrypt.hashSync("whatthefuck", 8),
      email: "woahhhhey@hotmail.com",
    })
    .then((user) => {
      db.role
        .findAll({ where: { [Op.or]: [{ name: "user" }, { name: "admin" }] } })
        .then((roles) => {
          roles.forEach((role) => user.$add("role", role!));
        });
    });
};

app.listen(PORT, () => {
  console.log("app listening on port " + PORT);
});