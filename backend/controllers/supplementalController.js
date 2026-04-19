const SupplementalBudget = require('../models/SupplementalBudget');
const LineItem = require('../models/LineItem');
const Budget = require('../models/Budget');

exports.createSupplementalBudget = async (req, res) => {
  try {
    const { budgetId, lineItemId, supplementalAmount, reason } = req.body;

    const lineItem = await LineItem.findById(lineItemId);
    if (!lineItem) {
      return res.status(404).json({ message: 'Line item not found' });
    }

    const previousAmount = lineItem.allocatedAmount;

    const supplementalBudget = new SupplementalBudget({
      budget: budgetId,
      lineItem: lineItemId,
      previousAmount,
      supplementalAmount,
      reason,
    });

    await supplementalBudget.save();

    lineItem.quotaAmount += supplementalAmount;
    await lineItem.save();

    const budget = await Budget.findById(budgetId);
    budget.totalBudget += supplementalAmount;
    await budget.save();

    res.status(201).json(supplementalBudget);
  } catch (error) {
    res.status(500).json({ message: 'Error creating supplemental budget', error: error.message });
  }
};

exports.approveSupplementalBudget = async (req, res) => {
  try {
    const { supplementalBudgetId } = req.params;

    const supplementalBudget = await SupplementalBudget.findById(supplementalBudgetId);
    if (!supplementalBudget) {
      return res.status(404).json({ message: 'Supplemental budget not found' });
    }

    supplementalBudget.status = 'approved';
    supplementalBudget.approvalDate = new Date();
    supplementalBudget.approvedBy = req.userId;
    await supplementalBudget.save();

    res.json({ message: 'Supplemental budget approved', supplementalBudget });
  } catch (error) {
    res.status(500).json({ message: 'Error approving supplemental budget', error: error.message });
  }
};

exports.getSupplementalBudgets = async (req, res) => {
  try {
    const { budgetId } = req.query;
    const supplementalBudgets = await SupplementalBudget.find({ budget: budgetId })
      .populate('lineItem')
      .populate('budget');
    res.json(supplementalBudgets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching supplemental budgets', error: error.message });
  }
};
