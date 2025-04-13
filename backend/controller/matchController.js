const User = require("../models/userModel");
const phoneNum = require("../models/phoneNumModel");
const MatchBids = require("../models/matchBidsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Sequelize = require("sequelize");
const moment = require("moment");
const { Op } = require("sequelize");
const transporter = require("../utils/emailTransporter");
const CanceledTrans = require("../models/canceledTransModel");
const redis = require("../db/redis");
const PhoneNum = require("../models/phoneNumModel");

exports.matchInfo = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  // find the user as a buyer or seller in matchbids table buy_id or sell_id
  const user = await User.findByPk(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const matchBuy = await MatchBids.findOne({
    where: { buyer_id: id, isValid: true },
  });
  const matchSell = await MatchBids.findOne({
    where: { seller_id: id, isValid: true },
  });
  if (!matchBuy && !matchSell) {
    res.status(200).json({
      status: "success",
    });

    return;
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
  await MatchBids.update({ isValid: false }, { where: {} });

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
    where: {
      isValid: true,
    },
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
  let price = 0;

  // get the last entry of the matchbids table
  const lastEntry = await MatchBids.findOne({
    order: [["createdAt", "DESC"]],
  });

  let enterRematching = true;

  // Cancel current match
  if (type === "Buyer") {
    let match = await MatchBids.findOne({
      where: { seller_id: id, isValid: true },
    });

    if (!match) {
      return next(new AppError("No match found", 404));
    }

    price = match.price;
    user = match.buyer_id;
    // check if match.createdAt is less than lastEntry.createdAt
    if (match.createdAt < lastEntry.createdAt) {
      enterRematching = false;
    }

    await MatchBids.update({ isValid: false }, { where: { seller_id: id } });
  } else {
    let match = await MatchBids.findOne({
      where: { buyer_id: id, isValid: true },
    });

    if (!match) {
      return next(new AppError("No match found", 404));
    }

    price = match.price;
    user = match.seller_id;
    // check if match.createdAt is less than lastEntry.createdAt
    if (match.createdAt < lastEntry.createdAt) {
      enterRematching = false;
    }

    await MatchBids.update({ isValid: false }, { where: { buyer_id: id } });
  }

  // notify both users
  const user1 = await User.findByPk(id);
  const user2 = await User.findByPk(user);

  const activeType = type === "Buyer" ? "Seller" : "Buyer";

  if (user1.sendMatchNotifications) {
    sendCancelEmail(user1.email);
  }
  if (user2.sendMatchNotifications) {
    if (enterRematching) {
      sendCancelEmail(user2.email, activeType);
    } else {
      sendCancelEmail(user2.email);
    }
  }

  CanceledTrans.create({ user_id: id });

  if (enterRematching) {
    // passive queue rematching
    const passiveType = type === "Buyer" ? "seller" : "buyer";
    const oppositeQueue = `passive:${passiveType}`;
    const thisQueue = `passive:${type.toLowerCase()}`;

    const now = moment().utc().unix();

    const [matchCandidate] = await redis.zrange(oppositeQueue, 0, 0); // FIFO

    if (matchCandidate) {
      // Re-match with passive user
      await redis.zrem(oppositeQueue, matchCandidate);

      const matchedBid = {
        buyer_id: type === "Buyer" ? user : matchCandidate,
        seller_id: type === "Seller" ? user : matchCandidate,
        price: price,
        createdAt: lastEntry.createdAt,
      };

      await MatchBids.create(matchedBid);

      const matchedBuyer = await User.findByPk(matchedBid.buyer_id);
      const matchedSeller = await User.findByPk(matchedBid.seller_id);
      const matchedBuyerEmail = matchedBuyer.email;
      const matchedSellerEmail = matchedSeller.email;

      // check if buyer prefered phone number
      const buyerPhoneNum = await PhoneNum.findOne({
        where: { userId: matchedBuyer.id },
      });

      // check if seller prefered phone number
      const sellerPhoneNum = await PhoneNum.findOne({
        where: { userId: matchedSeller.id },
      });

      let buyerPhone = buyerPhoneNum ? buyerPhoneNum.phoneNum : null;
      let sellerPhone = sellerPhoneNum ? sellerPhoneNum.phoneNum : null;
      let buyerPhonePrefered = buyerPhoneNum ? buyerPhoneNum.isPrefered : false;
      let sellerPhonePrefered = sellerPhoneNum
        ? sellerPhoneNum.isPrefered
        : false;

      if (matchedBuyer.sendMatchNotifications) {
        await sendMatchedEmail(
          matchedBuyerEmail,
          price,
          "seller",
          matchedSellerEmail,
          sellerPhone,
          sellerPhonePrefered
        );
      }

      if (matchedSeller.sendMatchNotifications) {
        await sendMatchedEmail(
          matchedSellerEmail,
          price,
          "buyer",
          matchedBuyerEmail,
          buyerPhone,
          buyerPhonePrefered
        );
      }
    } else {
      // add passive user to the queue
      await redis.zadd(thisQueue, now, user);
    }
  }

  res.status(200).json({
    status: "success",
    message: "Transaction canceled",
  });
});

const sendCancelEmail = (email, activeUserType = null) => {
  const passiveMessage = activeUserType
    ? `
      <p>
        The <strong>${activeUserType}</strong> you were matched with has canceled the transaction. 
        You&#39ve now been placed in a priority queue. Once another <strong>${activeUserType}</strong> becomes available, 
        you&#39ll be automatically re-matched.
      </p>
    `
    : "";

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
              background-color: #BA0C2F;
              color: #ffffff;
              padding: 10px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 14px;
              color: #999;
            }
            a {
              color: #BA0C2F;
            }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <h1>The Bear Bazaar</h1>
              </div>
              <h3>Your match has been canceled.</h3>
              ${passiveMessage}
              <p>
                If you have any questions or concerns, feel free to contact our support team.
              </p>
              <div class="footer">
                  Thank you for using our service!<br>
                  <a href="mailto:hjiayu@wustl.edu">Contact Support</a>
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

const sendMatchedEmail = (
  email,
  price,
  matchedType,
  matchedEmail,
  phoneNum,
  phoneIsPrefered
) => {
  const capitalizedMatchedType = `${matchedType
    .charAt(0)
    .toUpperCase()}${matchedType.slice(1)}`;
  const mailOptions = {
    from: "The Bear Bazaar <no-reply@thebearbazaar.com>",
    to: email,
    subject: `A matched ${matchedType} has been found`,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Match Found</title>
        <style>
            body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 20px;
            }
            .email-container {
                max-width: 600px;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                padding: 20px;
                margin: auto;
            }
            .header {
              background-color: #BA0C2F; /* Main red color */
              color: #ffffff;
              padding: 10px;
              text-align: center;
              border-radius: 5px 5px 0 0;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #999;
        }
        a {
            color: #BA0C2F; /* Main red color for links */
        }
        
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header"><h2>Match Confirmation</h2></div>
            
            <p>Congratulations! You have been matched with a <strong>${matchedType}</strong> at a price of <strong>$${price}</strong>.</p>
            <p>${capitalizedMatchedType}'s email: ${matchedEmail}</p>
            ${
              phoneIsPrefered
                ? `<p>${capitalizedMatchedType}'s phone number: ${phoneNum}</p>`
                : ""
            } 
            ${
              phoneIsPrefered
                ? `<p>The ${matchedType} prefers to use phone number.</p>`
                : ""
            }
            
            <div class="footer">
                Thank you for using our service!<br>
                <a href="mailto:hjiayu@wustl.edu" style="color: #005a9c;">Contact Support</a>
            </div>
        </div>
    </body>
    </html>
    `,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
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
    where: {
      isValid: true,
    },
  });

  // given the user_id in the matches, find the email of the user
  // and add it to the matches object
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const buser = await User.findByPk(match.buyer_id);
    const suser = await User.findByPk(match.seller_id);
    matches[i] = {
      ...matches[i].dataValues,
      buyerid: buser.email,
      sellerid: suser.email,
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
