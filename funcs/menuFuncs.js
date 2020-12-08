const Joi = require("joi");
module.exports = {
  validateMenu: function validateMenu(menu) {
    const schema = {
      name: Joi.string().min(5).max(50).required(),
      type: Joi.string().min(3).max(50).required(),
      price: Joi.number().required(),
      desc: Joi.string().min(5).max(250).required(),
    };

    return Joi.validate(menu, schema);
  },

  getMenu: async function getMenu(menuClass) {
    const menu = await menuClass.find().sort("name");
    console.log(menu);
  },

  getSingleMenu: async function getSingleMenu(menuClass, id) {
    const menu = await menuClass.findById(id);
    if (!menu) {
      console.log("No result");
      return;
    }
    console.log(menu);
  },

  createMenu: async function createMenu(menuClass, menuObject) {
    const newMenu = new menuClass(menuObject);

    try {
      const result = await newMenu.save();
      console.log(result);
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
      }
    }
  },

  updateMenu: async function updateMenu(menuClass, id, updateInfo) {
    try {
      const result = await menuClass.update({ _id: id }, { $set: updateInfo });
      console.log(result);
    } catch (ex) {
      console.error("Errors: ", ex);
    }
  },

  deleteMenu: async function deleteMenu(menuClass, id) {
    const result = await menuClass.deleteOne({ _id: id });
    console.log(result);
  },
};
