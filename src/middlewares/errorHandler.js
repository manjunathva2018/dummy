
const AppError = require("./../utils/appError");


const sendErrorDev = (err, res) => {
  console.error(colors.red, err.stack);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.customMessage,
    validationErrors: err.validationErrors,
    error: err.message,
  });
};



const sendErrorProd = (err, res) => {
  console.error(colors.red, err.stack);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.customMessage,
    validationErrors: err.validationErrors,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "ERROR";

  if (appConfig.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (appConfig.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};
