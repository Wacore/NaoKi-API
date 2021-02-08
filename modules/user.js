const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});

usersSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, username: this.username, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", usersSchema);

exports.User = User;

// validate: {
//       validator: function (v) {
//         var re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//         return re.test(v);
//       },
//       message: "Password is not strong enough.",
//     },
