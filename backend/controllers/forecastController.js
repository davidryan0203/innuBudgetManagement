const Forecast = require('../models/Forecast');
const LineItem = require('../models/LineItem');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { predictOverrun } = require('../utils/analysis');

exports.generateForecast = async (req, res) => {
  try {
    const { budgetId, lineItemId } = req.body;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (req.userRole === 'department_head' && budget.department !== req.userDepartment) {
      return res.status(403).json({ message: 'Access denied for this department budget' });
    }

    const lineItem = await LineItem.findById(lineItemId);
    if (!lineItem) {
      return res.status(404).json({ message: 'Line item not found' });
    }

    if (String(lineItem.budget) !== String(budgetId)) {
      return res.status(400).json({ message: 'Line item does not belong to the selected budget' });
    }

    const transactions = await Transaction.find({ lineItem: lineItemId });
    if (transactions.length === 0) {
      return res.status(400).json({ message: 'Insufficient transaction data for forecasting' });
    }

    const monthsElapsed = new Date().getMonth() + 1;
    const daysElapsed = Math.floor((new Date() - new Date(lineItem.createdAt)) / (1000 * 60 * 60 * 24));
    const totalDays = 365;

    const prediction = predictOverrun(lineItem.spentAmount, lineItem.allocatedAmount, Math.max(daysElapsed, 1), totalDays);

    const trend = transactions.length > 1 
      ? (transactions[transactions.length - 1].amount > transactions[0].amount ? 'increasing' : 'decreasing')
      : 'stable';

    const forecast = new Forecast({
      budget: budgetId,
      lineItem: lineItemId,
      currentSpendRate: lineItem.spentAmount / Math.max(monthsElapsed, 1),
      projectedEndOfYearSpend: prediction.projectedSpend,
      projectedOverrun: prediction.overrun,
      quarter: `Q${Math.ceil(monthsElapsed / 3)}`,
      confidenceLevel: Math.min(transactions.length * 10, 95),
      trend,
      historicalData: {
        transactionCount: transactions.length,
        averageTransaction: transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length,
      },
    });

    await forecast.save();

    res.status(201).json({
      forecast,
      prediction,
      riskSummary: prediction.projectedOverrun > 0 
        ? `At current rate, ${lineItem.category} will exceed budget by $${Math.round(prediction.projectedOverrun)} by end of year`
        : 'Within budget projection',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating forecast', error: error.message });
  }
};

exports.getForecasts = async (req, res) => {
  try {
    const { budgetId } = req.query;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (req.userRole === 'department_head' && budget.department !== req.userDepartment) {
      return res.status(403).json({ message: 'Access denied for this department budget' });
    }

    const forecasts = await Forecast.find({ budget: budgetId }).populate('lineItem');
    res.json(forecasts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forecasts', error: error.message });
  }
};
