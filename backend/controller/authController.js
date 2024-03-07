const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const aws = require("@aws-sdk/client-ses");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// AWS SES Credentials
const ses = new aws.SES({
  apiVersion: "2012-10-17",
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

let transporter;
// use ses for production
if (process.env.NODE_DEV_ENV === "production") {
  transporter = nodemailer.createTransport({
    SES: { ses, aws },
  });
  // use sendgrid for development
} else {
  transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });
}

// helper function to send verification email
const sendVerificationEmail = (email, verificationCode) => {
  const mailOptions = {
    from: "The Bear Bazaar <no-reply@thebearbazaar.com>",
    to: email,
    subject: "Please verify your email for the bearbazaar!",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #222222;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #a51417; /* Main red color */
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .verification-code {
            background-color: #f8e6e7; /* Lighter shade of red for contrast */
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            font-size: 24px;
            font-weight: bold;
            color: #a51417; /* Main red color for text */
            border-radius: 5px;
            border: 1px dashed #a51417; /* Main red color for border */
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #999;
        }
        a {
            color: #a51417; /* Main red color for links */
        }
    </style>
  
    </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <h1>Welcome to The Bear Bazaar!</h1>
              </div>
              <h3>Hello! Please verify your WashU email.</h3>
              <div class="verification-code">
                  ${verificationCode}
              </div>
              <p>Enter the above code in the verification field on our website. This code is valid for 1 hour.</p>
              <p>If you didn't request this, please ignore this email or contact support if you have any concerns.</p>
              <div class="footer">
                  Thank you for using our service!<br>
                  <a href="mailto:hjiayu@wustl.edu" style="color: #005a9c;">Contact Support</a>
              </div>
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
  const { email, reset } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@wustl\.edu$/;
  if (!emailRegex.test(email)) {
    return next(new AppError("Please enter your wustl email", 400));
  }

  let newUser;

  // check if the user already verified
  if(! reset){
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
  }else{
  const user = await User.findOne({ where: { email } });
  if (user) {
      newUser = await user.update({
      verificationCode: verificationCode.toString(),
      verificationCodeTimestamp: new Date(),
    });
  } else {
    return next(new AppError("User does not exist", 400));
  } 
}  

  await sendVerificationEmail(
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

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exist.", 401)
    );
  }

  req.user = currentUser;
  next();
});
