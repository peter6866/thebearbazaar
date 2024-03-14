const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: true },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sendMatchNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    sendPriceNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    verificationCodeTimestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {}
);

User.prototype.isCodeExpired = function (timestamp) {
  return new Date() - new Date(timestamp) > 3600000;
};

User.prototype.correctCode = function (candidateCode, userCode) {
  return candidateCode === userCode;
};

User.prototype.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = User;
