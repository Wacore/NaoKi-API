const express = require("express");
const router = express.Router();
const Joi = require("joi");

let accounts = [
  { id: 1, name: "777" },
  { id: 2, name: "333" },
  { id: 3, name: "444" },
];

router.get("/", (req, res) => {
  res.send(accounts);
});

router.get("/:id", (req, res) => {
  const account = accounts.find((a) => a.id === parseInt(req.params.id));
  if (!account)
    res.status(404).send("The account with the given ID was not found....");
  res.send(account);
});

router.post("/", (req, res) => {
  const result = validateAccount(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const account = {
    id: accounts.length + 1,
    name: req.body.name,
  };
  accounts.push(account);
  res.send(account);
});

router.put("/:id", (req, res) => {
  const account = accounts.find((a) => a.id === parseInt(req.params.id));

  if (!account) {
    res.status(404).send("The account with the given id does not exsit.");
    return;
  }

  const result = validateAccount(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  account.name = req.body.name;

  res.send(account);
});

router.delete("/:id", (req, res) => {
  const account = accounts.find((a) => a.id === parseInt(req.params.id));

  if (!account) {
    res.status(404).send("The account with the given id does not exsit.");
    return;
  }
  const index = accounts.indexOf(account);
  const result = accounts.splice(index, 1);

  res.send(result);
});

module.exports = router;
