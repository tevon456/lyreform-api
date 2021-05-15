const Joi = require("@hapi/joi");
const { color } = require("./custom.validation");

const createForm = {
  body: Joi.object().keys({
    name: Joi.string().max(128).min(3).required(),
    logo_url: Joi.string(),
    published: Joi.boolean().required(),
    header_foreground: Joi.string().required().custom(color),
    header_background: Joi.string().required().custom(color),
    body_foreground: Joi.string().required().custom(color),
    body_background: Joi.string().required().custom(color),
    controls_foreground: Joi.string().required().custom(color),
    controls_background: Joi.string().required().custom(color),
    page_background: Joi.string().required().custom(color),
    fields: Joi.array()
      .required()
      .items({
        id: Joi.string().required(),
        name: Joi.string().required(),
        label: Joi.string().required(),
        field_type: Joi.string().required(),
        placeholder: Joi.string(),
        min: Joi.number(),
        max: Joi.number(),
        required: Joi.boolean().required(),
        options: Joi.array().items({
          value: Joi.alternatives().try(Joi.string(), Joi.array()),
        }),
      }),
  }),
};

const getForm = {
  params: Joi.object().keys({
    formId: Joi.string().required(),
  }),
};

const getForms = {
  query: Joi.object().keys({
    published: Joi.number().integer(),
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateForm = {
  params: Joi.object().keys({
    formId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().max(128).min(3).required(),
    logo_url: Joi.string(),
    published: Joi.boolean().required(),
    header_foreground: Joi.string().required().custom(color),
    header_background: Joi.string().required().custom(color),
    body_foreground: Joi.string().required().custom(color),
    body_background: Joi.string().required().custom(color),
    controls_foreground: Joi.string().required().custom(color),
    controls_background: Joi.string().required().custom(color),
    page_background: Joi.string().required().custom(color),
    fields: Joi.array()
      .required()
      .items({
        id: Joi.string().required(),
        name: Joi.string().required(),
        label: Joi.string().required(),
        field_type: Joi.string().required(),
        placeholder: Joi.string(),
        min: Joi.number(),
        max: Joi.number(),
        required: Joi.boolean().required(),
        options: Joi.array().items({
          value: Joi.alternatives().try(Joi.string(), Joi.array()),
        }),
      }),
  }),
};

const deleteForm = {
  params: Joi.object().keys({
    formId: Joi.string().required(),
  }),
};

module.exports = {
  createForm,
  getForm,
  getForms,
  updateForm,
  deleteForm,
};
