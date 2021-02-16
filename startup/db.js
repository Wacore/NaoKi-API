const mongoose = require("mongoose");
const logger = require("../logger/logger");
const config = require("config");

module.exports = function () {
  const db = config.get("db");

  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((result) => logger.info(`Connected to MongoDB ${db}...`))
    .catch((err) => logger.info(`Could not connect to MongoDB ${db}...`, err));
};
