const logger = require("../logger/logger");

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    console.log("WE GOT AN UNCAUGHT EXPECTION");
    logger.log("error", ex.message, ex);
    // process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    console.log("WE GOT AN UNHANDLED REJECTION");
    logger.error(ex.message, ex);
    // process.exit(1);
  });
};
