const express = require('express');
const commitmentController = require('../controllers/commitmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/create', commitmentController.createCommitment);
router.get('/list', commitmentController.getCommitments);
router.put('/:commitmentId/status', commitmentController.updateCommitmentStatus);

module.exports = router;
