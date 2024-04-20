const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const CanceledTrans = sequelize.define(
  "CanceledTrans",
  {
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

module.exports = CanceledTrans;
