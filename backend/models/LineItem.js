const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema(
  {
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Hardware-SIS',
        'Software-SIS',
        'Hardware-NIMS',
        'Software-NIMS',
        'Telecommunications',
        'IT-Support',
        'Training',
        'Copier-SIS',
        'Copier-NIMS',
        'Copier-Board',
      ],
    },
    description: String,
    allocatedAmount: {
      type: Number,
      required: true,
    },
    quotaAmount: {
      type: Number,
      default: 0,
    },
    spentAmount: {
      type: Number,
      default: 0,
    },
    committedAmount: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('LineItem', lineItemSchema);
