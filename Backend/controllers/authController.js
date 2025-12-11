const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
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

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate OTP and set expiry (3 minutes)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

    user.resetOTP = otp;
    user.resetOTPExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "AI Sensei - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>Hello ${user.name || "User"},</p>
          <p>You requested to reset your password. Use the OTP below to proceed:</p>
          <div style="background-color: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #1F2937; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p><strong>This OTP is valid for 3 minutes only.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: 1px solid #E5E7EB; margin: 30px 0;">
          <p style="color: #6B7280; font-size: 12px;">AI Sensei - Your Japanese Learning Companion</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      msg: "OTP sent to your email",
      email: email, // Return email so frontend knows which email to verify
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ msg: "Failed to send OTP", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Email, OTP, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if OTP exists
    if (!user.resetOTP) {
      return res
        .status(400)
        .json({ msg: "No OTP request found. Please request a new OTP" });
    }

    // Check if OTP is expired
    if (new Date() > user.resetOTPExpiry) {
      user.resetOTP = undefined;
      user.resetOTPExpiry = undefined;
      await user.save();
      return res
        .status(400)
        .json({ msg: "OTP expired. Please request a new one" });
    }

    // Verify OTP
    if (user.resetOTP !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // Hash new password and update
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    res.json({
      msg: "Password reset successful. You can now login with your new password",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res
      .status(500)
      .json({ msg: "Failed to reset password", error: error.message });
  }
};
