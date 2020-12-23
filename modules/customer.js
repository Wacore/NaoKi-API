const mongoose = require("mongoose");

const customersSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  isGold: { type: Boolean, default: false },
  credit: {
    type: Number,
    default: 0,
  },
  phoneNum: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        var re = /^\d{10}$/;
        return v.trim().length < 1 || re.test(v);
      },
      message: "Provided phone number is invalid.",
    },
  },
});

const Customer = mongoose.model("Customer", customersSchema);

exports.Customer = Customer;
