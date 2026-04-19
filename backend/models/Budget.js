const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    fiscalYear: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    totalBudget: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    totalCommitted: {
      type: Number,
      default: 0,
    },
    studentEnrollment: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'pending_approval', 'approved', 'locked'],
      default: 'draft',
    },
    approvalDate: Date,
    lockDate: Date,
    createdBy: mongoose.Schema.Types.ObjectId,
    notes: String,
  },
  { timestamps: true }
);

budgetSchema.index({ fiscalYear: 1, school: 1, department: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
