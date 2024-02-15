const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const sequelize = require("./db/connection");

const app = require("./app");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully.");
    app.listen(3001, () => {
      console.log(`App running on port 3001`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
