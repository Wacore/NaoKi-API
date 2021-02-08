const Joi = require("joi");

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    isGold: Joi.boolean(),
    credit: Joi.number(),
    phoneNum: Joi.string()
      .length(10)
      .regex(/^[0-9]+$/)
      .required(),
  };

  return Joi.validate(customer, schema);
}

function validatecustomerCredit(credit) {
  const schema = {
    credit: Joi.number(),
  };

  return Joi.validate(credit, schema);
}

exports.validateCustomer = validateCustomer;
exports.validatecustomerCredit = validatecustomerCredit;
