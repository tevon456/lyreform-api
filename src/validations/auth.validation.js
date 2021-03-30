const Joi = require("@hapi/joi");
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
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
    email: Joi.string().required().email(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
};

module.exports = { register, accountConfirmation, resendConfirmation, login };
