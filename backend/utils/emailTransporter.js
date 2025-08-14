const nodemailer = require("nodemailer");
const aws = require("@aws-sdk/client-ses");

// AWS SES Credentials
const ses = new aws.SES({
  apiVersion: "2012-10-17",
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

let transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

module.exports = transporter;
