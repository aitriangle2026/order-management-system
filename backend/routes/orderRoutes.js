const express = require('express');
const router = express.Router();

const {
  getAllOrders,
  getSummary,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getReminders,
} = require('../controllers/orderController');

// IMPORTANT: /summary must be declared before /:id so it isn't treated as an id param
router.get('/summary', getSummary);

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.get('/reminders', getReminders);

module.exports = router;