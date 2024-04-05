const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const PhoneNum = sequelize.define("phoneNum", {
  phoneNum: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  isPrefered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = PhoneNum;
