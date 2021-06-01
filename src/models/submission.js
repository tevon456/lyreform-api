"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
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
      return { ...this.get(), UserId: undefined, user_id: undefined };
    }
  }
  Submission.init(
    {
      data: {
        type: DataTypes.JSON,
      },
    },
    {
      sequelize,
      modelName: "Submission",
    }
  );

  return Submission;
};
