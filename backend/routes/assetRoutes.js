const express = require('express');
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/create', assetController.createAsset);
router.get('/list', assetController.getAssets);
router.get('/end-of-life', assetController.getEndOfLifeAssets);
router.put('/:assetId/status', assetController.updateAssetStatus);

module.exports = router;
