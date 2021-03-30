const httpStatus = require("http-status");
const { Token } = require("../models");
const config = require("../config/index");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");
const { addMinutes, addDays, addHours } = require("date-fns");

/**
 * Generate token
 * @param {User} user
 * @param {Date} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (user, expires, secret = config.jwt.secret) => {
  const payload = {
    name: user.name,
    email: user.email,
    sub: user.id,
    iat: Date.now(),
    exp: Date.parse(expires),
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token to database
 * @param {string} token
 * @param {number} userId
 * @param {Date} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDocument = await Token.create({
    token,
    user_id: userId,
    expires_at: expires,
    type,
    blacklisted,
  });
  return tokenDocument;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDocument = await Token.findOne({
    where: {
      [Op.and]: [{ token: token }, { user_id: payload.sub }, { type: type }],
    },
  });
  if (!tokenDocument) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "This token is inavlid");
  }
  return tokenDocument;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = addMinutes(
    new Date(),
    config.jwt.access_expiration_minutes
  );
  const accessToken = generateToken(user, accessTokenExpires);

  const refreshTokenExpires = addDays(
    new Date(),
    config.jwt.refresh_expiration_days
  );
  const refreshToken = generateToken(user, refreshTokenExpires);
  await saveToken(refreshToken, user.id, refreshTokenExpires, "refresh");

  return {
    access: {
      token: accessToken,
      expires: Date.parse(accessTokenExpires),
    },
    refresh: {
      token: refreshToken,
      expires: Date.parse(refreshTokenExpires),
    },
  };
};

/**
 * Create a user account confirmation token
 * @param {string} email
 * @returns {Promise<User>}
 */
const generateConfirmationToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = addHours(
    new Date(),
    config.jwt.confirmation_expiration_hours
  );
  const confirmationToken = generateToken(user, expires);
  await saveToken(confirmationToken, user.id, expires, "confirmation");
  return confirmationToken;
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = addHours(
    new Date(),
    config.jwt.reset_password_expiration_hours
  );
  const resetPasswordToken = generateToken(user.id, expires);
  await saveToken(resetPasswordToken, user.id, expires, "resetPassword");
  return resetPasswordToken;
};

/**
 * Delete token
 * @param {number} id
 */
const destroyToken = async (id) => {
  const tokenDocument = await Token.findOne({
    where: { id },
  });
  if (!tokenDocument) {
    throw new ApiError(httpStatus.NOT_FOUND, "token not found");
  }
  await tokenDocument.destroy();
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateConfirmationToken,
  generateResetPasswordToken,
  destroyToken,
};
