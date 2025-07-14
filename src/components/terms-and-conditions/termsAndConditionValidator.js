const { body } = require("express-validator");

module.exports.termsCondUpdationRules = () => {
  return [body("content").isString().trim()];
};
