const nodemailer = require("nodemailer");
const config = require("../config/");
const logger = require("../utils/logger");
const confirmationTemplate = require("../templates/confirmation.template");
const passwordResetTemplate = require("../templates/passwordReset.template");

const transport = nodemailer.createTransport(config.email);
/* istanbul ignore next */
if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const msg = { from: config.email.from, to, subject, text, html };
    await transport.sendMail(msg);
  } catch (error) {
    logger.error(error);
  }
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `https://app.lyreform.com/reset-password?token=${token}`;
  const text = `Dear user,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  const html = passwordResetTemplate(resetPasswordUrl);
  await sendEmail(to, subject, text, html);
};

/**
 * Send reset account confirmation email
 * @param {string} to
 * @param {string} name
 * @param {string} token
 * @returns {Promise}
 */
const sendAccountConfirmationEmail = async (to, name, token) => {
  try {
    const subject = "Confirm Account";
    const accountConfirmationUrl = `https://app.lyreform.com/verify-account/?token=${token}`;
    const text = `Dear user,
  To confirm your email address, click on this link: ${accountConfirmationUrl}
  If you did not signup for Lyreform, then ignore this email.`;
    const html = confirmationTemplate(name, accountConfirmationUrl);
    await sendEmail(to, subject, text, html);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendAccountConfirmationEmail,
};
