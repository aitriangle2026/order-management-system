const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const net = require("net");

app.get("/smtp-test", (req, res) => {
  const socket = net.createConnection(
    587,
    "smtp-relay.brevo.com"
  );

  socket.setTimeout(10000);

  socket.on("connect", () => {
    socket.destroy();
    res.send("SMTP port is reachable");
  });

  socket.on("timeout", () => {
    socket.destroy();
    res.status(500).send("Connection timeout");
  });

  socket.on("error", (err) => {
    res.status(500).send(err.message);
  });
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