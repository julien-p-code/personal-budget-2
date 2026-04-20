// middleware/error-handler.js
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  // Log the error stack trace for server errors.
  if (status >= 500) {
    console.error(err.stack);
  }

  // Send JSON response with error message.
  return res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;