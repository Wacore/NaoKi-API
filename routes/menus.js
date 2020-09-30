const express = require("express");
const router = express();

router.get("/api/menus", (req, res) => {
  res.send("menus router");
});

module.exports = router;
