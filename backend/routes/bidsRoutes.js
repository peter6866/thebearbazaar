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
router.route("/cancel-bid").post(authController.protect, bidsController.cancelBid);

module.exports = router;
