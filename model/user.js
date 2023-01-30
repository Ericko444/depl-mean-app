const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'client',
    enum: ["client", "atelier", "finance"]
  }
});

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports = User;

