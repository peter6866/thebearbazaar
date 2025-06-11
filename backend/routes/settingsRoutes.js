const express = require("express");
const settingsController = require("../controller/settingsController");
const authController = require("../controller/authController");

const router = express.Router();

// Public routes
router.get("/schedule", settingsController.getScheduledMatchTime);

// Admin-only routes
router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.patch("/schedule", settingsController.setScheduledMatchTime);

module.exports = router;
