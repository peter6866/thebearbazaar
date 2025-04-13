const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const MatchBids = sequelize.define(
  "MatchBids",
  {
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    matchBidTimeStamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {}
);

module.exports = MatchBids;
