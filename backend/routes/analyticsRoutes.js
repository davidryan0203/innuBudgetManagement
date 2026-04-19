const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/:budgetId/variance', analyticsController.getVarianceAnalysis);
router.get('/:budgetId/quarterly-comparison', analyticsController.getQuarterlyComparison);

module.exports = router;
