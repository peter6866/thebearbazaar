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

module.exports = transporter;
