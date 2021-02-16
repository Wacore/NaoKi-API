const mongoose = require("mongoose");
const logger = require("../logger/logger");
const config = require("config");

module.exports = function () {
  let user = config.get("user");
  let pwd = config.get("password");
  let dbname = config.get("dbname");

  // let db = config
  //   .get("db")
  //   .replace("<username>", user)
  //   .replace("<password>", pwd)
  //   .replace("<dbname>", dbname);

  let db =
    "mongodb+srv://Wacore:Mario@gsap27@naokijc.udhez.mongodb.net/NaokiJC?retryWrites=true&w=majority";

  console.log(db);

  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((result) => logger.info(`Connected to MongoDB ${db}...`))
    .catch((err) => logger.info(`Could not connect to MongoDB ${db}...`, err));
};
