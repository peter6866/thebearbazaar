const express = require("express");
const bidsController = require("../controller/bidsController");
const authController = require("../controller/authController");
const router = express.Router();

// sell bid route
router.route("/sell-bid").post(authController.protect, bidsController.sellBid);
// post buy bid route
router.route("/buy-bid").post(authController.protect, bidsController.buyBid);
//get current bid
router.route("/get-bid").post(authController.protect, bidsController.getBid);
//cancel bid
router
  .route("/cancel-bid")
  .post(authController.protect, bidsController.cancelBid);

router.post(
  "/match",
  authController.protect,
  authController.restrictTo("admin"),
  bidsController.match
);

router.delete(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  bidsController.deleteAllBids
);

router.route("/get-market-info").post(bidsController.getMarketInfo);

module.exports = router;
