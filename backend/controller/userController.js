const User = require("../models/userModel");
const PhoneNum = require("../models/phoneNumModel");
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

exports.getPhoneNum = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;
  const phoneNum = await PhoneNum.findOne({ where: { userId: user_id } });

  if (!phoneNum) {
    return next(new AppError("Phone number not found", 404));
  }

  res.status(201).json({
    status: "success",
    phoneNum: phoneNum.phoneNum,
    isPrefered: phoneNum.isPrefered,
  });
});

exports.addPhoneNum = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;
  const { phoneNum } = req.body;

  // regex to check if phone number is valid
  const phoneNumRegex = /\b\d{3}[-.]\d{3}[-.]\d{4}\b/;
  if (!phoneNumRegex.test(phoneNum)) {
    return next(new AppError("Invalid phone number", 400));
  }

  await PhoneNum.create({ phoneNum, userId: user_id });

  res.status(201).json({
    status: "success",
    message: "Successfully added phone number",
  });
});

exports.updatePreference = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;
  const { isPrefered } = req.body;

  // get the phone num for this user
  const phoneNum = await PhoneNum.findOne({ where: { userId: user_id } });

  if (!phoneNum) {
    return next(new AppError("Phone number not found", 404));
  }

  await phoneNum.update({ isPrefered });

  res.status(201).json({
    status: "success",
    message: "Successfully updated preference",
  });
});

exports.deletePhoneNum = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;

  // get the phone num for this user
  await PhoneNum.destroy({ where: { userId: user_id } });

  res.status(201).json({
    status: "success",
    message: "Successfully deleted phone number",
  });
});
