const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");

const router = express.Router();

// TODO: Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    password: "your_password",
  },
});

// TODO:
const sendVerificationEmail = () => {};

// sign up route
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomBytes(64).toString("hex");

    const newUser = await User.create({
      email,
      password: passwordHash,
      verificationCode,
      verificationCodeTimestamp: new Date(),
    });

    await sendVerificationEmail(email, verificationCode);

    res.status(201).send("User created");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
