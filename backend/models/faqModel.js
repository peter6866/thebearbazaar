const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const FAQ = sequelize.define(
  "FAQ",
  {
    question: { type: DataTypes.STRING, allowNull: false },
    answer: { type: DataTypes.STRING, allowNull: false },
  },
  {}
);

module.exports = FAQ;
