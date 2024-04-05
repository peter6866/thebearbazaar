const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const BanUsers = sequelize.define(
  "BanUsers",
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

module.exports = BanUsers;
