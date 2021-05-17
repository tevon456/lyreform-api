const Joi = require("@hapi/joi");
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).custom(password),
    name: Joi.string().max(48).min(3).required(),
  }),
};

const accountConfirmation = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const resendConfirmation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).custom(password),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().min(8).custom(password),
  }),
};

module.exports = {
  register,
  accountConfirmation,
  resendConfirmation,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
