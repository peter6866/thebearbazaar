const sequelize = require("../db/connection");
const { DataTypes } = require("sequelize");

const SellBids = sequelize.define(
  "SellBids",
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
    notified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // set default current time for bidTimeStamp
    bidTimeStamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  },
  {}
);

module.exports = SellBids;
