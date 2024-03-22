const sequelize = require("./db/connection");
const app = require("./app");
const { initializeJob } = require("./utils/scheduler");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully.");
    initializeJob();
    app.listen(3001, () => {
      console.log(`App running on port 3001`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
