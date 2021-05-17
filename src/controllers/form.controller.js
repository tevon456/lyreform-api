const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { formService } = require("../services");

const createForm = catchAsync(async (req, res) => {
  let formBody = { ...req.body, user_id: req.user.id };
  const form = await formService.createForm(formBody);
  res.status(httpStatus.CREATED).send(form);
});

const getForm = catchAsync(async (req, res) => {
  const form = await formService.getFormByUUID(req.params.formId);

  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found");
  }

  /*
  Form requested by authenticated user
  */
  if (req.user) {
    if (req.user.id === form.user_id && form.published === false) {
      res.json(form);
    } else if (req.user.id !== form.user_id && form.published === false) {
      throw new ApiError(httpStatus.NOT_FOUND, "Form not found");
    } else {
      res.send(form);
    }
  } else {
    /* 
    Form requested by unauthenticated user 
    */
    if (form.published === false) {
      throw new ApiError(httpStatus.NOT_FOUND, "Form not found");
    } else {
      res.send(form);
    }
  }
});

const getForms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "published"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const results = await formService.getUserForms(req.user.id, filter, options);
  if (!results) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found");
  }
  res.send(results);
});

const updateForm = catchAsync(async (req, res) => {
  const form = await formService.getFormByUUID(req.params.formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found");
  }
  if (form.user_id !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
  }

  const updatedForm = await formService.updateFormById(form.id, req.body);
  res.send(updatedForm);
});

const deleteForm = catchAsync(async (req, res) => {
  const form = await formService.getFormByUUID(req.params.formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found");
  }
  if (form.user_id !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized");
  }
  await formService.deleteFormById(form.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createForm,
  getForm,
  getForms,
  updateForm,
  deleteForm,
};
