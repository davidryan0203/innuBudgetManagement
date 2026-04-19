const Recommendation = require('../models/Recommendation');
const LineItem = require('../models/LineItem');
const Commitment = require('../models/Commitment');

exports.generateRecommendations = async (req, res) => {
  try {
    const { budgetId } = req.params;

    const lineItems = await LineItem.find({ budget: budgetId });
    const commitments = await Commitment.find({ budget: budgetId });

    const recommendations = [];

    // Analyze underspent items
    for (const item of lineItems) {
      const utilizationRate = (item.spentAmount / item.allocatedAmount) * 100;

      if (utilizationRate < 30 && new Date().getMonth() > 8) {
        // Q4 analysis
        recommendations.push({
          budget: budgetId,
          title: `Reallocate ${item.category} Budget`,
          description: `${item.category} has only used ${utilizationRate.toFixed(2)}% of allocated budget. Consider reallocating unused funds.`,
          type: 'cost_saving',
          potentialSavings: item.allocatedAmount - item.spentAmount,
          implementationDifficulty: 'moderate',
          priority: 'medium',
        });
      }
    }

    // Check for delayed purchases
    const hardwareItems = lineItems.filter(item => item.category.includes('Hardware'));
    if (hardwareItems.length > 0) {
      const avgSpend = hardwareItems.reduce((sum, item) => sum + item.spentAmount, 0) / hardwareItems.length;
      recommendations.push({
        budget: budgetId,
        title: 'Optimize Hardware Purchase Timing',
        description: 'Consider delaying non-critical hardware purchases to Q3 to better balance cashflow.',
        type: 'cash_flow',
        implementationDifficulty: 'easy',
        priority: 'high',
      });
    }

    // Check for vendor consolidation
    const vendorList = commitments.map(c => c.vendor);
    const vendorCounts = {};
    vendorList.forEach(vendor => {
      vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;
    });

    if (Object.values(vendorCounts).some(count => count > 1)) {
      recommendations.push({
        budget: budgetId,
        title: 'Consolidate Vendor Contracts',
        description: 'Multiple contracts with similar vendors exist. Consolidate to reduce costs.',
        type: 'cost_saving',
        potentialSavings: 5000,
        implementationDifficulty: 'difficult',
        priority: 'high',
      });
    }

    // Save recommendations
    const savedRecommendations = await Recommendation.insertMany(recommendations);

    res.status(201).json(savedRecommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { budgetId } = req.query;
    const recommendations = await Recommendation.find({ budget: budgetId });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
  }
};

exports.updateRecommendationStatus = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { status } = req.body;

    const recommendation = await Recommendation.findByIdAndUpdate(
      recommendationId,
      { status },
      { new: true }
    );

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating recommendation', error: error.message });
  }
};
