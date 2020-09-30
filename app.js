const express = require("express");
const app = express();
const Joi = require("joi");
const config = require("config");
const accounts = require("./routes/accounts");
const home = require("./routes/home");

app.use(express.json());
app.use("/api/accounts", accounts);
app.use("/", home);

app.set("view engine", "pug");

app.get("/api/login", (req, res) => {
  res.send("Login Route");
});

function validateAccount(account) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(account, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));
