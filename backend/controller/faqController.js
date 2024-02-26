const FAQs = require("../models/faqModel");
const catchAsync = require("../utils/catchAsync");

exports.faqData = [
  {
    question: "How often can I buy/sell meal points?",
    answer: "WashU allows students to transfer meal points once per semester.",
  },
  {
    question: "What do I do after I make a transaction?",
    answer:
      "Wait until the system finds a match for you, then you go to the dining office and carryout the exchange.",
  },
  {
    question: "How do I contact the other person?",
    answer:
      "When matched, you will be provided with their @wustl email address to set a time to meet.",
  },
  {
    question:
      "What do I do if the other person is not willing to buy/sell meal points?",
    answer: "Make another transaction and report any abuse of the system.",
  },
];

exports.initializeFAQs = async (data) => {
  try {
    const currentFAQ = FAQs.findAll();
    if (currentFAQ.length !== data.length) {
      await FAQs.destroy({
        where: {},
      });
      await FAQs.bulkCreate(data);
    }
  } catch (error) {
    console.error("Failed to initialize FAQ data:", error);
  }
};

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
