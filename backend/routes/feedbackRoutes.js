const express = require("express");
const feedbackController = require("../controller/feedbackController");
const authController = require("../controller/authController");
const router = express.Router();

// get feedback route
router.post(
  "/get-feedback",
  authController.protect,
  authController.restrictTo("admin"),
  feedbackController.getFeedback
);

router.post(
  "/delete-feedback",
  authController.protect,
  authController.restrictTo("admin"),
  feedbackController.deleteFeedback
);

router.post(
  "/archive-feedback",
  authController.protect,
  authController.restrictTo("admin"),
  feedbackController.archiveFeedback
);

router.post("/", authController.protect, feedbackController.postFeedback);

module.exports = router;
