const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const isAuthUser = require("../utils/isAuthUser");

const getUser = catchAsync(async (req, res) => {
  if (!isAuthUser(req.params.userId, req)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
  }
  const user = await userService.getUserByUuid(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  if (!isAuthUser(req.params.userId, req)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
  }
  const userId = await userService.getUserIdfromUUID(req.params.userId);
  const user = await userService.updateUserById(userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  if (!isAuthUser(req.params.userId, req)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
  }
  const userId = await userService.getUserIdfromUUID(req.params.userId);
  await userService.deleteUserById(userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
