const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express();
const { Menu } = require("../modules/menu");
const {
  validateMenu,
  getMenu,
  getSingleMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../funcs/menuFuncs");
const asyncMiddleware = require("../middleware/async");

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    // throw new Error("Could not get data");
    const menu = await Menu.find().sort("name");
    res.send(menu);
  })
);

router.get(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      const item = await Menu.findById(req.params.id);
      res.send(item);
    } catch (error) {
      console.error(error);
      res.status(404).send("The dish with the given id does not exsit.");
      return;
    }
    // res.send(req.params.id);
  })
);

router.post(
  "/",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
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
  })
);

router.put(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
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
        return res
          .status(404)
          .send("The menu with the given id was not found.");
      res.send(menu);
    } catch (error) {
      console.error(error);
      res.status(404).send("The dish with the given id does not exsit.");
      return;
    }
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    try {
      const menu = await Menu.deleteOne({ _id: req.params.id });
      if (!menu)
        return res
          .status(404)
          .send("The menu with the given id was not found.");
      res.send(menu);
    } catch (error) {
      console.error(error);
      res
        .status(404)
        .send("The dish with the given id does not exsit, please try again.");
      return;
    }
  })
);

// createMenu(Menu, {
//   name: "Calamari Maui",
//   type: "appetizer",
//   price: 8,
//   desc: "Panko fried calamari, maui sauce on the side",
// });

// deleteMenu(Menu, "5fcfdc663f302c1a227f4d9a");

module.exports = router;
