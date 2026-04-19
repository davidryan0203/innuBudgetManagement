const Asset = require('../models/Asset');

exports.createAsset = async (req, res) => {
  try {
    const { budgetId, assetType, quantity, purchaseDate, expectedEndOfLife, estimatedReplacementCost, location } = req.body;

    const asset = new Asset({
      budget: budgetId,
      assetType,
      quantity,
      purchaseDate: new Date(purchaseDate),
      expectedEndOfLife: new Date(expectedEndOfLife),
      estimatedReplacementCost,
      location,
    });

    await asset.save();
    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Error creating asset', error: error.message });
  }
};

exports.getAssets = async (req, res) => {
  try {
    const { budgetId } = req.query;
    const assets = await Asset.find({ budget: budgetId });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets', error: error.message });
  }
};

exports.getEndOfLifeAssets = async (req, res) => {
  try {
    const { budgetId } = req.query;
    
    const today = new Date();
    const oneYearLater = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);

    const assets = await Asset.find({
      budget: budgetId,
      expectedEndOfLife: { $gte: today, $lte: oneYearLater },
    });

    const insights = assets.map(asset => ({
      assetType: asset.assetType,
      quantity: asset.quantity,
      estimatedCost: asset.estimatedReplacementCost,
      totalProjectedCost: asset.quantity * asset.estimatedReplacementCost,
      endOfLife: asset.expectedEndOfLife,
    }));

    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching end-of-life assets', error: error.message });
  }
};

exports.updateAssetStatus = async (req, res) => {
  try {
    const { assetId } = req.params;
    const { status } = req.body;

    const asset = await Asset.findByIdAndUpdate(assetId, { status }, { new: true });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Error updating asset', error: error.message });
  }
};
