const Joi = require("@hapi/joi");

const createSubmission = {
  body: Joi.object().keys({
    data: Joi.object({}).required(),
    formId: Joi.string().required(),
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

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
};
