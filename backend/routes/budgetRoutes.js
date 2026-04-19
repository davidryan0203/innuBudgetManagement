const express = require('express');
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/create', budgetController.createBudget);
router.get('/list', budgetController.getBudgets);
router.get('/:id', budgetController.getBudgetById);
router.post('/line-item/add', budgetController.addLineItem);
router.get('/line-items/list', budgetController.getLineItems);
router.get('/transactions/list', budgetController.getTransactions);
router.post('/transaction/record', budgetController.recordTransaction);
router.put('/:budgetId/approve', budgetController.approveBudget);
router.put('/:budgetId/lock', budgetController.lockBudget);
router.get('/:budgetId/dashboard', budgetController.getDashboardMetrics);
router.get('/alerts/list', budgetController.getAlerts);

module.exports = router;
