const cron = require("node-cron");
const bidsController = require("../controller/bidsController");
const settingsController = require("../controller/settingsController");
const redis = require("../db/redis");

let cronJob;
let cleanupJob;

const convertSecondsToSchedule = (utcSeconds) => {
  const day = Math.floor(utcSeconds / 86400);
  utcSeconds = utcSeconds % 86400;
  const hour = Math.floor(utcSeconds / 3600);
  utcSeconds = utcSeconds % 3600;
  const minute = Math.floor(utcSeconds / 60);
  utcSeconds = utcSeconds % 60;
  const second = utcSeconds;
  return `${second} ${minute} ${hour} * * ${day} `;
};

const cleanupPassiveQueue = async () => {
  await redis.del("passive:buyer", "passive:seller");
};

const scheduleJob = (sec) => {
  if (cronJob) {
    cronJob.stop();
  }

  cronJob = cron.schedule(
    convertSecondsToSchedule(sec),
    () => {
      const matches = bidsController.generateMatches();
      console.log("RAN MATCHES " + sec);
    },
    {
      timezone: "UTC",
    }
  );
};

const scheduleCleanupJob = () => {
  if (cleanupJob) {
    cleanupJob.stop();
  }

  cleanupJob = cron.schedule(
    "0 0 17 * * 6",
    () => {
      cleanupPassiveQueue();
    },
    {
      timezone: "UTC",
    }
  );
};

const initializeJob = async () => {
  const sec = await settingsController.fetchScheduledMatchTime();
  scheduleJob(sec);
  scheduleCleanupJob();
};

module.exports = { scheduleJob, scheduleCleanupJob, initializeJob };
