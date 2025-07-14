const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");

module.exports.validateRequest = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = errors.array().map((err) => {
    return { message: err.msg, field: err.param };
  });
  return next(
    new AppError("Please provide correct input !", 422, null, extractedErrors)
  );
};
