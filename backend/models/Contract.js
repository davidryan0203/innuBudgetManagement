const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema(
  {
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
      required: true,
    },
    contractId: {
      type: String,
      unique: true,
      required: true,
    },
    contractorName: String,
    startDate: Date,
    endDate: Date,
    totalValue: Number,
    lineItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LineItem',
    },
    terms: String,
    status: {
      type: String,
      enum: ['active', 'expired', 'pending_renewal', 'terminated'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contract', contractSchema);
