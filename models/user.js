const mongoose = require("mongoose");
const Transation = require("./transtations");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

userSchema.pre("remove", function (next) {
  // 'this' is the client being removed. Provide callbacks here if you want
  // to be notified of the calls' result.
  Transation.remove({ sender: this._id }).exec();
  Transation.remove({ receiver: this._id }).exec();
  next();
});

module.exports = mongoose.model("Users", userSchema);
