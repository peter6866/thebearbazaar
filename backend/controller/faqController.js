const FAQs = require("../models/faqModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getFAQ = catchAsync(async (req, res, next) => {
  const questionsData = await FAQs.findAll();
  if (!questionsData) {
    return next(new AppError("Could not load FAQ data", 404));
  }
  res.status(200).json({
    status: "success",
    questions: questionsData,
  });
});

exports.postFAQ = catchAsync(async (req, res, next) => {
  const { question, answer } = req.body;

  // Check if the question exists
  const existingFAQ = await FAQs.findOne({
    where: {
      question,
    },
  });
  if (existingFAQ) {
    return next(new AppError("This question already exists", 400));
  }

  const newFAQ = await FAQs.create({
    question,
    answer,
  });
  res.status(201).json({
    status: "success",
    message: "FAQ added successfully",
    data: {
      faq: newFAQ,
    },
  });
});

exports.deleteFAQ = catchAsync(async (req, res, next) => {
  const { question } = req.body;

  const deletedFAQ = await FAQs.destroy({
    where: {
      question,
    },
  });
  if (!deletedFAQ) {
    return next(new AppError("Could not find the question", 404));
  }
  res.status(204).json({
    status: "success",
  });
});
