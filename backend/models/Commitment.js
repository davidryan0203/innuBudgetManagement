const mongoose = require('mongoose');

const commitmentSchema = new mongoose.Schema(
  {
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
      required: true,
    },
    lineItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LineItem',
      required: true,
    },
    poId: {
      type: String,
      unique: true,
      required: true,
    },
    poDate: Date,
    vendor: String,
    totalAmount: Number,
    remainingBalance: Number,
    linkedBudgetCategory: String,
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'delivered', 'cancelled'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Commitment', commitmentSchema);
