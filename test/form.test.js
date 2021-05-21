const app = require("../src/app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { testHelper } = require("./util");
const expect = require("chai").expect;

let user = new testHelper();
let user2 = new testHelper();
chai.use(chaiHttp);

describe("Form endpoint testing", () => {
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

  it("should 'register' a second user", (done) => {
    chai
      .request(app)
      .post("/v1/auth/register")
      .send(user2.registration())
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

  it("should 'confirm' a second user account using email confirmation token", async () => {
    const tokenDocument = await user2.getConfirmationToken();
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

  it("should login the first user", (done) => {
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

  it("should login the second user", (done) => {
    setTimeout(() => {
      chai
        .request(app)
        .post(`/v1/auth/login`)
        .send(user2.getUserLogin())
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          }
          user2.setAccessToken(res.body.tokens.access.token);
          user2.setRefreshToken(res.body.tokens.refresh.token);
          user2.setUserUUID(res.body.user.uuid);
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

  it("should fail to create a new form without being authenticated", (done) => {
    chai
      .request(app)
      .post(`/v1/form`)
      .send(user.generateForm())
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

  it("should fail to create a new form with malformed data", (done) => {
    chai
      .request(app)
      .post("/v1/form")
      .set("Authorization", `Bearer ${user.access}`)
      .send(user.badFormCreate())
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.status).to.not.equal(201);
        expect(res.status).to.not.equal(500);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should create a new form", (done) => {
    chai
      .request(app)
      .post("/v1/form")
      .set("Authorization", `Bearer ${user.access}`)
      .send(user.generateForm())
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        user.addUserFormUUID(res.body.uuid);
        expect(res.status).to.equal(201);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("published");
        expect(res.body).to.have.property("logo_url");
        expect(res.body).to.have.property("uuid");
        expect(res.body).to.have.property("header_foreground");
        expect(res.body).to.have.property("header_background");
        expect(res.body).to.have.property("body_foreground");
        expect(res.body).to.have.property("body_background");
        expect(res.body).to.have.property("controls_foreground");
        expect(res.body).to.have.property("controls_background");
        expect(res.body).to.have.property("page_background");
        expect(res.body.fields).to.be.a("array");
        expect(res.body).to.have.property("fields");
        expect(res.body).to.have.property("createdAt");
        expect(res.body).to.have.property("updatedAt");
        done();
      });
  });

  it("should fail to update a form without being authenticated", (done) => {
    chai
      .request(app)
      .patch(`/v1/form/${user.form_ids[0]}`)
      .send(user.generateForm())
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(401);
        expect(res.status).to.not.equal(201);
        expect(res.status).to.not.equal(500);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should fail update a form with malformed data", (done) => {
    chai
      .request(app)
      .patch(`/v1/form/${user.form_ids[0]}`)
      .set("Authorization", `Bearer ${user.access}`)
      .send(user.badFormCreate())
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.status).to.not.equal(201);
        expect(res.status).to.not.equal(500);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should update a form by form id", (done) => {
    chai
      .request(app)
      .patch(`/v1/form/${user.form_ids[0]}`)
      .set("Authorization", `Bearer ${user.access}`)
      .send(user.generateForm())
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("published");
        expect(res.body).to.have.property("logo_url");
        expect(res.body).to.have.property("uuid");
        expect(res.body).to.have.property("header_foreground");
        expect(res.body).to.have.property("header_background");
        expect(res.body).to.have.property("body_foreground");
        expect(res.body).to.have.property("body_background");
        expect(res.body).to.have.property("controls_foreground");
        expect(res.body).to.have.property("controls_background");
        expect(res.body).to.have.property("page_background");
        expect(res.body.fields).to.be.a("array");
        expect(res.body).to.have.property("fields");
        expect(res.body).to.have.property("createdAt");
        expect(res.body).to.have.property("updatedAt");
        done();
      });
  });

  it("should fail update a form with owned by another user", (done) => {
    chai
      .request(app)
      .patch(`/v1/form/${user.form_ids[0]}`)
      .set("Authorization", `Bearer ${user2.access}`)
      .send(user2.generateForm())
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(403);
        expect(res.status).to.not.equal(201);
        expect(res.status).to.not.equal(500);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should fail to get a form with a bad form id", (done) => {
    chai
      .request(app)
      .get(`/v1/form/${user.form_ids[0]}wd`)
      .set("Authorization", `Bearer ${user.access}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.status).to.not.equal(201);
        expect(res.status).to.not.equal(500);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should get a form by form id", (done) => {
    chai
      .request(app)
      .get(`/v1/form/${user.form_ids[0]}`)
      .set("Authorization", `Bearer ${user.access}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("published");
        expect(res.body).to.have.property("logo_url");
        expect(res.body).to.have.property("uuid");
        expect(res.body).to.have.property("header_foreground");
        expect(res.body).to.have.property("header_background");
        expect(res.body).to.have.property("body_foreground");
        expect(res.body).to.have.property("body_background");
        expect(res.body).to.have.property("controls_foreground");
        expect(res.body).to.have.property("controls_background");
        expect(res.body).to.have.property("page_background");
        expect(res.body.fields).to.be.a("array");
        expect(res.body).to.have.property("fields");
        expect(res.body).to.have.property("createdAt");
        expect(res.body).to.have.property("updatedAt");
        done();
      });
  });

  it("should get a public form by form id", (done) => {
    chai
      .request(app)
      .get(`/v1/form/public/${user.form_ids[0]}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("published");
        expect(res.body).to.have.property("logo_url");
        expect(res.body).to.have.property("uuid");
        expect(res.body).to.have.property("header_foreground");
        expect(res.body).to.have.property("header_background");
        expect(res.body).to.have.property("body_foreground");
        expect(res.body).to.have.property("body_background");
        expect(res.body).to.have.property("controls_foreground");
        expect(res.body).to.have.property("controls_background");
        expect(res.body).to.have.property("page_background");
        expect(res.body.fields).to.be.a("array");
        expect(res.body).to.have.property("fields");
        expect(res.body).to.have.property("createdAt");
        expect(res.body).to.have.property("updatedAt");
        done();
      });
  });

  it("should update a form published to false by form id", (done) => {
    chai
      .request(app)
      .patch(`/v1/form/${user.form_ids[0]}`)
      .set("Authorization", `Bearer ${user.access}`)
      .send({ ...user.generateForm(), published: false })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("published");
        expect(res.body).to.have.property("logo_url");
        expect(res.body).to.have.property("uuid");
        expect(res.body).to.have.property("header_foreground");
        expect(res.body).to.have.property("header_background");
        expect(res.body).to.have.property("body_foreground");
        expect(res.body).to.have.property("body_background");
        expect(res.body).to.have.property("controls_foreground");
        expect(res.body).to.have.property("controls_background");
        expect(res.body).to.have.property("page_background");
        expect(res.body.fields).to.be.a("array");
        expect(res.body).to.have.property("fields");
        expect(res.body).to.have.property("createdAt");
        expect(res.body).to.have.property("updatedAt");
        done();
      });
  });

  it("should fail to get a public form that isn't published", (done) => {
    chai
      .request(app)
      .get(`/v1/form/public/${user.form_ids[0]}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(404);
        expect(res.status).to.not.equal(201);
        expect(res.status).to.not.equal(500);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should fail to get paginated forms without being authenticated", (done) => {
    chai
      .request(app)
      .get(`/v1/form/`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(401);
        expect(res.status).to.not.equal(201);
        expect(res.status).to.not.equal(500);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should get paginated forms", (done) => {
    chai
      .request(app)
      .get(`/v1/form/`)
      .set("Authorization", `Bearer ${user.access}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("total_results");
        expect(res.body.total_results).to.be.a("number");
        expect(res.body).to.have.property("results");
        expect(res.body.results).to.be.a("array");
        expect(res.body).to.have.property("limit");
        expect(res.body.limit).to.be.a("number");
        expect(res.body).to.have.property("current_page");
        expect(res.body.current_page).to.be.a("number");
        expect(res.body).to.have.property("total_pages");
        expect(res.body.total_pages).to.be.a("number");
        done();
      });
  });

  it("should fail to delete a form that doesn't exist", (done) => {
    chai
      .request(app)
      .delete(`/v1/form/${user.form_ids[0]}ee`)
      .set("Authorization", `Bearer ${user.access}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          console.log(res.body);
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.status).to.not.equal(201);
        expect(res.status).to.not.equal(500);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should fail to delete another user's form", (done) => {
    chai
      .request(app)
      .delete(`/v1/form/${user.form_ids[0]}`)
      .set("Authorization", `Bearer ${user2.access}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(403);
        expect(res.status).to.not.equal(201);
        expect(res.status).to.not.equal(500);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should delete a form owned by the user", (done) => {
    chai
      .request(app)
      .delete(`/v1/form/${user.form_ids[0]}`)
      .set("Authorization", `Bearer ${user.access}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        expect(res.status).to.equal(204);
        expect(res.status).to.not.equal(400);
        expect(res.status).to.not.equal(200);
        expect(res.status).to.not.equal(500);
        done();
      });
  });
});
