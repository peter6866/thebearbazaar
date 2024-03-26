const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Feedback = sequelize.define(
  "Feedbacks",
  {
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {}
);

module.exports = Feedback;
