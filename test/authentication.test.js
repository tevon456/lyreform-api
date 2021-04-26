const app = require("../src/app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { testHelper } = require("./util");
const expect = require("chai").expect;

let user = new testHelper();
chai.use(chaiHttp);

describe("Autehtication rest enpoint testing", () => {
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
        console.log(err);
        console.log(res);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should return an error for a malformed registration attempt", (done) => {
    chai
      .request(app)
      .post("/v1/auth/register")
      .send(user.badRegistration())
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should attempt to 'resend a confirmation' before a user confirms", (done) => {
    chai
      .request(app)
      .post(`/v1/auth/resend-confirmation`)
      .send({ email: user.email })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(202);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should 'attempt to login' user before confirmation", (done) => {
    chai
      .request(app)
      .post(`/v1/auth/login`)
      .send(user.getUserLogin())
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(401);
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

  it("should attempt to 'resend' a confirmation 'after' a user confirms", (done) => {
    chai
      .request(app)
      .post(`/v1/auth/resend-confirmation`)
      .send({ email: user.email })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(202);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should return an error for user with bad login credentials", (done) => {
    chai
      .request(app)
      .post(`/v1/auth/login`)
      .send(user.getWrongUserLogin())
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("code");
        expect(res.body.code).to.equal(400);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should login user", (done) => {
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
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("user");
        expect(res.body).to.have.property("tokens");
        expect(res.body.tokens).to.have.property("access");
        expect(res.body.tokens).to.have.property("refresh");
        expect(res.body.user).to.not.have.property("password");
        done();
      });
  });

  it("should return an error on bad auth token refresh", (done) => {
    chai
      .request(app)
      .post(`/v1/auth/refresh-tokens`)
      .send({ refreshToken: user.getBadRefreshToken() })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should refresh auth tokens", (done) => {
    chai
      .request(app)
      .post(`/v1/auth/refresh-tokens`)
      .send({ refreshToken: user.refresh })
      .end((err, res) => {
        if (err) {
          console.log(err);
          console.log(res.body);
          return done(err);
        }
        user.setAccessToken(res.body.tokens.access.token);
        user.setRefreshToken(res.body.tokens.refresh.token);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("tokens");
        expect(res.body.tokens).to.have.property("access");
        expect(res.body.tokens).to.have.property("refresh");
        done();
      });
  });

  it("should throw an error when logging out with incorrect refresh token", (done) => {
    chai
      .request(app)
      .post(`/v1/auth/logout`)
      .send({ refreshToken: user.getBadRefreshToken() })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.not.equal(500);
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should logout user", (done) => {
    chai
      .request(app)
      .post(`/v1/auth/logout`)
      .send({ refreshToken: user.refresh })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.not.equal(500);
        expect(res.status).to.equal(204);
        done();
      });
  });

  it("should initiate a bad forgot password request with no email", (done) => {
    chai
      .request(app)
      .post(`/v1/auth/forgot-password`)
      .send()
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.not.equal(500);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("code");
        expect(res.body.code).to.equal(400);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should initiate a bad forgot password request with malformed email", (done) => {
    chai
      .request(app)
      .post(`/v1/auth/forgot-password`)
      .send({ email: user.getBadEmail() })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.not.equal(500);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("code");
        expect(res.body.code).to.equal(400);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should initiate a forgot password", (done) => {
    chai
      .request(app)
      .post(`/v1/auth/forgot-password`)
      .send({ email: user.email })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.not.equal(500);
        expect(res.status).to.not.equal(400);
        expect(res.status).to.equal(204);
        done();
      });
  });

  it("should reset password using token", async () => {
    const tokenDocument = await user.getResetPasswordToken();
    const token = tokenDocument.token;
    const newPassword = user.generatePassword();
    chai
      .request(app)
      .post(`/v1/auth/reset-password/?token=${token}`)
      .send({ password: newPassword })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        user.setPassword(newPassword);
        expect(res.status).to.not.equal(500);
        expect(res.status).to.not.equal(400);
        expect(res.status).to.equal(204);
      });
  });

  it("should login user", (done) => {
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
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("user");
        expect(res.body).to.have.property("tokens");
        expect(res.body.tokens).to.have.property("access");
        expect(res.body.tokens).to.have.property("refresh");
        expect(res.body.user).to.not.have.property("password");
        done();
      });
  });

  it("should logout user", (done) => {
    chai
      .request(app)
      .post(`/v1/auth/logout`)
      .send({ refreshToken: user.refresh })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.not.equal(500);
        expect(res.status).to.equal(204);
        done();
      });
  });
});
