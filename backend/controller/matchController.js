const User = require("../models/userModel");
const BuyBids = require("../models/buyBidsModel");
const SellBids = require("../models/sellBidsModel");
const MatchBids = require("../models/matchBidsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Sequelize = require("sequelize");

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
    matchDetails = {
      matchedType: "Seller",
      email: seller.email,
      price: matchBuy.price,
    };
  } else {
    const buyer = await User.findByPk(matchSell.buyer_id);
    matchDetails = {
      matchedType: "Buyer",
      email: buyer.email,
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

exports.priceHistory = catchAsync(async (req, res, next) => {
  let matches = MatchBids.findAll({
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("matchBidTimeStamp")), "date"],
      [Sequelize.fn("MIN", Sequelize.col("price")), "price"],
    ],
    group: [Sequelize.fn("DATE", Sequelize.col("matchBidTimeStamp"))],
  });

  console.log(matches);

  res.status(200).json({
    status: "success",
    matchHistory: matches,

  });
});
