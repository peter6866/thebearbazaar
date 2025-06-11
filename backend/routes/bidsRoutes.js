const express = require("express");
const bidsController = require("../controller/bidsController");
const authController = require("../controller/authController");

const router = express.Router();

// Public routes (no authentication required)
router.get("/market", bidsController.getMarketInfo);

// Protected routes - require authentication
router.use(authController.protect);

router
  .route("/")
  .get(bidsController.getBid) // GET /api/v1/bids - get current user's bid
  .post(bidsController.createBid) // POST /api/v1/bids - create new bid (buy/sell)
  .delete(bidsController.cancelBid); // DELETE /api/v1/bids - cancel current bid

// Admin-only routes
router.use(authController.restrictTo("admin"));

router.post("/match", bidsController.match); // POST /api/v1/bids/match - trigger matching

router.delete("/all", bidsController.deleteAllBids); // DELETE /api/v1/bids/all - delete all bids

module.exports = router;
