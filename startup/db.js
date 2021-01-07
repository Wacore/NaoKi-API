const mongoose = require("mongoose");
const logger = require("../logger/logger");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost:27017/playground", {
      useNewUrlParser: true,
    })
    .then(() => logger.info("Connected to MongoDB..."))
    .catch((err) => logger.info("Could not connect to MongoDB...", err));
};
