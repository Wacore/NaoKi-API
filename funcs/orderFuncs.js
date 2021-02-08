const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

function validateOrderInfo(order) {
  const schema = {
    type: Joi.string().max(8).min(4).required(),
    peoNum: Joi.number().max(50).min(1),
    tableNum: Joi.number().max(14).min(1),
    pickupTime: Joi.number().max(120).min(10),
  };
  return Joi.validate(order, schema);
}

function validateOrderList(list) {
  const itemSchema = {
    menu: Joi.objectId().required(),
    amount: Joi.number().min(1).max(50).required(),
    desc: Joi.string().max(255),
    is_sent: Joi.boolean(),
  };

  const listSchema = Joi.array().items(itemSchema);
  return Joi.validate(list, listSchema);
}

function validateDone(order) {
  const schema = {
    done: Joi.boolean().required(),
  };
  return Joi.validate(order, schema);
}

function handleInvalidInputs(error, res) {
  return res.status(400).send(error.details[0].message);
}

function validateCustomerInfo(customer) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    phoneNum: Joi.string()
      .length(10)
      .regex(/^[0-9]+$/)
      .required(),
  };

  return Joi.validate(customer, schema);
}

exports.validateOrderInfo = validateOrderInfo;
exports.validateOrderList = validateOrderList;
exports.validateCustomerInfo = validateCustomerInfo;
exports.validateDone = validateDone;
