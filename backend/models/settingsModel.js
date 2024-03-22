const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Settings = sequelize.define(
  "Settings",
  {
    matchTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 61200,
    },
  },
  {}
);

module.exports = Settings;
