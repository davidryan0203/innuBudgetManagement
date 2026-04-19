const Budget = require('../models/Budget');
const LineItem = require('../models/LineItem');
const Transaction = require('../models/Transaction');
const Alert = require('../models/Alert');
const { calculateBurnRate, calculateQuarter, getMonthName, predictOverrun, calculateCostPerStudent } = require('../utils/analysis');

exports.createBudget = async (req, res) => {
  try {
    if (!['admin', 'department_head'].includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { fiscalYear, studentEnrollment, school, department } = req.body;
    const budgetDepartment = req.userRole === 'department_head' ? req.userDepartment : department;

    if (!budgetDepartment) {
      return res.status(400).json({ message: 'Department is required' });
    }

    const existingBudget = await Budget.findOne({ fiscalYear, school, department: budgetDepartment });
    if (existingBudget) {
      return res.status(400).json({ message: 'Budget already exists for this fiscal year and department' });
    }

    const budget = new Budget({
      fiscalYear,
      school,
      department: budgetDepartment,
      studentEnrollment,
      createdBy: req.userId,
    });

    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Error creating budget', error: error.message });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    if (!['admin', 'department_head'].includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { school } = req.query;
    const query = {};

    if (school) {
      query.school = school;
    }

    if (req.userRole === 'department_head') {
      query.department = req.userDepartment;
    }
    
    const budgets = await Budget.find(query);
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budgets', error: error.message });
  }
};

exports.getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (req.userRole === 'department_head' && budget.department !== req.userDepartment) {
      return res.status(403).json({ message: 'Access denied for this department budget' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budget', error: error.message });
  }
};

exports.addLineItem = async (req, res) => {
  try {
    const { budgetId, category, description, allocatedAmount } = req.body;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (req.userRole === 'department_head' && budget.department !== req.userDepartment) {
      return res.status(403).json({ message: 'Access denied for this department budget' });
    }

    const lineItem = new LineItem({
      budget: budgetId,
      category,
      description,
      allocatedAmount,
    });

    await lineItem.save();

    budget.totalBudget += allocatedAmount;
    await budget.save();

    res.status(201).json(lineItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding line item', error: error.message });
  }
};

exports.getLineItems = async (req, res) => {
  try {
    const { budgetId } = req.query;
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (req.userRole === 'department_head' && budget.department !== req.userDepartment) {
      return res.status(403).json({ message: 'Access denied for this department budget' });
    }

    const lineItems = await LineItem.find({ budget: budgetId }).populate('budget');
    res.json(lineItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching line items', error: error.message });
  }
};

exports.recordTransaction = async (req, res) => {
  try {
    const { lineItemId, budgetId, transactionId, amount, date, vendorName, invoiceNumber, purchaseOrderId } = req.body;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (req.userRole === 'department_head' && budget.department !== req.userDepartment) {
      return res.status(403).json({ message: 'Access denied for this department budget' });
    }

    const transaction = new Transaction({
      lineItem: lineItemId,
      budget: budgetId,
      transactionId,
      amount,
      date: new Date(date),
      quarter: calculateQuarter(new Date(date)),
      month: getMonthName(new Date(date)),
      vendorName,
      invoiceNumber,
      purchaseOrderId,
      paymentStatus: 'paid',
    });

    await transaction.save();

    const lineItem = await LineItem.findById(lineItemId);
    lineItem.spentAmount += amount;
    await lineItem.save();

    budget.totalSpent += amount;
    await budget.save();

    // Check for alerts
    const utilizationRate = (lineItem.spentAmount / lineItem.allocatedAmount) * 100;
    if (utilizationRate > 80) {
      const alert = new Alert({
        budget: budgetId,
        lineItem: lineItemId,
        alertType: 'threshold_exceeded',
        severity: 'high',
        message: `${lineItem.category} budget is ${Math.round(utilizationRate)}% consumed`,
        data: { utilizationRate, category: lineItem.category },
      });
      await alert.save();
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error recording transaction', error: error.message });
  }
};

exports.approveBudget = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin can approve budgets' });
    }

    const { budgetId } = req.params;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget.status = 'approved';
    budget.approvalDate = new Date();
    await budget.save();

    res.json({ message: 'Budget approved successfully', budget });
  } catch (error) {
    res.status(500).json({ message: 'Error approving budget', error: error.message });
  }
};

exports.lockBudget = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin can lock budgets' });
    }

    const { budgetId } = req.params;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget.status = 'locked';
    budget.lockDate = new Date();

    const lineItems = await LineItem.find({ budget: budgetId });
    lineItems.forEach(item => {
      item.isLocked = true;
    });
    await Promise.all(lineItems.map(item => item.save()));

    await budget.save();

    res.json({ message: 'Budget locked successfully', budget });
  } catch (error) {
    res.status(500).json({ message: 'Error locking budget', error: error.message });
  }
};

exports.getDashboardMetrics = async (req, res) => {
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
    const transactions = await Transaction.find({ budget: budgetId });

    const costPerStudent = calculateCostPerStudent(budget.totalSpent, budget.studentEnrollment);

    const burnRatePerItem = lineItems.map(item => ({
      category: item.category,
      spent: item.spentAmount,
      allocated: item.allocatedAmount,
      remaining: item.allocatedAmount - item.spentAmount,
      burnRate: calculateBurnRate(item.spentAmount, item.allocatedAmount, 1),
    }));

    const topCostDrivers = lineItems
      .sort((a, b) => b.spentAmount - a.spentAmount)
      .slice(0, 5)
      .map(item => ({
        category: item.category,
        spent: item.spentAmount,
      }));

    res.json({
      totalBudgeted: budget.totalBudget,
      totalSpent: budget.totalSpent,
      totalRemaining: budget.totalBudget - budget.totalSpent,
      utilizationPercentage: (budget.totalSpent / budget.totalBudget) * 100,
      costPerStudent,
      burnRatePerItem,
      topCostDrivers,
      transactionCount: transactions.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard metrics', error: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const { budgetId } = req.query;
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (req.userRole === 'department_head' && budget.department !== req.userDepartment) {
      return res.status(403).json({ message: 'Access denied for this department budget' });
    }

    const alerts = await Alert.find({ budget: budgetId, isResolved: false });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { budgetId, lineItemId } = req.query;

    if (!budgetId) {
      return res.status(400).json({ message: 'budgetId is required' });
    }

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (req.userRole === 'department_head' && budget.department !== req.userDepartment) {
      return res.status(403).json({ message: 'Access denied for this department budget' });
    }

    const query = { budget: budgetId };

    if (lineItemId) {
      const lineItem = await LineItem.findById(lineItemId);
      if (!lineItem) {
        return res.status(404).json({ message: 'Line item not found' });
      }

      if (String(lineItem.budget) !== String(budgetId)) {
        return res.status(400).json({ message: 'Line item does not belong to the selected budget' });
      }

      query.lineItem = lineItemId;
    }

    const transactions = await Transaction.find(query)
      .populate('lineItem', 'category description')
      .sort({ date: -1, createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};
