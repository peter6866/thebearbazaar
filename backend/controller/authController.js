const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// TODO: change to sendgrid
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "peter.huang440@gmail.com",
    pass: "iids ccmj wiuq cvdk",
  },
});

// helper function to send verification email
const sendVerificationEmail = (email, verificationCode) => {
  const mailOptions = {
    from: "bearbazaar verification <peter.huang440@gmail.com>",
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
exports.getCode = async (req, res) => {
  const { email } = req.body;
  try {
    // check if the user already verified
    const user = await User.findOne({ where: { email } });
    if (user && user.isVerified) {
      return res.status(400).json({ message: "User already registered" });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // create a new user
    const newUser = await User.create({
      email,
      verificationCode: verificationCode.toString(),
      verificationCodeTimestamp: new Date(),
    });

    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// handler for signing up
exports.signUpVerify = async (req, res) => {
  const { email, verificationCode, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // check if the code is expired (e.g., 1 hour limit)
    const isCodeExpired =
      new Date() - new Date(user.verificationCodeTimestamp) > 3600000;
    if (isCodeExpired) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // check if the code is correct
    if (user.verificationCode === verificationCode) {
      await user.update({
        password: passwordHash,
        isVerified: true,
        verificationCode: null,
        verificationCodeTimestamp: null,
      });
      res.status(201).json({
        status: "success",
        message: "Email verified successfully",
        data: {
          user,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid verification code" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// handler for resending the verification code
exports.resendCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
