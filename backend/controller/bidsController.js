const User = require("../models/userModel");
const BuyBids = require("../models/buyBidsModel");
const SellBids = require("../models/sellBidsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.sellBid = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { price } = req.body;

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

  res.status(201).json({
    status: "success",
    message: "You have successfully placed a sell bid",
  });
});

exports.buyBid = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { price } = req.body;

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

  await BuyBids.create({
    user_id: id,
    price,
  });

  res.status(201).json({
    status: "success",
    message: "You have successfully placed a buy bid",
  });
});

exports.getBid = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  // check if the userid is in buybids table or sellbids table
  const user = await User.findByPk(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const buybid = await BuyBids.findOne({ where: { user_id: id } });
  const sellbid = await SellBids.findOne({ where: { user_id: id } });


  let transType = null;
  if (buybid) {
    res.status(201).json({
      status: "success",
      message: "Here is your bid",
      trans: "buy",
      price: buybid.price
  
    });
  }else if(sellbid){
    res.status(201).json({
      status: "success",
      message: "Here is your bid",
      trans: "sell",
      price: sellbid.price
  
    });
  }else{
    res.status(400).json({
      status: "No bid",
      message: "No bid placed"
    });
  }
});

exports.cancelBid =  catchAsync(async (req, res, next) => {
  const { id } = req.user;

  // check if the userid is in buybids table or sellbids table
  const user = await User.findByPk(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const buybid = await BuyBids.destroy({ where: { user_id: id } });
  const sellbid = await SellBids.destroy({ where: { user_id: id } });
  if(buybid +sellbid == 0){
    res.status(400).json({
      status: "Failure",
      messsage: "No bid to delete"
    })
  }else{
    res.status(201).json({
      status: "Success",
      message: "Successfully canceled bid"
    });
  }
  
});