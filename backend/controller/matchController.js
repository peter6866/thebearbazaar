const User = require("../models/userModel");
const phoneNum = require("../models/phoneNumModel");
const MatchBids = require("../models/matchBidsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Sequelize = require("sequelize");
const moment = require("moment");
const emailService = require("../services/emailService");
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
    emailService.sendMatchCanceledEmail(user1.email);
  }
  if (user2.sendMatchNotifications) {
    if (enterRematching) {
      emailService.sendMatchCanceledEmail(user2.email, activeType);
    } else {
      emailService.sendMatchCanceledEmail(user2.email);
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
        await emailService.sendMatchFoundEmail(
          matchedBuyerEmail,
          price,
          "seller",
          matchedSellerEmail,
          sellerPhone,
          sellerPhonePrefered
        );
      }

      if (matchedSeller.sendMatchNotifications) {
        await emailService.sendMatchFoundEmail(
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
