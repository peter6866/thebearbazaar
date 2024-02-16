const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// TODO: change to sendgrid
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 465,
  secure: true,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

// helper function to send verification email
const sendVerificationEmail = (email, verificationCode) => {
  // TODO: can not deliever to wustl.edu
  const mailOptions = {
    from: "bearbazaar <no-reply@thebearbazaar.com>",
    // from: "hjiayu@wustl.edu",
    to: email,
    subject: "Please verify your email",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
    </head>
    <body>
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hello, thank you for signing up!</h2>
            <p>Please verify your email by entering the following code:</p>
            <div style="background-color: #f2f2f2; padding: 20px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; border-radius: 5px;">
                ${verificationCode}
            </div>
            <p>Thank you for using our service!</p>
        </div>
    </body>
    </html>
        `,
  };

  // return a promise to send the email
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

// handler for getting one-time code
exports.getCode = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  let newUser;

  // check if the user already verified
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

  await sendVerificationEmail(email, verificationCode);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

// handler for signing up
exports.signUpVerify = catchAsync(async (req, res, next) => {
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

  // generate jwt token
  const token = signToken(user.id);

  // check if the code is correct
  correct = user.correctCode(verificationCode, user.verificationCode);
  if (correct) {
    await user.update({
      password: passwordHash,
      isVerified: true,
      verificationCode: null,
      verificationCodeTimestamp: null,
    });
    res.status(201).json({
      status: "success",
      message: "Email verified successfully",
      token,
    });
  } else {
    return next(new AppError("Incorrect verification code", 400));
  }
});

// handler for resending the verification code
exports.resendCode = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // check if the user already verified
  if (user.isVerified) {
    return next(new AppError("User already verified", 400));
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  await user.update({
    verificationCode: verificationCode.toString(),
    verificationCodeTimestamp: new Date(),
  });

  await sendVerificationEmail(email, verificationCode);

  res.status(201).json({
    status: "success",
    message: "Verification code sent successfully",
  });
});

// handler for logging in
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // // check if user exists && password is correct
  const user = await User.findOne({ where: { email } });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // if everything is ok, send token to client
  const token = signToken(user.id);
  console.log(token);
  res.status(200).json({
    status: "success",
    token,
  });
});
