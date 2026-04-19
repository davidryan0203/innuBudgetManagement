const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
      required: true,
    },
    title: String,
    description: String,
    type: {
      type: String,
      enum: ['cost_saving', 'cash_flow', 'risk_mitigation', 'opportunity'],
    },
    potentialSavings: Number,
    implementationDifficulty: {
      type: String,
      enum: ['easy', 'moderate', 'difficult'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
    status: {
      type: String,
      enum: ['suggested', 'under_review', 'implemented', 'dismissed'],
      default: 'suggested',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recommendation', recommendationSchema);
