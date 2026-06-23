const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    jobNo: { type: String, unique: true, sparse: true },
    jobName: { type: String, required: true },
    orderSource: { type: String, default: null },
    jobOwner: { type: String, default: null },
    assignPerson: { type: String, default: null },
    startDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
    jobStatus: {
      type: String,
      enum: ['Active', 'Completed', 'Cancelled'],
      default: 'Active',
    },
    endDate: { type: Date, default: null },
    projectCost: { type: Number, default: 0 },
    projectExpenses: { type: Number, default: 0 },
    remarks: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);