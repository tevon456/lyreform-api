"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("forms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      logo_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      header_foreground: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      header_background: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body_foreground: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body_background: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      controls_foreground: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      controls_background: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      page_background: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      published: { type: Sequelize.BOOLEAN, defaultValue: true },
      fields: {
        type: Sequelize.ARRAY(Sequelize.JSON),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("forms");
  },
};
