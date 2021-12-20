import express from "express";
import db from "./models/index";

require("dotenv").config();

const PORT = process.env.PORT || 3001;
const cors = require("cors");

var app = express();

// restrict cors to the local client
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src"));

// force = true only during development, as it drops all data
// use alter?
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync DB");
  init();
});

const init = () => {
  db.ROLES.forEach((type, idx) =>
    db.role.create({
      id: idx + 1,
      name: type,
    })
  );
};

app.listen(PORT, () => {
  console.log("app listening on port " + PORT);
});
