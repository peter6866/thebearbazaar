const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const BanUsers = require("../models/banUsersModel");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const emailService = require("../services/emailService");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, res) => {
  const token = signToken(user.id);

  res.status(201).json({
    status: "success",
    role: user.role,
    token,
  });
};

const verifyTurnstileToken = async (token, ip) => {
  const secret_key =
    process.env.NODE_DEV_ENV === "development"
      ? "1x0000000000000000000000000000000AA"
      : process.env.TURNSTILE_SECRET_KEY;

  const formData = new URLSearchParams();
  formData.append("secret", secret_key);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return { success: false, error: "Verification failed" };
  }
};

// handler for getting one-time code
exports.getCode = catchAsync(async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  const { email, reset, turnstileToken } = req.body;

  // Check for Turnstile token
  if (!turnstileToken) {
    return next(new AppError("CAPTCHA verification required", 400));
  }

  // Verify the Turnstile token
  const verification = await verifyTurnstileToken(turnstileToken, req.ip);
  if (!verification.success) {
    return next(new AppError("CAPTCHA verification failed", 400));
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@wustl\.edu$/;
  if (!emailRegex.test(email)) {
    return next(new AppError("Please enter your wustl email", 400));
  }

  let newUser;

  // check if the user already verified
  if (!reset) {
    const user = await User.findOne({ where: { email } });
    if (user && user.isVerified) {
      return next(new AppError("User already registered", 400));
    } else if (user && !user.isVerified) {
      newUser = await user.update({
        verificationCode: verificationCode.toString(),
        verificationCodeTimestamp: new Date(),
      });
    } else {
      newUser = await User.create({
        email,
        verificationCode: verificationCode.toString(),
        verificationCodeTimestamp: new Date(),
      });
    }
  } else {
    const user = await User.findOne({ where: { email } });

    if (user) {
      // check if the user is banned
      const ban = await BanUsers.findOne({ where: { user_id: user.id } });
      if (ban) {
        return next(new AppError("You are banned from the bear bazaar.", 403));
      }

      newUser = await user.update({
        verificationCode: verificationCode.toString(),
        verificationCodeTimestamp: new Date(),
      });
    } else {
      return next(new AppError("User does not exist", 400));
    }
  }

  await emailService.sendVerificationEmail(
    email.replace(/@wustl\.edu/g, "@email.wustl.edu"),
    verificationCode
  );

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

// handler for signing up
exports.signUpVerify = catchAsync(async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  const { email, verificationCode, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  // check if the code is expired (e.g., 1 hour limit)
  const isCodeExpired = user.isCodeExpired(user.verificationCodeTimestamp);
  if (isCodeExpired) {
    return next(new AppError("Verification code expired", 400));
  }

  // check if the code is correct
  correct = user.correctCode(verificationCode, user.verificationCode);
  if (correct) {
    await user.update({
      password: passwordHash,
      isVerified: true,
      verificationCode: null,
      verificationCodeTimestamp: null,
    });

    createSendToken(user, res);
  } else {
    return next(new AppError("Incorrect verification code", 400));
  }
});

// handler for resending the verification code
exports.resendCode = catchAsync(async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  await user.update({
    verificationCode: verificationCode.toString(),
    verificationCodeTimestamp: new Date(),
  });

  await emailService.sendVerificationEmail(email, verificationCode);

  res.status(201).json({
    status: "success",
    message: "Verification code sent successfully",
  });
});

// handler for logging in
exports.login = catchAsync(async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  const { email, password, turnstileToken } = req.body;

  // Check for Turnstile token
  if (!turnstileToken) {
    return next(new AppError("CAPTCHA verification required", 400));
  }

  // Verify the Turnstile token
  const verification = await verifyTurnstileToken(turnstileToken, req.ip);
  if (!verification.success) {
    return next(new AppError("CAPTCHA verification failed", 400));
  }

  // check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // // check if user exists && password is correct
  const user = await User.findOne({ where: { email } });

  if (user && !user.isVerified) {
    return next(new AppError("Please verify your email", 401));
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // check if the user is banned
  const ban = await BanUsers.findOne({ where: { user_id: user.id } });
  if (ban) {
    return next(new AppError("You are banned from the bear bazaar.", 403));
  }

  // if everything is ok, send token to client
  createSendToken(user, res);
});

// check if the user is logged in
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.user) {
    res.status(200).json({
      status: "success",
      data: {
        message: "User is logged in",
      },
    });
  } else {
    return next(new AppError("Please log in to access this page", 401));
  }
});

// middleware to protect routes
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new AppError("Invalid token. Please log in again.", 401));
  }

  const currentUser = await User.findByPk(decoded.id);
  // check if the user is banned
  const ban = await BanUsers.findOne({ where: { user_id: currentUser.id } });
  if (ban) {
    return next(new AppError("You are banned from the bear bazaar.", 403));
  }

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exist.", 401)
    );
  }

  req.user = currentUser;
  next();
});

// middleware to restrict routes
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
