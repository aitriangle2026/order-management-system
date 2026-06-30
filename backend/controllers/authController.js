const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const axios = require("axios");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'mysecretkey',
      { expiresIn: '7d' }
    );

    res.json({ success: true, token, username: admin.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    admin.resetToken = token;

    admin.resetTokenExpiry = Date.now() + 1000 * 60 * 15;

    await admin.save();

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await axios.post(
  "https://api.brevo.com/v3/smtp/email",
  {
    sender: {
      name: "Triangle Creative Lab",
      email: process.env.EMAIL_FROM,
    },
    to: [
      {
        email: admin.email,
      },
    ],
    subject: "Reset your password",
    htmlContent: `
      <h2>Password Reset</h2>
      <p>You requested a password reset.</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
    `,
  },
  {
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
  }
);

    res.json({
      message: "Password reset email sent.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: {
        $gt: Date.now(),
      },
    });

    if (!admin) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    admin.password = hashedPassword;

    admin.resetToken = undefined;

    admin.resetTokenExpiry = undefined;

    await admin.save();

    res.json({
      message: "Password updated successfully.",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = { login, forgotPassword, resetPassword };