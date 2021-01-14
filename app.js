const express = require("express");
const app = express();
const config = require("config");
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
let connections = [];

server.on("connection", (connection) => {
  connections.push(connection);
  connection.on(
    "close",
    () => (connections = connections.filter((curr) => curr !== connection))
  );
});
server.on("close", () => {
  connections.forEach((curr) => curr.end());
  setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
});
module.exports = server;
