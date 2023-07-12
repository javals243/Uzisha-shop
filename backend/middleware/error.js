const ErrorHandler = ({ message, statusCode, errors }) => {
  const error = {
    message,
    statusCode,
    errors,
  };

  if (statusCode === 400 && errors.some((error) => error.code === 11000)) {
    error.message = `Duplicate key ${Object.keys(error.keyValue)} Entered`;
  }

  return error;
};

module.exports = (err, req, res, next) => {
  const error = ErrorHandler(err);

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};
