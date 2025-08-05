const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ quiet: true });

exports.register = async (req, res) => {
  console.log("inside of the body");
  const { email, password, name } = req.body;
  const existing = await User.findOne({ email });
  // console.log(existing);
  if (existing) return res.status(400).json({ msg: "User exists" });
  console.log("existing returned value may be");
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, name });
  console.log("user creeated succefully ", user);
  console.log("what am i auth -- register ");
  res.json({ user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30h",
  });
  res.json({ token, user });
};
