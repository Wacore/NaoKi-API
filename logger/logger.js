const { createLogger, transports, format } = require("winston");
require("winston-mongodb");

const logger = createLogger({
  transports: [
    new transports.File({
      filename: "logfile.log",
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
    // new transports.MongoDB({
    //   level: "error",
    //   db: "mongodb://localhost:27017/playground",
    //   format: format.combine(format.timestamp(), format.json()),
    // }),
    new transports.File({
      filename: "infofile.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = logger;

// winston.add(winston.transports.File, { filename: "logfile.log" });
// winston.add(winston.transports.MongoDB, {
//   db: '"mongodb://localhost:27017/playground',
//   level: "error",
// });
