class AppError extends Error {
  constructor(message, statusCode, res) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'failure' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);

    let errorObj = {
      statusCode,
      message,
    };
    if (res) {
      res.status(statusCode).json(errorObj);
    }
  }
}

module.exports = AppError;
