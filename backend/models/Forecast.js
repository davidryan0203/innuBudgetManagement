const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema(
  {
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
      required: true,
    },
    lineItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LineItem',
    },
    historicalData: mongoose.Schema.Types.Mixed,
    currentSpendRate: Number,
    projectedEndOfYearSpend: Number,
    projectedOverrun: Number,
    quarter: String,
    confidenceLevel: Number,
    trend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable'],
    },
    seasonalFactors: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Forecast', forecastSchema);
