const Database = require("../../src/models");
const faker = require("faker");
const { Token } = require("../../src/models");
const { userService } = require("../../src/services");

class testUtils {
  static async forceDatabaseSync() {
    await Database.sequelize.sync({ force: true });
  }

  static randomBetween(min, max) {
    return Math.floor(Math.random() * max) + min;
  }
}

class testHelper {
  /**
   * Create a user
   * @param {string} name - The user's first and last name.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   */
  constructor(name, email, password) {
    this.name = name || faker.name.findName();
    this.email = email || faker.internet.email();
    this.password =
      password ||
      `${faker.internet.password(
        10,
        false,
        /[a-zA-Z0-9]/
      )}${testUtils.randomBetween(0, 9)}`;
    this.access = null;
    this.refresh = null;
    this.uuid = null;
    this.form_ids = [];
  }

  async getConfirmationToken() {
    const user = await userService.getUserByEmail(this.email);
    const tokenDocument = await Token.findOne({
      where: { user_id: user.id, type: "confirmation" },
    });
    return tokenDocument;
  }

  async getResetPasswordToken() {
    const user = await userService.getUserByEmail(this.email);
    const tokenDocument = await Token.findOne({
      where: { user_id: user.id, type: "resetPassword" },
    });
    return tokenDocument;
  }

  setAccessToken(access) {
    this.access = access;
  }

  setRefreshToken(refresh) {
    this.refresh = refresh;
  }

  setUserUUID(uuid) {
    this.uuid = uuid;
  }

  getBadRefreshToken() {
    return `${this.refresh}k98`;
  }

  getUser() {
    return {
      ...this,
    };
  }

  getUserLogin() {
    return {
      email: this.email,
      password: this.password,
    };
  }

  getWrongUserLogin() {
    return {
      email: this.email,
      password: faker.internet.password(7),
    };
  }

  registration() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
    };
  }

  badRegistration() {
    let seed = testUtils.randomBetween(1, 3);
    switch (seed) {
      case 1:
        return {
          name: faker.name.findName(),
        };
      case 2:
        return {
          name: faker.name.findName(),
          email: "Bad,..email.c#",
          password: faker.internet.password(),
        };
      case 3:
        return {
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: faker.internet.password(6),
        };
      default:
        return {
          name: faker.name.findName(),
          email: "Bad,..email.c#",
          password: faker.internet.password(),
        };
    }
  }

  getEmail() {
    return this.email;
  }

  getBadEmail() {
    return this.email.split(".")[0];
  }

  generatePassword() {
    return `${faker.internet.password(
      10,
      false,
      /[a-zA-Z0-9]/
    )}${testUtils.randomBetween(0, 9)}`;
  }

  setPassword(password) {
    this.password = password;
  }

  generateForm() {
    return {
      name: `API Test form ${testUtils.randomBetween(1, 40)}`,
      published: true,
      header_foreground: "white",
      header_background: "black",
      body_foreground: "black",
      body_background: "white",
      controls_foreground: "white",
      controls_background: "black",
      page_background: "white",
      fields: [
        {
          id: faker.random.alphaNumeric(6),
          name: `email-123 ${faker.random.alphaNumeric(6)}`,
          label: "email address",
          field_type: "EMAIL",
          required: true,
        },
      ],
    };
  }

  badFormCreate() {
    let seed = testUtils.randomBetween(1, 4);
    switch (seed) {
      case 1:
        return {
          ...this.generateForm(),
          name: undefined,
        };
      case 2:
        return {
          ...this.generateForm(),
          non_existent: faker.random.alphaNumeric(12),
        };
      case 3:
        return {
          ...this.generateForm(),
          fields: undefined,
        };
      case 4:
        return {
          ...this.generateForm(),
          header_background: faker.seed(4),
        };
      default:
        return {
          ...this.generateForm(),
          name: undefined,
        };
    }
  }

  addUserFormUUID(uuid) {
    this.form_ids.push(uuid);
  }
}

module.exports = { testHelper, testUtils };
