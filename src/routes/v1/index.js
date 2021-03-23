const express = require("express");
const authRoute = require("./auth.route");
// const formRoute = require('./form.route');
// const userRoute = require('./user.route');
// const submissionRoute = require('./submission.route');
// const docsRoute = require('./docs.route');

const router = express.Router();

router.use("/auth", authRoute);
// router.use('/users', userRoute);
// router.use('/docs', docsRoute);
// router.use('/forms', formRoute);
// router.use('/submissions', submissionRoute);

module.exports = router;
