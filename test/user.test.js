const app = require("../src/app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { testHelper } = require("./util");
const expect = require("chai").expect;

let user = new testHelper();
chai.use(chaiHttp);

describe("User enpoint testing", () => {
  it("should 'register' a new user", (done) => {
    chai
      .request(app)
      .post("/v1/auth/register")
      .send(user.registration())
      .end((err, res) => {
        if (err) {
          console.log(err);
          console.log(res);
          return done(err);
        }
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should 'confirm' a new user account using email confirmation token", async () => {
    const tokenDocument = await user.getConfirmationToken();
    const token = tokenDocument.token;

    chai
      .request(app)
      .post(`/v1/auth/account-confirmation/?token=${token}`)
      .send()
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
      });
  });

  it("should login user", (done) => {
    setTimeout(() => {
      chai
        .request(app)
        .post(`/v1/auth/login`)
        .send(user.getUserLogin())
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          }
          user.setAccessToken(res.body.tokens.access.token);
          user.setRefreshToken(res.body.tokens.refresh.token);
          user.setUserUUID(res.body.user.uuid);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("user");
          expect(res.body).to.have.property("tokens");
          expect(res.body.tokens).to.have.property("access");
          expect(res.body.tokens).to.have.property("refresh");
          expect(res.body.user).to.not.have.property("password");
          done();
        });
    }, 500);
  });

  it("should get logged in user's data", (done) => {
    chai
      .request(app)
      .get(`/v1/user/${user.uuid}`)
      .set("Authorization", `Bearer ${user.access}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("email");
        expect(res.body).to.have.property("uuid");
        expect(res.body).to.have.property("active");
        expect(res.body).to.have.property("verified");
        expect(res.body).to.have.property("createdAt");
        expect(res.body).to.have.property("updatedAt");
        done();
      });
  });
});
