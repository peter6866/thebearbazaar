const express = require("express");
const matchController = require("../controller/matchController");
const authController = require("../controller/authController");

const router = express.Router();

// Public routes
router.get("/price-history", matchController.priceHistory);

// Protected routes - require authentication
router.use(authController.protect);

router.get("/current", matchController.matchInfo);
router.delete("/current", matchController.cancelTrans);

// Admin-only routes
router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(matchController.getMatch)
  .delete(matchController.deleteAllMatchBids);

router.get("/cancellations", matchController.getCancels);

module.exports = router;
