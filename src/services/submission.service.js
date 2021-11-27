const httpStatus = require("http-status");
const { Submission, Form } = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");
const config = require("../config");
const { default: axios } = require("axios");

/**
 * Create a submission
 * @param {Object} submissionBody
 * @returns {Promise<Submission>}
 */
const createSubmission = async (submissionBody) => {
  return Submission.create(submissionBody);
};

/**
 * Get submission by id
 * @param {ObjectId} id
 * @returns {Promise<Submission>}
 */
const getSubmissionById = async (id) => {
  return Submission.findByPk(id);
};

/**
 * Query for submissions
 * @param {Object} filter - filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the submission's: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getFormSubmissions = async (formId, options) => {
  const sort = [];
  const allowed = ["created_at", "updated_at"]; //allowed sortBy fields
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

  const { count, rows } = await Submission.findAndCountAll({
    where: {
      form_id: {
        [Op.eq]: formId,
      },
    },
    order: sort,
    offset: offset,
    limit: limit,
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
 * Update submission by id
 * @param {ObjectId} submissionId
 * @param {Object} updateBody
 * @returns {Promise<Submission>}
 */
const updateSubmissionById = async (submissionId, updateBody) => {
  const submission = await getSubmissionById(submissionId);
  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
  }
  Object.assign(submission, updateBody);
  await submission.save();
  return submission;
};

/**
 * Delete submission by id
 * @param {ObjectId} submissionId
 * @returns {Promise<Submission>}
 */
const deleteSubmissionById = async (submissionId) => {
  const submission = await getSubmissionById(submissionId);
  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
  }
  return submission.destroy();
};

/**
 * verify validity a submission for spam
 * @param {string} token
 * @returns {Promise<Object>}
 */
const verifySubmissionRecaptchaResponse = async (token) => {
  let payload = {
    secret: config.recaptcha.secret,
    response: token,
  };
  return axios({
    method: "post",
    url: `https://www.google.com/recaptcha/api/siteverify`,
    data: new URLSearchParams(Object.entries(payload)).toString(),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

module.exports = {
  createSubmission,
  getFormSubmissions,
  getSubmissionById,
  updateSubmissionById,
  deleteSubmissionById,
  verifySubmissionRecaptchaResponse,
};
