const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined!");
  process.exit(1);
} else {
  console.log("All set");
}

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening to port ${port}`));

module.exports = server;
