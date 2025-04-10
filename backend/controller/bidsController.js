const User = require("../models/userModel");
const PhoneNum = require("../models/phoneNumModel");
const BuyBids = require("../models/buyBidsModel");
const SellBids = require("../models/sellBidsModel");
const MatchBids = require("../models/matchBidsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const transporter = require("../utils/emailTransporter");

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

const sendUnmatchedEmail = (email, unmatchedType) => {
  const mailOptions = {
    from: "The Bear Bazaar <no-reply@thebearbazaar.com>",
    to: email,
    subject: `No matched ${unmatchedType} has been found`,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>No Match Found</title>
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
            <div class="header"><h2>No Match Found</h2></div>
            
            <p>Sorry! No matched <strong>${unmatchedType}</strong> has been found for this round.</p>
            
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

const sendBuyHigherEmail = (email) => {
  const mailOptions = {
    from: "The Bear Bazaar <no-reply@thebearbazaar.com>",
    to: email,
    subject: `Current bid price may be too low`,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Big Price Too High</title>
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
            <div class="header"><h2>Your current bid price may be too low to be matched with a seller</h2></div>
            
            <p>If the next match day is soon, consider raising your maximum price to increase your chances of matching with a seller.</p>

            <p>You will only recieve this message once per bid.</p>
            
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

const sendSellLowerEmail = (email) => {
  const mailOptions = {
    from: "The Bear Bazaar <no-reply@thebearbazaar.com>",
    to: email,
    subject: `Current bid price may be too high`,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Big Price Too High</title>
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
            <div class="header"><h2>Your current bid price may be too high to be matched with a buyer</h2></div>
            
            <p>If the next match day is soon, consider lowering your minimum price to increase your chances of matching with a buyer.</p>

            <p>You will only recieve this message once per bid.</p>
            
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

exports.sellBid = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { price } = req.body;

  // check if the price is in the range of 1-500
  if (price < 1 || price > 500) {
    return next(new AppError("Price must be between 1 and 500", 400));
  }

  // check if the userid is in buybids table or sellbids table
  const user = await User.findByPk(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const buybid = await BuyBids.findOne({ where: { user_id: id } });
  const sellbid = await SellBids.findOne({ where: { user_id: id } });
  if (buybid || sellbid) {
    return next(new AppError("You have already placed a bid!", 400));
  }

  await SellBids.create({
    user_id: id,
    price,
  });

  sendPricingEmails();
  res.status(201).json({
    status: "success",
    message: "Successfully placed a sell bid",
  });
});

exports.buyBid = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { price } = req.body;

  // check if the price is in the range of 1-500
  if (price < 1 || price > 500) {
    return next(new AppError("Price must be between 1 and 500", 400));
  }

  // check if the userid is in buybids table or sellbids table
  const user = await User.findByPk(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const buybid = await BuyBids.findOne({ where: { user_id: id } });
  const sellbid = await SellBids.findOne({ where: { user_id: id } });
  if (buybid || sellbid) {
    return next(new AppError("You have already placed a bid!", 400));
  }

  sendPricingEmails();
  await BuyBids.create({
    user_id: id,
    price,
  });

  res.status(201).json({
    status: "success",
    message: "Successfully placed a buy bid",
  });
});

const sendPricingEmails = async () => {
  const activeBuyBids = await BuyBids.findAll({
    order: [
      ["price", "DESC"],
      ["bidTimeStamp", "DESC"],
    ],
  });
  const activeSellBids = await SellBids.findAll({
    order: [
      ["price", "ASC"],
      ["bidTimeStamp", "DESC"],
    ],
  });

  //if there arent any potential matches anyway, don't notify
  if (activeBuyBids.length < 1 || activeSellBids.length < 1) {
    return;
  }

  let bidIndex = 0;
  let noMatch = false;
  let matches = [];

  while (
    bidIndex < activeSellBids.length &&
    bidIndex < activeBuyBids.length &&
    !noMatch
  ) {
    const buyBid = activeBuyBids[bidIndex];
    const sellBid = activeSellBids[bidIndex];
    if (buyBid.price >= sellBid.price) {
      matches.push({ buyer_id: buyBid.user_id, seller_id: sellBid.user_id });
      bidIndex++;
    } else {
      noMatch = true;
    }
  }

  const matchedBuyerIds = matches.map((match) => match.buyer_id);
  const matchedSellerIds = matches.map((match) => match.seller_id);

  // get the unmatched buyer id
  const notifyBuyerIds = activeBuyBids
    .filter((bid) => !matchedBuyerIds.includes(bid.user_id))
    .filter((bid) => bid.notified === false)
    .map((bid) => bid.user_id);
  // get the users
  const notifyBuyers = await User.findAll({
    where: {
      id: notifyBuyerIds,
    },
  });

  // get the unmatched seller ids who haven't been notified yet
  const notifySellerIds = activeSellBids
    .filter((bid) => !matchedSellerIds.includes(bid.user_id))
    .filter((bid) => bid.notified === false)
    .map((bid) => bid.user_id);
  // get the users
  const notifySellers = await User.findAll({
    where: {
      id: notifySellerIds,
    },
  });

  // send emails to the unmatched buyers
  notifyBuyers.forEach(async (buyer) => {
    // check if the user's price notification is on
    if (buyer.sendPriceNotifications) {
      await sendBuyHigherEmail(buyer.email);
    }
  });

  // send emails to the unmatched sellers
  notifySellers.forEach(async (seller) => {
    // check if the user's price notification is on
    if (seller.sendPriceNotifications) {
      await sendSellLowerEmail(seller.email);
    }
  });

  // update all the bids to not get notified again
  await BuyBids.update(
    { notified: true },
    { where: { user_id: notifyBuyerIds } }
  );

  await SellBids.update(
    { notified: true },
    { where: { user_id: notifySellerIds } }
  );
};

exports.getBid = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  // check if the userid is in buybids table or sellbids table
  const user = await User.findByPk(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const buybid = await BuyBids.findOne({ where: { user_id: id } });
  const sellbid = await SellBids.findOne({ where: { user_id: id } });

  if (buybid) {
    res.status(200).json({
      status: "success",
      message: "Here is your bid",
      trans: "Buy",
      price: buybid.price,
      hasBid: true,
    });
  } else if (sellbid) {
    res.status(200).json({
      status: "success",
      message: "Here is your bid",
      trans: "Sell",
      price: sellbid.price,
      hasBid: true,
    });
  } else {
    res.status(200).json({
      status: "success",
      hasBid: false,
    });
  }
});

exports.cancelBid = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  // check if the userid is in buybids table or sellbids table
  const user = await User.findByPk(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const buybid = await BuyBids.destroy({ where: { user_id: id } });
  const sellbid = await SellBids.destroy({ where: { user_id: id } });
  if (buybid + sellbid === 0) {
    return next(new AppError("No bid found", 404));
  } else {
    res.status(201).json({
      status: "Success",
      message: "Successfully canceled bid",
    });
  }
});

// delete all the buybids and sellbids
exports.deleteAllBids = catchAsync(async (req, res, next) => {
  await BuyBids.destroy({ where: {} });
  await SellBids.destroy({ where: {} });

  res.status(201).json({
    status: "Success",
    message: "Successfully deleted all bids",
  });
});

exports.match = catchAsync(async (req, res, next) => {
  const matches = await generateMatches();
  res.status(201).json({
    status: "Success",
    message: "Successfully matched bids",
    matches,
  });
});

const generateMatches = async () => {
  const activeBuyBids = await BuyBids.findAll({
    order: [
      ["price", "DESC"],
      ["bidTimeStamp", "DESC"],
    ],
  });
  const activeSellBids = await SellBids.findAll({
    order: [
      ["price", "ASC"],
      ["bidTimeStamp", "DESC"],
    ],
  });

  let bidIndex = 0;
  let marketPrice = 0;
  let noMatch = false;
  let matches = [];

  while (
    bidIndex < activeSellBids.length &&
    bidIndex < activeBuyBids.length &&
    !noMatch
  ) {
    const buyBid = activeBuyBids[bidIndex];
    const sellBid = activeSellBids[bidIndex];
    if (buyBid.price >= sellBid.price) {
      matches.push({ buyer_id: buyBid.user_id, seller_id: sellBid.user_id });
      marketPrice = sellBid.price;
      bidIndex++;
    } else {
      noMatch = true;
    }
  }

  matches.forEach(async (match) => {
    const matchedBuyer = await User.findByPk(match.buyer_id);
    const matchedSeller = await User.findByPk(match.seller_id);
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
        marketPrice,
        "seller",
        matchedSellerEmail,
        sellerPhone,
        sellerPhonePrefered
      );
    }

    if (matchedSeller.sendMatchNotifications) {
      await sendMatchedEmail(
        matchedSellerEmail,
        marketPrice,
        "buyer",
        matchedBuyerEmail,
        buyerPhone,
        buyerPhonePrefered
      );
    }
  });

  matches = matches.map((match) => {
    return { ...match, price: marketPrice };
  });

  const matchedBuyerIds = matches.map((match) => match.buyer_id);
  const matchedSellerIds = matches.map((match) => match.seller_id);

  // get the unmatched buyer id
  const unmatchedBuyerIds = activeBuyBids
    .filter((bid) => !matchedBuyerIds.includes(bid.user_id))
    .map((bid) => bid.user_id);
  // get the users
  const unmatchedBuyers = await User.findAll({
    where: {
      id: unmatchedBuyerIds,
    },
  });

  // get the unmatched seller id
  const unmatchedSellerIds = activeSellBids
    .filter((bid) => !matchedSellerIds.includes(bid.user_id))
    .map((bid) => bid.user_id);
  // get the users
  const unmatchedSellers = await User.findAll({
    where: {
      id: unmatchedSellerIds,
    },
  });

  // send emails to the unmatched buyers
  unmatchedBuyers.forEach(async (buyer) => {
    // check if the user's matching notification is on
    if (buyer.sendMatchNotifications) {
      await sendUnmatchedEmail(buyer.email, "seller");
    }
  });

  // send emails to the unmatched sellers
  unmatchedSellers.forEach(async (seller) => {
    // check if the user's matching notification is on
    if (seller.sendMatchNotifications) {
      await sendUnmatchedEmail(seller.email, "buyer");
    }
  });

  await MatchBids.bulkCreate(matches);

  await BuyBids.destroy({ where: { user_id: matchedBuyerIds } });

  await SellBids.destroy({ where: { user_id: matchedSellerIds } });

  return matches;
};

exports.generateMatches = generateMatches;

exports.getMarketInfo = catchAsync(async (req, res, next) => {
  const activeBuyBids = await BuyBids.findAll({
    order: [
      ["price", "DESC"],
      ["bidTimeStamp", "DESC"],
    ],
  });
  const activeSellBids = await SellBids.findAll({
    order: [
      ["price", "ASC"],
      ["bidTimeStamp", "DESC"],
    ],
  });
  let bidIndex = 0;
  let sellPrice = 0;
  let buyPrice = 0;
  let lastMatchSellPrice = 0;
  let lastMatchBuyPrice = 0;
  let firstUnmatchedSellPrice = 0;
  let firstUnmatchedBuyPrice = 0;
  let noMatch = false;
  let matches = [];

  while (
    bidIndex < activeSellBids.length &&
    bidIndex < activeBuyBids.length &&
    !noMatch
  ) {
    const buyBid = activeBuyBids[bidIndex];
    const sellBid = activeSellBids[bidIndex];
    if (buyBid.price >= sellBid.price) {
      matches.push({ buyer_id: buyBid.user_id, seller_id: sellBid.user_id });
      lastMatchSellPrice = sellBid.price;
      lastMatchBuyPrice = buyBid.price;
      if (lastMatchSellPrice > 0) {
        lastMatchSellPrice -= 1;
      }
      if (lastMatchBuyPrice < 500) {
        lastMatchBuyPrice += 1;
      }
      bidIndex++;
    } else {
      noMatch = true;
    }
  }

  //get the first unmatched seller price
  if (bidIndex < activeSellBids.length) {
    firstUnmatchedSellPrice = activeSellBids[bidIndex].price;
  }

  //get the first unmatched buyer price
  if (bidIndex < activeBuyBids.length) {
    firstUnmatchedBuyPrice = activeBuyBids[bidIndex].price;
  }

  //To buy I need to be above the first unmatched seller or the last matched buyer
  if (lastMatchBuyPrice !== 0 && firstUnmatchedSellPrice !== 0) {
    buyPrice = Math.min(lastMatchBuyPrice, firstUnmatchedSellPrice);
  } else {
    buyPrice = Math.max(lastMatchBuyPrice, firstUnmatchedSellPrice);
  }

  //To sell I need to be below the first unmatched buyer or the last matched seller
  sellPrice = Math.max(lastMatchSellPrice, firstUnmatchedBuyPrice);

  res.status(200).json({
    status: "Success",
    info: {
      numBuyers: activeBuyBids.length,
      numSellers: activeSellBids.length,
      buyPrice: buyPrice,
      sellPrice: sellPrice,
    },
  });
});
