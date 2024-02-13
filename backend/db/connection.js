const { Sequelize } = require("sequelize");
// connect to the database
const sequelize = new Sequelize(
  "postgres://postgres_user:postgres_password@localhost:5432/mydb"
);

module.exports = sequelize;
