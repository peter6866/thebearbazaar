const express = require("express");
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const router = express.Router();

// get code route
router.post("/get-code", authController.getCode);
// sign up verify route
router.post("/signup-verify", authController.signUpVerify);
// resend verification code route
router.post("/resend-code", authController.resendCode);
// login route
router.post("/login", authController.login);

//update notification settings route
router
  .route("/update-notifications")
  .post(authController.protect, userController.updateNotificationSettings);

router
  .route("/get-notifications")
  .post(authController.protect, userController.getNotificationSettings);

module.exports = router;
