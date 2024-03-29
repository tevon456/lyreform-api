const httpStatus = require("http-status");
const { Token } = require("../models");
const config = require("../config/index");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");
const {
  addMinutes,
  addDays,
  addHours,
  isPast,
  getUnixTime,
} = require("date-fns");

/**
 * Generate token
 * @param {User} user
 * @param {Date} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (data, expires, secret = config.jwt.secret) => {
  const payload = {
    name: data.user.name,
    email: data.user.email,
    data: data.bundle,
    sub: data.user.id,
    iat: getUnixTime(Date.now()),
    exp: getUnixTime(expires),
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
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDocument = await Token.findOne({
      where: {
        [Op.and]: [{ token: token }, { user_id: payload.sub }, { type: type }],
      },
    });
    if (!tokenDocument) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "This token is invalid");
    }
    return tokenDocument;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "This token is invalid");
  }
};

/**
 * Generate auth tokens
 * @param {User} user
 * @param {object} tokenPayload additional data to be stored in token
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user, tokenPayload = {}) => {
  const accessTokenExpires = addMinutes(
    new Date(),
    config.jwt.access_expiration_minutes
  );
  const accessToken = generateToken(
    { bundle: { type: "access", ...tokenPayload }, user },
    accessTokenExpires
  );

  const refreshTokenExpires = addDays(
    new Date(),
    config.jwt.refresh_expiration_days
  );
  const refreshToken = generateToken(
    { bundle: { type: "refresh" }, user },
    refreshTokenExpires
  );
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
  const confirmationToken = generateToken(
    { bundle: { type: "confirmation" }, user },
    expires
  );
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

  const query = {
    where: {
      [Op.and]: [{ user_id: user.id }, { type: "resetPassword" }],
    },
  };

  const existingToken = await Token.findOne(query);

  const prepareToken = async () => {
    const expires = addHours(
      new Date(),
      config.jwt.reset_password_expiration_hours
    );
    const resetPasswordToken = generateToken(
      { bundle: { type: "resetPassword" }, user },
      expires
    );
    await saveToken(resetPasswordToken, user.id, expires, "resetPassword");
    return resetPasswordToken;
  };

  if (!existingToken) {
    Token.destroy(query);
    return prepareToken();
  }

  if (existingToken && isPast(existingToken.expires_at)) {
    await existingToken.destroy();
    return prepareToken();
  }
  if (existingToken) {
    return existingToken.token;
  }
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
