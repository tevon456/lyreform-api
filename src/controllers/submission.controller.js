const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { submissionService, formService } = require("../services");

const createSubmission = catchAsync(async (req, res) => {
  const form = await formService.getFormByUUID(req.body.formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found");
  } else if (!form.published) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found");
  } else {
    let submissionBody = { ...req.body, form_id: form.id };
    const submission = await submissionService.createSubmission(submissionBody);
    res.status(httpStatus.CREATED).send({message:"response successful"});
  }
});

const getSubmissions = catchAsync(async (req, res) => {
  let form = await formService.getFormByUUID(req.query.formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found");
  }
  if (form.user_id !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
  }
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const results = await submissionService.getFormSubmissions(form.id, options);
  res.send(results);
});

const getSubmission = catchAsync(async (req, res) => {
  const submission = await submissionService.getSubmissionById(
    req.params.submissionId
  );
  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
  }
  const form = await formService.getFormById(submission.form_id);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
  }
  if (form.user_id !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not Authorized");
  }
  res.send(submission);
});

const updateSubmission = catchAsync(async (req, res) => {
  const submission = await submissionService.getSubmissionById(
    req.params.submissionId
  );
  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
  }
  let form = await formService.getFormById(submission.form_id);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found");
  }
  if (form.user_id !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not Authorized");
  }

  let updated = await submissionService.updateSubmissionById(
    req.params.submissionId,
    req.body
  );
  res.send(updated);
});

const deleteSubmission = catchAsync(async (req, res) => {
  const submission = await submissionService.getSubmissionById(
    req.params.submissionId
  );
  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
  }
  const form = await formService.getFormById(submission.form_id);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found");
  }
  if (form.user_id !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not Authorized");
  } else {
    await submissionService.deleteSubmissionById(req.params.submissionId);
    res.status(httpStatus.NO_CONTENT).send();
  }
});

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
};
