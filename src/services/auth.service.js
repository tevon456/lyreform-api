const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const emailService = require("./email.service");
const bcrypt = require("bcryptjs");
const { Token } = require("../models");
const { Op } = require("sequelize");
const config = require("../config");
const ApiError = require("../utils/ApiError");
const differenceInHours = require("date-fns/differenceInHours");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  if (user.active == false) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "This account has been banned");
  }
  if (user.verified == false) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Please verify your account by clicking the link sent to your email"
    );
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDocument = await Token.findOne({
    where: {
      [Op.and]: [
        { token: refreshToken },
        { blacklisted: false },
        { type: "refresh" },
      ],
    },
  });
  if (!refreshTokenDocument) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  await refreshTokenDocument.destroy();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDocument = await tokenService.verifyToken(
      refreshToken,
      "refresh"
    );
    const user = await userService.getUserById(refreshTokenDocument.user_id);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDocument.destroy();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, password) => {
  try {
    const resetPasswordTokenDocument = await tokenService.verifyToken(
      resetPasswordToken,
      "resetPassword"
    );
    const user = await userService.getUserById(
      resetPasswordTokenDocument.user_id
    );
    if (!user) {
      throw new ApiError(
        httpStatus.PRECONDITION_FAILED,
        "Password reset failed"
      );
    }
    await Token.destroy({
      where: {
        [Op.and]: [{ user_id: user.id }, { type: "resetPassword" }],
      },
    });
    await userService.updateUserById(user.id, { password });
  } catch (error) {
    throw new ApiError(httpStatus.PRECONDITION_FAILED, "Password reset failed");
  }
};

/**
 * Verify a confirmation token
 * @param {string} token
 * @returns {Promise}
 */
const verifyConfirmation = async (token) => {
  const confirmationToken = await tokenService.verifyToken(
    token,
    "confirmation"
  );

  if (!confirmationToken) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "This token is invalid or expired"
    );
  }

  if (
    differenceInHours(Date.now(), confirmationToken.expires_at) >
    config.jwt.confirmation_expiration_days
  ) {
    await tokenService.destroyToken(confirmationToken.id);
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "This token is invalid or expired"
    );
  }

  await userService.updateUserById(confirmationToken.user_id, {
    verified: true,
    active: true,
  });
  await tokenService.destroyToken(confirmationToken.id);
};

/**
 * Reuest a new confirmation code
 * @param {string} email
 */
const requestNewConfirmation = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user || user == null) {
    return "If an account with your email exist an email will be sent to you";
  }

  if (user.verified) {
    return "Account already verified";
  }

  const existingToken = Token.findOne({
    where: {
      [Op.and]: [{ user_id: user.id }, { type: "confirmation" }],
    },
  });

  if (existingToken) {
    await emailService.sendAccountConfirmationEmail(
      user.email,
      user.name,
      existingToken.token
    );
    return "If an account with your email exist an email will be sent to you";
  }

  const confirmationToken = await tokenService.generateConfirmationToken(user);
  await emailService.sendAccountConfirmationEmail(
    user.email,
    user.name,
    confirmationToken
  );
  return "If an account with your email exist an email will be sent to you";
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyConfirmation,
  requestNewConfirmation,
};
