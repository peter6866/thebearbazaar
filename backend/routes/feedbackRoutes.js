const express = require("express");
const feedbackController = require("../controller/feedbackController");
const authController = require("../controller/authController");

const router = express.Router();

// Protected routes - require authentication
router.use(authController.protect);

router.post("/", feedbackController.postFeedback);

// Admin-only routes
router.use(authController.restrictTo("admin"));

router.get("/", feedbackController.getFeedback);
router.delete("/:id", feedbackController.deleteFeedback);
router.patch("/:id/archive", feedbackController.archiveFeedback);

module.exports = router;
