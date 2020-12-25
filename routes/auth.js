const _ = require("lodash");
const express = require("express");
const router = express();
const { User } = require("../modules/user");
const { validateUser } = require("../funcs/userFuncs");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (!user)
    return res
      .status(400)
      .send("Invalid username or password. Please check it again.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .send("Invalid username or password. Please check it again.");
  const token = user.generateAuthToken();

  res.send(token);
});

module.exports = router;
