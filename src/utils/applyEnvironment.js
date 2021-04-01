function applyEnvironment() {
  if (process.env.CI !== true) {
    const path = require("path");
    const envPath = path.resolve(
      process.cwd(),
      process.env.NODE_ENV == "production"
        ? ".env"
        : `.env.${process.env.NODE_ENV}`
    );
    require("dotenv").config({ path: envPath });
  }
}

module.exports = applyEnvironment;
