const Joi = require("@hapi/joi");
const { color } = require("./custom.validation");

const createForm = {
  body: Joi.object().keys({
    name: Joi.string().max(128).min(3).required(),
    logo_url: Joi.string().allow(null,""),
    published: Joi.boolean().required(),
    header_foreground: Joi.string().required().custom(color),
    header_background: Joi.string().required().custom(color),
    body_foreground: Joi.string().required().custom(color),
    body_background: Joi.string().required().custom(color),
    controls_foreground: Joi.string().required().custom(color),
    controls_background: Joi.string().required().custom(color),
    page_background: Joi.string().required().custom(color),
    fields: Joi.array()
      .items({
        id: Joi.string().required(),
        name: Joi.string().required(),
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
        placeholder: Joi.string().allow(null, ""),
        min: Joi.number(),
        max: Joi.number(),
        required: Joi.boolean().required(),
        options: Joi.array().items({
          value: Joi.alternatives().try(Joi.string(), Joi.array()),
        }),
      })
      .required(),
  }),
};

const getForm = {
  params: Joi.object().keys({
    formId: Joi.string().uuid().required(),
  }),
};

const getForms = {
  query: Joi.object().keys({
    published: Joi.number().integer().min(0).max(1),
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer().max(50).min(5),
    page: Joi.number().integer(),
  }),
};

const updateForm = {
  params: Joi.object().keys({
    formId: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().max(128).min(3).required(),
    logo_url: Joi.string().allow(null,""),
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
        placeholder: Joi.string().allow(null, ""),
        min: Joi.alternatives(Joi.string(), Joi.number()).allow(null, ""),
        max: Joi.alternatives(Joi.string(), Joi.number()).allow(null, ""),
        required: Joi.boolean().required(),
        options: Joi.array().items({
          value: Joi.alternatives().try(Joi.string(), Joi.array()),
        }),
      }),
  }),
};

const deleteForm = {
  params: Joi.object().keys({
    formId: Joi.string().uuid().required(),
  }),
};

module.exports = {
  createForm,
  getForm,
  getForms,
  updateForm,
  deleteForm,
};
