
const mongoose = require("mongoose");

const users = mongoose.Schema({
  firstName: String,
   lastName: String,
  email: String,
  password: String,
  resetToken: String,
  role: { type: String, enum: ['brand', 'store', 'user'], default: 'user' },
  uniqueString: String,
  isActive: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

var User = mongoose.model("User", users);

module.exports = User;
