const Joi = require("joi");

const createSubmission = {
  body: Joi.object().keys({
    data: Joi.object().required(),
    formId: Joi.string().required(),
    token: Joi.string().allow(null, ""),
  }),
};

const getSubmission = {
  params: Joi.object().keys({
    submissionId: Joi.string().required(),
  }),
};

const getSubmissions = {
  query: Joi.object().keys({
    formId: Joi.string().required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateSubmission = {
  params: Joi.object().keys({
    submissionId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      data: Joi.object(),
    })
    .min(1),
};

const deleteSubmission = {
  params: Joi.object().keys({
    submissionId: Joi.string().required(),
  }),
};

const submissionDataPoint = {
  data: Joi.object().keys({
    value: Joi.string().required(),
    label: Joi.string().required(),
    field_type: Joi.string()
      .required()
      .valid(
        "SHORT_ANSWER",
        "LONG_ANSWER",
        "DATE",
        "NUMBER",
        "EMAIL",
        "DROPDOWN_SELECT",
        "RADIO_GROUP",
        "CHECKBOX_GROUP",
        "SIGNATURE",
        "RICH_TEXT"
      ),
  }),
};

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
};
