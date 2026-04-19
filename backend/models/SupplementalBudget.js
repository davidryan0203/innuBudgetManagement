const mongoose = require('mongoose');

const supplementalBudgetSchema = new mongoose.Schema(
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
    reason: String,
    previousAmount: Number,
    supplementalAmount: {
      type: Number,
      required: true,
    },
    approvalDate: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SupplementalBudget', supplementalBudgetSchema);
