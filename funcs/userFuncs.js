const Joi = require("joi");

function validateUser(user) {
  const schema = {
    username: Joi.string().min(5).max(25).required(),
    password: Joi.string()
      .min(8)
      .max(255)
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      .required(),
  };
  return Joi.validate(user, schema);
}

exports.validateUser = validateUser;
