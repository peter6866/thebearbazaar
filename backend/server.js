const sequelize = require("./db/connection");
const app = require("./app");
const { initializeJob } = require("./utils/scheduler");

const PORT = process.env.PORT || 3001;
const HOST = "0.0.0.0";

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully.");
    initializeJob();
    app.listen(PORT, HOST, () => {
      console.log(`App running on ${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
