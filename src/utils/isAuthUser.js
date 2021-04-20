/**
 * Check if the uuid belongs to the logged in user
 * @param {Object} req
 * @returns {Boolean}
 */
const isAuthUser = (uuid, req) => {
  if (!req.user) {
    return false;
  }
  if (uuid === req.user.uuid) {
    return true;
  }
  return false;
};

module.exports = isAuthUser;
