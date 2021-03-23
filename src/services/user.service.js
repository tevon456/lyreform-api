const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  try {
    const user = await User.create(userBody);
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "An error occured");
  }
};

/**
 * Check if an email is taken
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (user) {
    return true;
  }
  return false;
};

/**
 * Get a user by id
 * @param {number} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findOne({ where: { id } });
};

/**
 * Get a user by UUID
 * @param {string} uuid
 * @returns {Promise<User>}
 */
const getUserByUuid = async (uuid) => {
  return User.findOne({ where: { uuid } });
};

/**
 * Get a user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

/**
 * Update user by id
 * @param {number} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByUuid,
  updateUserById,
  isEmailTaken,
};
