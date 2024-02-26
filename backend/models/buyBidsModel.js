const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const BuyBids = sequelize.define(
  "BuyBids",
  {
    // user id is the foreign key of id in User model
    user_id: {
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
    // set default current time for bidTimeStamp
    bidTimeStamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {}
);

module.exports = BuyBids;
