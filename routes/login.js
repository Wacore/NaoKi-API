const express = require("express");
const { route } = require("./home");
const router = express.Router();

router.get("/api/login", (req, res) => {
  res.send("Login Route");
});

module.exports = router;
