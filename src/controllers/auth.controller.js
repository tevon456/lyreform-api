const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const differenceInHours = require("date-fns/differenceInHours");

const {
  userService,
  tokenService,
  emailService,
  authService,
} = require("../services");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const userConfirmationToken = await tokenService.generateConfirmationToken(
    user
  );
  // await emailService.sendAccountConfirmationEmail(
  //   user.email,
  //   user.name,
  //   userConfirmationToken
  // );
  res.status(httpStatus.CREATED).send({
    message: `Account created succesfully, check your email for account activation link`,
    token: userConfirmationToken, //remove after
  });
});

const accountConfirmation = catchAsync(async (req, res) => {
  await authService.verifyConfirmation(req.query.token);
  res.status(httpStatus.OK).send({ message: "Account confirmed" });
});

const resendConfirmation = catchAsync(async (req, res) => {
  const message = await authService.requestNewConfirmation(req.body.email);
  res.status(httpStatus.ACCEPTED).send({
    message,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

module.exports = { register, accountConfirmation, resendConfirmation, login };
