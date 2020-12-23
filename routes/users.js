const _ = require("lodash");
const express = require("express");
const router = express();
const mongoose = require("mongoose");
const { User } = require("../modules/user");
const { validateUser } = require("../funcs/userFuncs");

router.get("/", async (req, res) => {
  const users = await User.find().select("username");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.username });
  if (user) return res.status(400).send("This username has already used.");

  user = new User(_.pick(req.body, ["username", "password"]));
  await user.save();

  res.send(_.pick(user, ["_id", "username"]));
});

module.exports = router;
