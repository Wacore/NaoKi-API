const mongoose = require("mongoose");
const logger = require("../logger/logger");
const config = require("config");
module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, {
      useNewUrlParser: true,
    })
    .then(() => logger.info(`Connected to MongoDB ${db}...`))
    .catch((err) => logger.info(`Could not connect to MongoDB ${db}...`, err));
};
