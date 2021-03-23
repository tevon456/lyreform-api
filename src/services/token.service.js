const httpStatus = require("http-status");
const { Token } = require("../models");
const config = require("../config/index");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const addDays = require("date-fns/addDays");
const ApiError = require("../utils/ApiError");

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
 * Create a user account confirmation token
 * @param {User} user
 * @returns {Promise<User>}
 */
const generateConfirmationToken = async (user) => {
  const expires = addDays(new Date(), config.jwt.confirmation_expiration_days);
  const confirmationToken = generateToken(user, expires);
  await saveToken(confirmationToken, user.id, expires, "confirmation");
  return confirmationToken;
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
  generateConfirmationToken,
  destroyToken,
};
