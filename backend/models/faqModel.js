const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const FAQs = sequelize.define(
  "FAQs",
  {
    question: { type: DataTypes.STRING, allowNull: false },
    answer: { type: DataTypes.STRING, allowNull: false },
  },
  {}
);

module.exports = FAQs;
