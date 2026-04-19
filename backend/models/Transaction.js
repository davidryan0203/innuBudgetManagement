const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    lineItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LineItem',
      required: true,
    },
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    quarter: {
      type: String,
      enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    },
    month: {
      type: String,
      enum: ['January', 'February', 'March', 'April', 'May', 'June',
             'July', 'August', 'September', 'October', 'November', 'December'],
    },
    vendorName: String,
    invoiceNumber: String,
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'pending'],
      default: 'pending',
    },
    purchaseOrderId: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
