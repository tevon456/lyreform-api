const config = require("../config");
const logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
const Relationships = require("./relationships");
const basename = path.basename(__filename);
const Database = {};
const sequelize = new Sequelize.Sequelize(
  config.database[config.env].database,
  config.database[config.env].username,
  config.database[config.env].password,
  {
    host: config.database[config.env].host,
    dialect: config.database[config.env].dialect,
    timezone: "+09:00",
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
      underscored: true,
      freezeTableName: false,
    },
    logQueryParameters: config.env === "development",
    logging: (query, time) => {
      logger.info(time + "ms" + " " + query);
    },
    benchmark: true,
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    Database[model.name] = model;
  });

Object.keys(Database).forEach((modelName) => {
  if (Database[modelName].associate) {
    Database[modelName].associate(Database);
  }
});

Database.sequelize = sequelize;
Database.Sequelize = Sequelize;

// Relationships
Relationships(Database);

module.exports = Database;
