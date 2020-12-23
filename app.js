const express = require("express");
const app = express();
const config = require("config");
const home = require("./routes/home");
const menu = require("./routes/menus");
const customers = require("./routes/customers");
const users = require("./routes/users");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/playground", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use("/api/menu", menu);
app.use("/api/customer", customers);
app.use("/api/user", users);
app.use("/", home);

app.set("view engine", "pug");

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));
