const express = require("express");
const faqController = require("../controller/faqController");
const router = express.Router();

// get faq route
router.post("/get-faq", faqController.getFAQ);

module.exports = router;
