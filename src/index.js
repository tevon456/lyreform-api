require("dotenv").config();
const app = require("./app");
const config = require("./config");
const logger = require("./utils/logger");
const Database = require("./models");
let server;

async function DBsync() {
  if (config.env == "development") {
    await Database.sequelize.sync({ force: true });
    logger.info("forced database synchronization");
  }
}

server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
  Database.sequelize
    .authenticate()
    .then(() => {
      logger.info("The database is connected.");
    })
    .catch((error) => {
      logger.error(`Unable to connect to the database: ${error}.`);
    });
  DBsync();
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
