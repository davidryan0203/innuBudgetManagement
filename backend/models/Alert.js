const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
    },
    lineItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LineItem',
    },
    alertType: {
      type: String,
      enum: ['threshold_exceeded', 'unusual_spike', 'underutilized', 'forecast_overrun'],
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    message: String,
    data: mongoose.Schema.Types.Mixed,
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
