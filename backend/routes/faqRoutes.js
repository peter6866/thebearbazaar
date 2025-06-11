const express = require("express");
const faqController = require("../controller/faqController");
const authController = require("../controller/authController");

const router = express.Router();

// Public routes
router.get("/", faqController.getFAQ);

// Admin-only routes
router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.post("/", faqController.postFAQ);
router.delete("/", faqController.deleteFAQ);

module.exports = router;
