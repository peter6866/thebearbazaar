const express = require("express");
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const banController = require("../controller/banController");
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

router
  .route("/change-password")
  .post(authController.protect, userController.changePassword);

router.post(
  "/ban-user",
  authController.protect,
  authController.restrictTo("admin"),
  banController.banUser
);

router
  .route("/phone-num")
  .get(authController.protect, userController.getPhoneNum)
  .post(authController.protect, userController.addPhoneNum);

router.post(
  "/update-preference",
  authController.protect,
  userController.updatePreference
);

router
  .route("/delete-num")
  .post(authController.protect, userController.deletePhoneNum);

module.exports = router;
