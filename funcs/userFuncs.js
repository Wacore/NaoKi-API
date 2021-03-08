const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

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

function validateExpoPushToken(token) {
  const schema = {
    id: Joi.objectId().required(),
    token: Joi.string().min(30).max(55).required(),
  };
  return Joi.validate(token, schema);
}

exports.validateUser = validateUser;
exports.validateExpoPushToken = validateExpoPushToken;
