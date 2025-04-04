const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (res.headersSent) {
    return;
  }
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    console.error("ERROR 💥", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpireError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(err);

  if (process.env.NODE_DEV_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_DEV_ENV === "production") {
    let error = { ...err };
    console.log(error);
    if (error.name === "JsonwebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpireError();
    sendErrorProd(err, res);
  }
};
