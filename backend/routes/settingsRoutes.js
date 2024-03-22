const express = require("express");
const settingsController = require("../controller/settingsController");
const authController = require("../controller/authController");
const router = express.Router();

router
  .route("/get-scheduled-match-time")
  .post(settingsController.getScheduledMatchTime);

router
  .route("/set-scheduled-match-time")
  .post(settingsController.setScheduledMatchTime);

module.exports = router;
