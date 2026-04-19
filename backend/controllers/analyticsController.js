const LineItem = require('../models/LineItem');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

exports.getVarianceAnalysis = async (req, res) => {
  try {
    const { budgetId } = req.params;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (req.userRole === 'department_head' && budget.department !== req.userDepartment) {
      return res.status(403).json({ message: 'Access denied for this department budget' });
    }

    const lineItems = await LineItem.find({ budget: budgetId });

    const varianceData = lineItems.map(item => {
      const variance = item.allocatedAmount - item.spentAmount;
      const variancePercentage = (variance / item.allocatedAmount) * 100;
      const utilizationPercentage = (item.spentAmount / item.allocatedAmount) * 100;

      return {
        category: item.category,
        allocated: item.allocatedAmount,
        spent: item.spentAmount,
        remaining: item.allocatedAmount - item.committedAmount - item.spentAmount,
        variance,
        variancePercentage,
        utilizationPercentage,
        status: variancePercentage > 0 ? 'Under Budget' : 'Over Budget',
      };
    });

    // Sort by variance percentage
    varianceData.sort((a, b) => a.variancePercentage - b.variancePercentage);

    // Calculate summary
    const totalAllocated = varianceData.reduce((sum, item) => sum + item.allocated, 0);
    const totalSpent = varianceData.reduce((sum, item) => sum + item.spent, 0);
    const totalVariance = totalAllocated - totalSpent;
    const totalVariancePercentage = (totalVariance / totalAllocated) * 100;

    // Find items draining funds fastest
    const topDrains = varianceData
      .sort((a, b) => b.utilizationPercentage - a.utilizationPercentage)
      .slice(0, 5);

    res.json({
      summary: {
        totalAllocated,
        totalSpent,
        totalVariance,
        totalVariancePercentage,
        overBudgetCount: varianceData.filter(item => item.variancePercentage < 0).length,
      },
      lineItemVariance: varianceData,
      topDrains,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching variance analysis', error: error.message });
  }
};

exports.getQuarterlyComparison = async (req, res) => {
  try {
    const { budgetId } = req.params;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (req.userRole === 'department_head' && budget.department !== req.userDepartment) {
      return res.status(403).json({ message: 'Access denied for this department budget' });
    }

    const transactions = await Transaction.find({ budget: budgetId });

    const quarterlyData = {
      Q1: { spent: 0, transactions: 0 },
      Q2: { spent: 0, transactions: 0 },
      Q3: { spent: 0, transactions: 0 },
      Q4: { spent: 0, transactions: 0 },
    };

    transactions.forEach(transaction => {
      const quarter = transaction.quarter || 'Q1';
      quarterlyData[quarter].spent += transaction.amount;
      quarterlyData[quarter].transactions += 1;
    });

    res.json(quarterlyData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quarterly comparison', error: error.message });
  }
};
