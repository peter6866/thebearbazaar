const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const userRouter = require("./routes/userRoutes");
const bidsRouter = require("./routes/bidsRoutes");
const faqRouter = require("./routes/faqRoutes");

const app = express();

app.use(cors());

if (process.env.NODE_DEV_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/bids", bidsRouter);
app.use("/api/v1/faq", faqRouter);

// handling unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
