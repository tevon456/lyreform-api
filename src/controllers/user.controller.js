const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const isAuthUser = require("../utils/isAuthUser");

const getUser = catchAsync(async (req, res) => {
  if (!isAuthUser(req.params.userId, req)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
  }
  const user = await userService.getUserByUUID(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  if (!isAuthUser(req.params.userId, req)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
  }
  const user = await userService.getUserByUUID(req.params.userId);
  const updatedUser = await userService.updateUserById(user?.id, req.body);
  res.send(updatedUser);
});

const deleteUser = catchAsync(async (req, res) => {
  if (!isAuthUser(req.params.userId, req)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
  }
  const userId = await userService.getUserIdFromUUID(req.params.userId);
  await userService.deleteUserById(userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
