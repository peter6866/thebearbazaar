const BanUsers = require("../models/banUsersModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.banUser = catchAsync(async (req, res, next) => {
  const { userEmail } = req.body;

  // get the user_id from the email
  const user = await User.findOne({
    where: {
      email: userEmail,
    },
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Check if the user is already banned
  const existingBan = await BanUsers.findOne({
    where: {
      user_id: user.id,
    },
  });
  if (existingBan) {
    return next(new AppError("This user is already banned", 400));
  }

  await BanUsers.create({
    user_id: user.id,
  });
  res.status(201).json({
    status: "success",
    message: "User banned successfully",
  });
});
