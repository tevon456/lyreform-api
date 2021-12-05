const httpStatus = require("http-status");
const { Form, Submission } = require("../models");
const { Op, Sequelize } = require("sequelize");
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
 * Get user forms by id
 * @param {number} userId
 * @param {string} filter.name - filter by form name
 * @param {number} filter.published - filter by published 1 = true, 0 = false
 * @param {string} options.sortBy - sort by [name,created_at,updated_at] in asc / desc order
 * @param {number} options.limit - number of results per page
 * @param {number} options.page - result page that auto calculates the offset
 * @returns {Promise<PaginatedForms>}
 */
const getUserForms = async (userId, filter, options) => {
  const sort = [];
  const allowed = ["name", "created_at", "updated_at"]; //allowed sortBy fields
  if (options.sortBy) {
    const parts = options.sortBy.split(","); // split sortBy params comma delimited into array of parts
    parts.map((part, index) => {
      sort[index] = part.split(":");
      sort[index][1] = sort[index][1] === "desc" ? "DESC" : "ASC";
      if (!allowed.includes(sort[index][0])) {
        //Throw an error if the sortBy param is not allowed
        const formatter = new Intl.ListFormat("en", {
          style: "long",
          type: "conjunction",
        });
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `${
            sort[index][0]
          } is not an allowed sortBy param, allowed params include: ${formatter.format(
            allowed
          )} `
        );
      }
    });
  }

  // Prepare or calculate limit, page and offset
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
    order: sort,
    offset: offset,
    limit: limit,
    include: [
      {
        model: Submission,
        attributes: ["createdAt"],
      },
    ],
    distinct: true,
  });

  return {
    total_results: count,
    results: rows,
    limit,
    current_page: page,
    total_pages: Math.ceil(count / limit),
  };
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
  return form.destroy();
};

module.exports = {
  createForm,
  getFormById,
  getFormByUUID,
  getUserForms,
  updateFormById,
  deleteFormById,
};
