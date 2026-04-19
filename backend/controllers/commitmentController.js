const Commitment = require('../models/Commitment');
const LineItem = require('../models/LineItem');

exports.createCommitment = async (req, res) => {
  try {
    const { budgetId, lineItemId, poId, poDate, vendor, totalAmount, linkedBudgetCategory } = req.body;

    const commitment = new Commitment({
      budget: budgetId,
      lineItem: lineItemId,
      poId,
      poDate: new Date(poDate),
      vendor,
      totalAmount,
      remainingBalance: totalAmount,
      linkedBudgetCategory,
    });

    await commitment.save();

    const lineItem = await LineItem.findById(lineItemId);
    lineItem.committedAmount += totalAmount;
    await lineItem.save();

    res.status(201).json(commitment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating commitment', error: error.message });
  }
};

exports.getCommitments = async (req, res) => {
  try {
    const { budgetId } = req.query;
    const commitments = await Commitment.find({ budget: budgetId }).populate('lineItem');
    res.json(commitments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commitments', error: error.message });
  }
};

exports.updateCommitmentStatus = async (req, res) => {
  try {
    const { commitmentId } = req.params;
    const { status, remainingBalance } = req.body;

    const commitment = await Commitment.findByIdAndUpdate(
      commitmentId,
      { status, remainingBalance: remainingBalance || undefined },
      { new: true }
    );

    res.json(commitment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating commitment', error: error.message });
  }
};
