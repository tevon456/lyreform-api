const database = require("./config");
const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 8000,
  jwt: {
    secret: process.env.JWT_SECRET,
    access_expiration_minutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refresh_expiration_days: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    confirmation_expiration_hours:
      process.env.JWT_CONFIRMATION_EXPIRATION_HOURS,
    reset_password_expiration_hours:
      process.env.JWT_RESET_PASSWORD_EXPIRATION_HOURS,
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
  recaptcha: {
    site: process.env.RECAPTCHA_SITE_KEY,
    secret: process.env.RECAPTCHA_SECRET_KEY,
  },
};

module.exports = config;
