const Joi = require("@hapi/joi");
const { password } = require("./custom.validation");

// const createUser = {
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().custom(password),
//     name: Joi.string().required(),
//     role: Joi.string().required().valid('user', 'admin'),
//   }),
// };

// const getUsers = {
//   query: Joi.object().keys({
//     name: Joi.string(),
//     role: Joi.string(),
//     sortBy: Joi.string(),
//     limit: Joi.number().integer(),
//     page: Joi.number().integer(),
//   }),
// };

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
