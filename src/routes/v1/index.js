const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
// const formRoute = require('./form.route');
// const submissionRoute = require('./submission.route');

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
// router.use('/forms', formRoute);
// router.use('/submissions', submissionRoute);

module.exports = router;
