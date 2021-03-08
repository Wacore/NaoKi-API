const _ = require("lodash");
const express = require("express");
const router = express();
const { User } = require("../modules/user");
const { validateUser, validateExpoPushToken } = require("../funcs/userFuncs");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).send("No such user found.");
  res.send(user);
});

// For testing, delete [auth, admin];

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("This username has already used.");

  user = new User(_.pick(req.body, ["username", "password", "isAdmin"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res.send(_.pick(user, ["_id", "username"]));
});

router.put("/", async (req, res) => {
  const { error } = validateExpoPushToken(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findById(req.body.id);
  if (!user) return res.status(404).send("No such user found.");

  user.set({
    expoPushToken: req.body.token,
  });

  user.save();

  res.send(user);
});

module.exports = router;
