module.exports = {
  validateAccount: function validateAccount(account) {
    const schema = {
      name: Joi.string().min(3).required(),
    };

    return Joi.validate(account, schema);
  },
};
