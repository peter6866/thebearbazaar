const FAQs = require("../models/faqModel");
const catchAsync = require("../utils/catchAsync");

exports.faqData = [
  {
    question: "How often can I buy/sell meal points?",
    answer: "WashU allows students to transfer meal points once per semester.",
  },
  {
    question: "Is there a limit to the number of meal points I can exchange?",
    answer:
      "Yes, students can exchange exactly 500 meal points per transaction.",
  },
  {
    question: "What do I do after I make a transaction?",
    answer:
      "Wait until the system finds a match for you, then you go to the dining office and carry out the exchange.",
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
  {
    question:
      "What happens if I change my mind after initiating a transaction?",
    answer:
      "If you change your mind, you can cancel the transaction before being matched with another party. Once matched, please proceed with the transaction.",
  },
  {
    question: "Can I transfer meal points to someone outside of WashU?",
    answer:
      "No, meal point transactions are restricted to students within the WashU community.",
  },
  {
    question: "How does the matching process work?",
    answer:
      "Matches are generated every Sunday at noon. The system finds a fair price based on the ranges set by all of the bidders in the current week and pairs people accordingly.",
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
