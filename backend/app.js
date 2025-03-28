const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const { RedisStore } = require("rate-limit-redis");
const redis = require("./db/redis");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const userRouter = require("./routes/userRoutes");
const bidsRouter = require("./routes/bidsRoutes");
const faqRouter = require("./routes/faqRoutes");
const matchRouter = require("./routes/matchRoutes");
const settingsRouter = require("./routes/settingsRoutes");
const feedbackRouter = require("./routes/feedbackRoutes");

const app = express();

app.use(cors());
app.use(helmet());

if (process.env.NODE_DEV_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
});

if (process.env.NODE_DEV_ENV === "production") {
  app.use("/api", limiter);
  console.log("Rate limit enabled");
}

app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/bids", bidsRouter);
app.use("/api/v1/faq", faqRouter);
app.use("/api/v1/match", matchRouter);
app.use("/api/v1/settings", settingsRouter);
app.use("/api/v1/feedback", feedbackRouter);

// handling unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
