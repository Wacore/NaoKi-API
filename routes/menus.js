const express = require("express");
const router = express();
const mongoose = require("mongoose");
const {
  validateMenu,
  getMenu,
  getSingleMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../funcs/menuFuncs");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "appetizer",
      "kids menu",
      "classic sushi roll",
      "special roll",
      "sushi entree",
      "nigiri & sashimi",
      "entree",
      "curry",
      "ramen",
      "special ramen",
      "cold ramen",
      "ramen dinner",
      "dessert",
      "drink",
    ],
  },
  price: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    minlength: 5,
    maxlength: 250,
    required: true,
  },
});

const Menu = mongoose.model("Menu", menuSchema);

router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find().sort("name");
    res.send(menu);
  } catch (error) {
    console.error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    res.send(item);
  } catch (error) {
    console.error(error);
    res.status(404).send("The dish with the given id does not exsit.");
    return;
  }
  // res.send(req.params.id);
});

router.post("/", async (req, res) => {
  const result = validateMenu(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  let menu = new Menu({
    name: req.body.name,
    type: req.body.type,
    price: req.body.price,
    desc: req.body.desc,
  });
  menu = await menu.save();
  res.send(menu);
});

router.put("/:id", async (req, res) => {
  try {
    // check with Mosh's video before testing this request
    const { error } = validateMenu(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let menu = await Menu.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        desc: req.body.desc,
      },
      { new: true }
    );

    if (!menu)
      return res.status(404).send("The menu with the given id was not found.");
    res.send(menu);
  } catch (error) {
    console.error(error);
    res.status(404).send("The dish with the given id does not exsit.");
    return;
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const menu = await Menu.deleteOne({ _id: req.params.id });
    if (!menu)
      return res.status(404).send("The menu with the given id was not found.");
    res.send(menu);
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .send("The dish with the given id does not exsit, please try again.");
    return;
  }
});

// createMenu(Menu, {
//   name: "Calamari Maui",
//   type: "appetizer",
//   price: 8,
//   desc: "Panko fried calamari, maui sauce on the side",
// });

// deleteMenu(Menu, "5fcfdc663f302c1a227f4d9a");

module.exports = router;
