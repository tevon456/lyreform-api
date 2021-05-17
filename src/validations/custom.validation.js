const chroma = require("chroma-js");

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message("password must be at least 8 characters");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      "password must contain at least 1 letter and 1 number"
    );
  }
  return value;
};

const color = (value, helpers) => {
  let field = helpers.state.path[1];
  if (!chroma.valid(value)) {
    return helpers.message(
      `${field} should be a valid color, supported color formats are: hexadecimal, rgba and hsl`
    );
  }
  return value;
};

module.exports = {
  password,
  color,
};
