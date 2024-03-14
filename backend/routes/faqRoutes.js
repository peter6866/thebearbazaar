const express = require("express");
const faqController = require("../controller/faqController");
const authController = require("../controller/authController");
const router = express.Router();

// get faq route
router.post("/get-faq", faqController.getFAQ);

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    faqController.postFAQ
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    faqController.deleteFAQ
  );

module.exports = router;
