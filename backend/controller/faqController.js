const FAQ = require("../models/faqModel");
const catchAsync = require("../utils/catchAsync");

const faqData = [
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

const currentFAQ = FAQ.findAll();
if (currentFAQ !== faqData) {
  FAQ.destroy({
    where: {},
  });
  FAQ.bulkCreate(faqData);
}

// handler for getting one-time code
exports.getFAQ = catchAsync(async (req, res, next) => {
  const questionsData = await FAQ.findAll();
  if (!questionsData) {
    return next(new AppError("Could not load FAQ data", 404));
  }
  res.status(200).json({
    status: "success",
    questions: questionsData,
  });
});
