const express = require('express');
const supplementalController = require('../controllers/supplementalController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/create', supplementalController.createSupplementalBudget);
router.put('/:supplementalBudgetId/approve', supplementalController.approveSupplementalBudget);
router.get('/list', supplementalController.getSupplementalBudgets);

module.exports = router;
