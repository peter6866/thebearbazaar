const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getNotificationSettings = catchAsync(async (req, res, next) => {
  const { sendMatchNotifications, sendPriceNotifications } = req.user;
  res.status(201).json({
    status: "success",
    sendMatchNotifications: sendMatchNotifications,
    sendPriceNotifications: sendPriceNotifications,
  });
});

exports.updateNotificationSettings = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { sendMatchNotifications, sendPriceNotifications } = req.body;

  await user.update({
    sendMatchNotifications: sendMatchNotifications,
    sendPriceNotifications: sendPriceNotifications,
  });

  res.status(201).json({
    status: "success",
    message: "Successfully updated notification settings",
  });
});
