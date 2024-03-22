const Settings = require("../models/settingsModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { scheduleJob } = require("../utils/scheduler");

exports.getScheduledMatchTime = catchAsync(async (req, res, next) => {
  const matchTime = await fetchScheduledMatchTime();
  res.status(200).json({
    status: "success",
    matchTime: matchTime,
  });
});

exports.setScheduledMatchTime = catchAsync(async (req, res, next) => {
  const { matchTime } = req.body;
  if (!matchTime || matchTime < 0 || matchTime >= 604800) {
    return next(new AppError("Invalid time of the week", 400));
  }
  await Settings.upsert({ id: 1, matchTime: matchTime });
  scheduleJob(matchTime);
  res.status(200).json({
    status: "success",
    message: "Scheduled match time updated successfully",
  });
});

const fetchScheduledMatchTime = async () => {
  try {
    const settings = await Settings.findOne();
    if (settings) {
      return settings.matchTime;
    } else {
      return 61200;
    }
  } catch {
    return 61200;
  }
};

exports.fetchScheduledMatchTime = fetchScheduledMatchTime;
