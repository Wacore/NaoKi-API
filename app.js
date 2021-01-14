const express = require("express");
const app = express();
const config = require("config");
const home = require("./routes/home");
const menu = require("./routes/menus");
const customers = require("./routes/customers");
const users = require("./routes/users");
const auth = require("./routes/auth");
const orders = require("./routes/orders");
const mongoose = require("mongoose");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined!");
  process.exit(1);
} else {
  console.log("All set");
}

const db = config.get("db");

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log(`Connected to MongoDB ${db}...`))
  .catch((err) => console.error(`Could not connect to MongoDB ${db}...`));

app.use(express.json());
app.use("/api/menu", menu);
app.use("/api/customer", customers);
app.use("/api/user", users);
app.use("/api/auth", auth);
app.use("/api/order", orders);
app.use("/", home);

app.set("view engine", "pug");

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening to port ${port}`));

module.exports = server;
