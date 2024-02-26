const { Sequelize } = require("sequelize");
// Retrieve environment variables
const PGUSER = process.env.PGUSER;
const PGPASSWORD = process.env.PGPASSWORD;
const PGDATABASE = process.env.PGDATABASE;
const PGHOST = process.env.PGHOST;
const PGPORT = 5432;

// connect to the database
const connectionString = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`;
const sequelize = new Sequelize(connectionString, {
  logging: false,
  retry: {
    max: 5,
    backoffBase: 1000,
  },
});

module.exports = sequelize;
