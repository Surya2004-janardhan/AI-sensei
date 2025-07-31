const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  jlptLevel: {
    type: String,
    enum: ["N5", "N4", "N3", "N2", "N1"],
    default: "N5",
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("User", UserSchema);
