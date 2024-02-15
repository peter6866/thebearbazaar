const express = require("express");
const jwt = require("jsonwebtoken");
const authController = require("../controller/authController");
const router = express.Router();

// get code route
router.post("/get-code", authController.getCode);
// sign up verify route
router.post("/signup-verify", authController.signUpVerify);
// resend verification code route
router.post("/resend-code", authController.resendCode);

module.exports = router;
