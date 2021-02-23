const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 35,
  },
  type: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
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

module.exports.Menu = Menu;
