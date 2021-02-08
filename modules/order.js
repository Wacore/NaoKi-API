const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  created_at: { type: Date, default: Date.now() },
  is_done: {
    type: Boolean,
    default: false,
    required: true,
  },
  order_info: {
    orderNum: {
      type: Number,
      default: 1,
      max: 999,
    },
    type: {
      type: String,
      default: "Dine-in",
      enum: ["Dine-in", "To-go"],
      required: true,
    },
    peoNum: {
      type: Number,
      default: 1,
      max: 50,
      min: 1,
    },
    // Change this to string and add an option for Sushibar
    tableNum: {
      type: Number,
      max: 14,
      min: 1,
    },
    pickupTime: {
      type: Number,
      min: 10,
      max: 120,
    },
  },
  orderlist: [
    {
      menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
        required: true,
      },
      amount: {
        type: Number,
        max: 50,
        min: 1,
        required: true,
      },
      desc: {
        type: String,
        maxlength: 255,
      },
      is_sent: {
        type: Boolean,
        default: false,
      },
    },
  ],
  customer_info: {
    name: { type: String, minlength: 3, maxlength: 50 },
    phoneNum: {
      type: String,
      validate: {
        validator: function (v) {
          var re = /^\d{10}$/;
          return v.trim().length < 1 || re.test(v);
        },
        message: "Provided phone number is invalid.",
      },
    },
  },
});

const Order = mongoose.model("Order", orderSchema);

exports.Order = Order;
