const express = require("express");
const authController = require("../controller/faqController");
const router = express.Router();

// get code route
router.post("/get-faq", authController.getFAQ);

module.exports = router;
