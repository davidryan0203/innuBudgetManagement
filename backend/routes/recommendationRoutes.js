const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/:budgetId/generate', recommendationController.generateRecommendations);
router.get('/list', recommendationController.getRecommendations);
router.put('/:recommendationId/status', recommendationController.updateRecommendationStatus);

module.exports = router;
