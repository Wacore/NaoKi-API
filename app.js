const express = require("express");
const app = express();
const config = require("config");
const { Customer } = require("./modules/customer");
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined!");
  process.exit(1);
} else {
  console.log("All set");
}

const port = process.env.PORT || 3000;
const server = app.listen(port, "0.0.0.0", () =>
  console.log(`Listening to port ${port}`)
);

// async function createCustomer() {
//   const customer = new Customer({
//     name: "James",
//     phoneNum: "3213214321",
//   });

//   const res = await customer.save();
//   console.log(res);
// }

// createCustomer();

async function getCustomer() {
  const res = await Customer.find();
  console.log(res);
}

getCustomer();

module.exports = server;

// mongodb://localhost:27017/playground
