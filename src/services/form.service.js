const httpStatus = require("http-status");
const { Form } = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");

/**
 * Create a form
 * @param {Object} formBody
 * @returns {Promise<Form>}
 */
const createForm = async (formBody) => {
  return Form.create(formBody);
};

/**
 * Get form by id
 * @param {number} id
 * @returns {Promise<Form>}
 */
const getFormById = async (id) => {
  return Form.findByPk(id);
};

/**
 * Get form by uuid
 * @param {number} uuid
 * @returns {Promise<Form>}
 */
const getFormByUUID = async (uuid) => {
  return Form.findOne({ where: { uuid } });
};

/**
 * Get userform by id
 * @param {number} userId
 * @param {string} filter.name - filter by form name
 * @param {number} filter.published - filter by published 1 = true, 0 = false
 * @param {string} options.sortyBy - sort by [name,created_at,updated_at] in asc / desc order
 * @param {string} options.limit - number of results per page
 * @param {string} options.page - result page that auto calculates the offset
 * @returns {Promise<Form>}
 */
const getUserForms = async (userId, filter, options) => {
  const sort = {};
  if (options.sortBy) {
    const parts = options.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? "DESC" : "ASC";
  }
  //TODO Limit sort to use only allowed ordery by
  const limit =
    options.limit && parseInt(options.limit, 10) > 0
      ? parseInt(options.limit, 10)
      : 10;
  const page =
    options.page && parseInt(options.page, 10) > 0
      ? parseInt(options.page, 10)
      : 1;
  const offset = (page - 1) * limit;

  const { count, rows } = await Form.findAndCountAll({
    where: {
      user_id: {
        [Op.eq]: userId,
      },
      ...filter,
    },
    offset: offset,
    limit: limit,
  });
  result = {
    total_results: count,
    results: rows,
    limit,
    current_page: page,
    total_pages: Math.ceil(count / limit),
  };
  return result;
};

/**
 * Update form by id
 * @param {ObjectId} formId
 * @param {Object} updateBody
 * @returns {Promise<Form>}
 */
const updateFormById = async (formId, updateBody) => {
  const form = await getFormById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found");
  }
  Object.assign(form, updateBody);
  await form.save();
  return form;
};

/**
 * Delete form by id
 * @param {ObjectId} formId
 * @returns {Promise<Form>}
 */
const deleteFormById = async (formId) => {
  const form = await getFormById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found");
  }
  return await form.destroy();
};

module.exports = {
  createForm,
  getFormById,
  getFormByUUID,
  getUserForms,
  updateFormById,
  deleteFormById,
};
