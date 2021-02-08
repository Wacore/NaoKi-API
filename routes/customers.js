const auth = require("../middleware/auth");
const express = require("express");
const router = express();
const { Customer } = require("../modules/customer");
const {
  validateCustomer,
  validatecustomerCredit,
} = require("../funcs/customerFuncs");

router.get("/", async (req, res) => {
  const customer = await Customer.find();
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch (error) {
    console.error(error);
    res.status(404).send("The customer with the given id was not found.");
    return;
  }
});

router.post("/", auth, async (req, res) => {
  const result = validateCustomer(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  let customer = new Customer({
    name: req.body.name,
    phoneNum: req.body.phoneNum,
  });

  customer = await customer.save();
  res.send(customer);
});

router.put("/:phoneNum", auth, async (req, res) => {
  try {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.updateOne(
      { phoneNum: req.params.phoneNum },
      {
        $set: {
          name: req.body.name,
          phoneNum: req.body.phoneNum,
          isGold: req.body.isGold,
          credit: req.body.credit,
        },
      }
    );
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given id was not found.");
    res.send(customer);
  } catch (error) {
    console.error(error);
    res.status(400).send("Something went wrong. Please try again.");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.deleteOne({ _id: req.params.id });
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given id was not found.");
    res.send(customer);
  } catch (error) {}
});

router.get("/:id/credits", async (req, res) => {
  try {
    const customer = await Customer.find({ _id: req.params.id }).select({
      name: 1,
      credit: 1,
    });
    res.send(customer);
  } catch (error) {
    console.error(error);
    res.status(404).send("The customer with the given id was not found.");
    return;
  }
});

router.put("/:id/credits/:opt", auth, async (req, res) => {
  try {
    const { error } = validatecustomerCredit(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given id was not found.");

    // customer.set({ credit: req.body.credit });
    let credit = 0;
    if (req.params.opt == "add") {
      credit = customer.credit + parseInt(req.body.credit);
    } else if (req.params.opt == "minus") {
      if (customer.credit - parseInt(req.body.credit) <= 0) {
        credit = 0;
      } else {
        credit = customer.credit - parseInt(req.body.credit);
      }
    } else {
      res.status(400).send("Invalid operation!");
    }
    customer.set({ credit: credit });
    customer.save();

    res.send(customer);
  } catch (error) {
    console.error(error);
    res.status(404).send("The customer with the given id was not found.");
    return;
  }
});

router.get("/:id/membership", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select({
      name: 1,
      isGold: 1,
    });
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given id was not found.");

    res.send(customer);
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .send("Something went wrong. Please try again later.");
  }
});

router.put("/:id/membership/:opt", auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given id was not found.");

    let membership;
    if (req.params.opt == "upgrade") {
      if (customer.isGold == false) {
        membership = true;
      } else {
        console.log("The customer is already a member.");
        return res.status(400).send("The customer is already a member.");
      }
    } else if (req.params.opt == "upgrade") {
      if (customer.isGold == true) {
        membership = false;
      } else {
        console.log("The customer is already not a member.");
        return res.status(400).send("The customer is not already a member.");
      }
    }

    customer.set({ isGold: membership });
    customer.save();

    res.send(customer);
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .send("Something went wrong. Please try again later.");
  }
});

module.exports = router;
