const express = require("express");
const matchController = require("../controller/matchController");
const authController = require("../controller/authController");
const router = express.Router();

router
  .route("/match-info")
  .post(authController.protect, matchController.matchInfo);

router.route("/price-history").post(matchController.priceHistory);

module.exports = router;
