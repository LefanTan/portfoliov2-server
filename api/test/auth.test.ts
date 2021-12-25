import db from "../config/db.config";
import chai, { expect } from "chai";
import glob from "./test_variable";

describe("Test auth routes", () => {
  before(async () => {
    await db.sequelize.sync({ force: true, match: /test/ });
  });

  const validUser = {
    username: "test_user123",
    password: "adminPassword",
    email: "lefan@test.com",
  };

  it("create a user", (done) => {
    chai
      .request(glob.url)
      .post("/auth/signup")
      .send(validUser)
      .end((err, res) => {
        glob.log(res.body);

        expect(res).to.have.status(200);
        expect(res.body.user.email).to.be.string;
        done();
      });
  });

  it("sign in", (done) => {
    chai
      .request(glob.url)
      .post("/auth/signin")
      .send(validUser)
      .end((err, res) => {
        glob.log(res.body);

        expect(res).to.have.status(200);
        expect(res.body.accessToken).to.be.string;
        done();
      });
  });
});
