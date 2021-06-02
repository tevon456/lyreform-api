const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const submissionValidation = require("../../validations/submission.validation");
const submissionController = require("../../controllers/submission.controller");

const router = express.Router();

router
  .route("/")
  .post(
    validate(submissionValidation.createSubmission),
    submissionController.createSubmission
  )
  .get(
    auth(),
    validate(submissionValidation.getSubmissions),
    submissionController.getSubmissions
  );

router
  .route("/:submissionId")
  .get(
    auth(),
    validate(submissionValidation.getSubmission),
    submissionController.getSubmission
  )
  .delete(
    auth(),
    validate(submissionValidation.deleteSubmission),
    submissionController.deleteSubmission
  )
  .patch(
    auth(),
    validate(submissionValidation.updateSubmission),
    submissionController.updateSubmission
  );

module.exports = router;
