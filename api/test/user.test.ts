import { main } from "../main";
import glob from "./test_variable";
import chai, { expect } from "chai";
import db from "../config/db.config";
describe("Test User Routes", () => {
  let jwtToken: string;

  const user = {
    id: 123,
    username: "fun",
    password: "notfun",
  };

  before(async () => {
    await db.sequelize.sync({ force: true, match: /test/ });

    jwtToken = await glob.getJwtToken();

    await db.user.create(user);
  });

  it("get /user/:id", (done) => {
    chai
      .request(glob.url)
      .get("/user/" + user.id)
      .set("x-access-token", jwtToken)
      .end((err, res) => {
        glob.log(res.body);

        expect(res).to.have.status(200);
        done();
      });
  });
});
