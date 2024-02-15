const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

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
    verificationCodeTimestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {}
);

module.exports = User;
