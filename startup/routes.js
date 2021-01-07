const express = require("express");
const menu = require("../routes/menus");
const customers = require("../routes/customers");
const users = require("../routes/users");
const auth = require("../routes/auth");
const orders = require("../routes/orders");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/menu", menu);
  app.use("/api/customer", customers);
  app.use("/api/user", users);
  app.use("/api/auth", auth);
  app.use("/api/order", orders);
  app.use(error);
};
