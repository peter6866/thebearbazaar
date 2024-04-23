const User = require("../models/userModel");
const phoneNum = require("../models/phoneNumModel");
const MatchBids = require("../models/matchBidsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Sequelize = require("sequelize");
const moment = require("moment-timezone");
const { Op } = require("sequelize");
const transporter = require("../utils/emailTransporter");
const CanceledTrans = require("../models/canceledTransModel");

exports.matchInfo = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  // find the user as a buyer or seller in matchbids table buy_id or sell_id
  const user = await User.findByPk(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const matchBuy = await MatchBids.findOne({ where: { buyer_id: id } });
  const matchSell = await MatchBids.findOne({ where: { seller_id: id } });
  if (!matchBuy && !matchSell) {
    return next(new AppError("No match found", 404));
  }

  let matchDetails;
  if (matchBuy) {
    const seller = await User.findByPk(matchBuy.seller_id);
    // check if the seller has a phone number
    const sellerPhone = await phoneNum.findOne({
      where: { userId: seller.id },
    });

    // get the phoneNumer if is preferred
    let sellerPhoneNum = "";
    if (sellerPhone && sellerPhone.isPrefered) {
      sellerPhoneNum = sellerPhone.phoneNum;
    }

    matchDetails = {
      matchedType: "Seller",
      email: seller.email,
      phoneNum: sellerPhoneNum,
      price: matchBuy.price,
    };
  } else {
    const buyer = await User.findByPk(matchSell.buyer_id);

    // check if the buyer has a phone number
    const buyerPhone = await phoneNum.findOne({
      where: { userId: buyer.id },
    });

    // get the phoneNumer if is preferred
    let buyerPhoneNum = "";
    if (buyerPhone && buyerPhone.isPrefered) {
      buyerPhoneNum = buyerPhone.phoneNum;
    }

    matchDetails = {
      matchedType: "Buyer",
      email: buyer.email,
      phoneNum: buyerPhoneNum,
      price: matchSell.price,
    };
  }

  res.status(200).json({
    status: "success",
    data: {
      matchDetails,
    },
  });
});

// delete all match bids
exports.deleteAllMatchBids = catchAsync(async (req, res, next) => {
  await MatchBids.destroy({ where: {} });

  res.status(204).json({
    status: "success",
    message: "All match bids deleted",
  });
});

exports.priceHistory = catchAsync(async (req, res, next) => {
  let matches = await MatchBids.findAll({
    attributes: [
      "createdAt",
      [Sequelize.fn("MIN", Sequelize.col("price")), "price"],
    ],
    group: ["createdAt"],
    order: [["createdAt", "ASC"]],
  });

  matches = matches.map((match) => {
    return {
      createdAt: match.dataValues.createdAt,
      price: match.dataValues.price,
    };
  });

  res.status(200).json({
    status: "success",
    matchHistory: matches,
  });
});

exports.cancelTrans = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { type } = req.body;
  let user = "";

  if (type === "Buyer") {
    let matches = await MatchBids.findOne({
      where: { seller_id: id },
    });
    user = matches.buyer_id;
    await MatchBids.destroy({
      where: { seller_id: id },
    });
  } else {
    let matches = await MatchBids.findOne({
      where: { buyer_id: id },
    });
    user = matches.seller_id;
    await MatchBids.destroy({
      where: { buyer_id: id },
    });
  }

  const user1 = await User.findByPk(id);
  const user2 = await User.findByPk(user);
  if (user1.sendMatchNotifications) {
    sendCancelEmail(user1.email);
  }
  if (user2.sendMatchNotifications) {
    sendCancelEmail(user2.email);
  }

  CanceledTrans.create({ user_id: id });

  res.status(200).json({
    status: "success",
    message: "Transaction canceled",
  });
});

const sendCancelEmail = (email) => {
  const mailOptions = {
    from: "The Bear Bazaar <no-reply@thebearbazaar.com>",
    to: email,
    subject: "Your match was canceled",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Match Cancel</title>
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
                  <h1> The Bear Bazaar</h1>
              </div>
              <h3>Your match has been canceled.</h3>
              <p>Contact support if you have any concerns.</p>
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

exports.getMatch = catchAsync(async (req, res, next) => {
  // find all matches in time descending order
  const matches = await MatchBids.findAll({
    order: [["createdAt", "DESC"]],
  });

  // given the user_id in the matches, find the email of the user
  // and add it to the matches object
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const buser = await User.findByPk(match.buyer_id);
    const suser = await User.findByPk(match.seller_id);
    let datey = new Date(match.createdAt).toDateString;
    matches[i] = {
      ...matches[i].dataValues,
      buyerid: buser.email,
      sellerid: suser.email,
      adjTime: datey.toDateString(),
    };
  }

  res.status(200).json({
    status: "success",
    matches,
  });
});

exports.getCancels = catchAsync(async (req, res, next) => {
  const allCancels = await CanceledTrans.findAll();

  // Extracting all unique user IDs from the canceled transactions
  const userIds = allCancels.map((cancel) => cancel.user_id);
  const uniqueUserIds = [...new Set(userIds)]; // Getting unique user IDs

  // Fetching user emails for each unique user ID
  const userIdToEmailMap = {};
  await Promise.all(
    uniqueUserIds.map(async (userId) => {
      const user = await User.findByPk(userId);
      if (user) {
        userIdToEmailMap[userId] = user.email;
      }
    })
  );

  // Generating response containing only email and createdAt
  const cancelsWithEmail = allCancels.map((cancel) => {
    return {
      email: userIdToEmailMap[cancel.user_id], // Add email based on user_id
      createdAt: cancel.createdAt,
    };
  });

  res.status(200).json({
    status: "success",
    cancels: cancelsWithEmail,
  });
});
