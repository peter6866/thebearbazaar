const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");

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

exports.changePassword = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;

  //check if old password is correct
  if (!(await user.correctPassword(oldPassword, user.password))) {
    return next(new AppError("Incorrect password", 401));
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await user.update({ password: passwordHash });

  res.status(201).json({
    status: "success",
    message: "Successfully changed password",
  });
});
