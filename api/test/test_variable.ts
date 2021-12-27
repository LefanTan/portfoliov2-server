import { main } from "../main";
import chai from "chai";
import chai_http from "chai-http";
import db from "../config/db.config";
import jwt from "jsonwebtoken";
import authJwt from "../middleware/authJwt";

require("dotenv").config();
chai.use(chai_http);

/**
 * SETUP TEST VARIABLES
 */

let url = "http://localhost:3002";

const glob = {
  url,
  app: main(),
  log: (body: string) => console.log("RESPONSE: ", body),
  getJwtToken: (user: any) => {
    return db.user
      .create({
        id: user.id,
        username: user.username,
        password: user.password,
      })
      .then((user) => {
        return jwt.sign(
          {
            id: user.id,
          },
          process.env.JWT_SECRET || authJwt.default_secret,
          { expiresIn: "1d" }
        );
      });
  },
};

glob.app.listen(process.env.PORT, () =>
  console.log("Test API listening on port ", process.env.PORT)
);

export default glob;
