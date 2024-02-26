const sequelize = require("./db/connection");
const faqController = require("./controller/faqController");

const app = require("./app");

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database synced successfully.");
    faqController.initializeFAQs(faqController.faqData).then(() => {
      app.listen(3001, () => {
        console.log(`App running on port 3001`);
      });
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
