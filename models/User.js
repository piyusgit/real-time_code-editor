// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  socketId: { type: String, required: true },
  roomId: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
