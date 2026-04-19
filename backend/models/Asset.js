const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
      required: true,
    },
    assetType: {
      type: String,
      enum: ['laptop', 'desktop', 'server', 'printer', 'network_equipment', 'other'],
    },
    quantity: Number,
    purchaseDate: Date,
    expectedEndOfLife: Date,
    estimatedReplacementCost: Number,
    location: String,
    status: {
      type: String,
      enum: ['active', 'maintenance', 'end-of-life', 'retired'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Asset', assetSchema);
