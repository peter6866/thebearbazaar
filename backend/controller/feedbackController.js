const Feedback = require("../models/feedbackModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.getFeedback = catchAsync(async (req, res, next) => {
  // find all feedbacks in time descending order
  const feedbacks = await Feedback.findAll({
    where: { hidden: false },
    order: [["createdAt", "DESC"]],
  });

  // given the user_id in the feedbacks, find the email of the user
  // and add it to the feedbacks object
  for (let i = 0; i < feedbacks.length; i++) {
    const feedback = feedbacks[i];
    const user = await User.findByPk(feedback.user_id);

    feedbacks[i] = {
      ...feedbacks[i].dataValues,
      userEmail: user.email,
    };
  }

  res.status(200).json({
    status: "success",
    feedbacks,
  });
});

exports.deleteFeedback = catchAsync(async (req, res, next) => {
  const { feedback_id } = req.body;

  const deletedRows = await Feedback.destroy({
    where: { id: feedback_id },
  });

  if (deletedRows === 0) {
    return next(new AppError("Feedback not found", 404));
  }

  res.status(201).json({
    status: "success",
  });
});

exports.archiveFeedback = catchAsync(async (req, res, next) => {
  const { feedback_id } = req.body;

  const [updatedRows] = await Feedback.update(
    { hidden: true },
    { where: { id: feedback_id } }
  );

  if (updatedRows === 0) {
    return next(new AppError("Feedback not found", 404));
  }

  res.status(201).json({
    status: "success",
  });
});

exports.postFeedback = catchAsync(async (req, res, next) => {
  const { subject, feedback } = req.body;

  user_id = req.user.id;

  // create feedback
  await Feedback.create({
    subject,
    feedback,
    user_id,
  });

  res.status(201).json({
    status: "success",
    message: "Feedback added successfully",
  });
});
