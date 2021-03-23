const database = require("./config");
const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    secret: process.env.JWT_SECRET,
    access_expiration_minutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refresh_expiration_days: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    confirmation_expiration_days: process.env.JWT_CONFIRMATION_EXPIRATION_HOURS,
  },
  email: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    email_from: process.env.EMAIL_FROM,
  },
  database,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
};

module.exports = config;
