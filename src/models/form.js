"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
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
      return { ...this.get(), id: undefined };
    }
  }
  Form.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      header_foreground: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      header_background: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body_foreground: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body_background: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      controls_foreground: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      controls_background: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      page_background: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      published: { type: DataTypes.BOOLEAN, defaultValue: true },
      fields: {
        type: DataTypes.ARRAY(DataTypes.JSON),
      },
    },
    {
      sequelize,
      modelName: "Form",
    }
  );

  return Form;
};
