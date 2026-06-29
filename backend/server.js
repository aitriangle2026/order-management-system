const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

const transporter = require("./config/mail");

app.get("/api/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"Triangle Creative Lab" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_FROM,
      subject: "Test Email",
      text: "This is a test email from Railway.",
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
      code: err.code,
    });
  }
});

connectDB();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Order Management API is running.' });
});

app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});