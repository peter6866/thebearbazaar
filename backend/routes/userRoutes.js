const express = require("express");
const jwt = require("jsonwebtoken");
const authController = require("../controller/authController");
const router = express.Router();

// sign up route
router.post("/signup", authController.signup);
// verify email route
router.post("/verify-email", authController.verifyEmail);
// resend verification code route
router.post("/resend-code", authController.resendCode);

module.exports = router;
