const Order = require('../models/Order');

const STATUS_VALUES = ['Active', 'Completed', 'Cancelled'];

// Convert a Mongo doc into the API shape (camelCase, same as before)
const toApiShape = (doc) => ({
  id: doc._id,
  jobNo: doc.jobNo || `JOB-${doc._id}`,
  jobName: doc.jobName,
  orderSource: doc.orderSource,
  jobOwner: doc.jobOwner,
  assignPerson: doc.assignPerson,
  startDate: doc.startDate,
  dueDate: doc.dueDate,
  jobStatus: doc.jobStatus,
  endDate: doc.endDate,

  projectCost: Number(doc.projectCost || 0),
  projectExpenses: Number(doc.projectExpenses || 0),
  profit: Number(doc.projectCost || 0) - Number(doc.projectExpenses || 0),

  remarks: doc.remarks,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const validatePayload = (body, { partial = false } = {}) => {
  const errors = [];
  const required = ['jobName'];

  if (!partial) {
    required.forEach((field) => {
      if (!body[field] || String(body[field]).trim() === '') {
        errors.push(`"${field}" is required.`);
      }
    });
  }

  if (body.jobStatus && !STATUS_VALUES.includes(body.jobStatus)) {
    errors.push(`"jobStatus" must be one of: ${STATUS_VALUES.join(', ')}.`);
  }

  if (body.projectCost !== undefined && isNaN(body.projectCost)) {
    errors.push('"projectCost" must be a valid number.');
  }

  if (body.projectExpenses !== undefined && isNaN(body.projectExpenses)) {
    errors.push('"projectExpenses" must be a valid number.');
  }

  return errors;
};

// GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { jobNo: regex },
        { jobName: regex },
        { jobOwner: regex },
        { assignPerson: regex },
      ];
    }

    if (status && STATUS_VALUES.includes(status)) {
      filter.jobStatus = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders.map(toApiShape));
  } catch (err) {
    console.error('getAllOrders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

// GET /api/orders/summary
const getSummary = async (req, res) => {
  try {
    const total = await Order.countDocuments();

    const totalsAgg = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $ifNull: ['$projectCost', 0] } },
          totalExpenses: { $sum: { $ifNull: ['$projectExpenses', 0] } },
        },
      },
    ]);

    const totalRevenue = totalsAgg[0]?.totalRevenue || 0;
    const totalExpenses = totalsAgg[0]?.totalExpenses || 0;
    const totalProfit = totalRevenue - totalExpenses;

    const statusAgg = await Order.aggregate([
      { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
    ]);

    const statusCounts = STATUS_VALUES.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});
    statusAgg.forEach((row) => {
      statusCounts[row._id] = row.count;
    });

    const overdue = await Order.countDocuments({
      dueDate: { $ne: null, $lt: new Date() },
      jobStatus: { $nin: ['Completed', 'Cancelled'] },
    });

    res.json({
      total,
      totalRevenue,
      totalExpenses,
      totalProfit,
      overdue,
      byStatus: statusCounts,
    });
  } catch (err) {
    console.error('getSummary error:', err);
    res.status(500).json({ message: 'Failed to fetch summary.' });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json(toApiShape(order));
  } catch (err) {
    console.error('getOrderById error:', err);
    res.status(500).json({ message: 'Failed to fetch order.' });
  }
};

// POST /api/orders
const createOrder = async (req, res) => {
  const errors = validatePayload(req.body);
  if (errors.length) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  try {
    // Mimic the old auto-increment-style job number using a running count
    const lastOrder = await Order.findOne()
  .sort({ createdAt: -1 });

let nextNumber = 1;

if (lastOrder?.jobNo) {
  nextNumber =
    parseInt(lastOrder.jobNo.replace('JOB-', '')) + 1;
}

const nextJobNo = `JOB-${nextNumber}`;

    const order = await Order.create({
      jobNo: nextJobNo,
      jobName: req.body.jobName,
      orderSource: req.body.orderSource || null,
      jobOwner: req.body.jobOwner || null,
      assignPerson: req.body.assignPerson || null,
      startDate: req.body.startDate || null,
      dueDate: req.body.dueDate || null,
      jobStatus: req.body.jobStatus || 'Active',
      endDate: req.body.endDate || null,
      projectCost: req.body.projectCost || 0,
      projectExpenses: req.body.projectExpenses || 0,
      remarks: req.body.remarks || null,
    });

    res.status(201).json(toApiShape(order));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: `Job No "${req.body.jobNo}" already exists.` });
    }
    console.error('createOrder error:', err);
    res.status(500).json({ message: 'Failed to create order.' });
  }
};

// PUT /api/orders/:id
const updateOrder = async (req, res) => {
  const errors = validatePayload(req.body, { partial: true });
  if (errors.length) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  try {
    const existing = await Order.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const fields = [
      'jobNo', 'jobName', 'orderSource', 'jobOwner', 'assignPerson',
      'startDate', 'dueDate', 'jobStatus', 'endDate',
      'projectCost', 'projectExpenses', 'remarks',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        existing[field] = req.body[field];
      }
    });

    await existing.save();
    res.json(toApiShape(existing));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: `Job No "${req.body.jobNo}" already exists.` });
    }
    console.error('updateOrder error:', err);
    res.status(500).json({ message: 'Failed to update order.' });
  }
};

// DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const result = await Order.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json({ message: 'Order deleted.' });
  } catch (err) {
    console.error('deleteOrder error:', err);
    res.status(500).json({ message: 'Failed to delete order.' });
  }
};

const getReminders = async (req, res) => {
  try {
    const today = new Date();

    const reminders = await Order.find({
      dueDate: { $ne: null },
      jobStatus: { $nin: ['Completed', 'Cancelled'] }
    }).sort({ dueDate: 1 });

    res.json(reminders);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch reminders'
    });
  }
};



module.exports = {
  getAllOrders,
  getSummary,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getReminders,
};