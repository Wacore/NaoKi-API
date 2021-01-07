// const winston = require("winston");
const logger = require("../logger/logger");

module.exports = function (err, req, res, next) {
  // Log the exception
  // winston.error(err.message, err);
  logger.log("error", err.message, err);

  res.status(500).send("Something went wrong.");
};
