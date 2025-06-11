const express = require("express");
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const banController = require("../controller/banController");

const router = express.Router();

// Auth routes (public)
router.post("/auth/code", authController.getCode);
router.post("/auth/verify", authController.signUpVerify);
router.post("/auth/resend", authController.resendCode);
router.post("/auth/login", authController.login);

// Protected routes - require authentication
router.use(authController.protect);

router.get("/auth/status", authController.isLoggedIn);

// User profile and settings
router
  .route("/profile/notifications")
  .get(userController.getNotificationSettings)
  .patch(userController.updateNotificationSettings);

router.patch("/profile/password", userController.changePassword);

router
  .route("/profile/phone")
  .get(userController.getPhoneNum)
  .post(userController.addPhoneNum)
  .patch(userController.updatePreference)
  .delete(userController.deletePhoneNum);

// Statistics (could be public or admin-only based on requirements)
router.get("/stats/weekly", userController.getWeeklyUserStats);

// Admin-only routes
router.use(authController.restrictTo("admin"));

router.post("/ban", banController.banUser);

module.exports = router;
