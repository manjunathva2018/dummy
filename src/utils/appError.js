class AppError extends Error {
  constructor(customMessage, statusCode, errorObj, validationErrors) {
    super(errorObj);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "FAIL" : "ERROR";
    this.customMessage = customMessage;
    this.validationErrors = validationErrors;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
