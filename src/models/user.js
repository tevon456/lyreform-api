"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const Token = require("./token");
const Database = require(".");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    // exclude fields from model when returning json
    toJSON() {
      return { ...this.get(), id: undefined, password: undefined };
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          max: 48,
          min: 3,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { args: true, msg: "this email is already taken" },
        },
      },
      verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      active: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  async function hashPasswordOnChange(user, options) {
    if (user.changed("password")) {
      const hashedPassword = await bcrypt.hash(user.password, 8);
      user.password = hashedPassword;
    }
  }

  User.beforeCreate(hashPasswordOnChange);

  User.beforeUpdate(hashPasswordOnChange);

  return User;
};
