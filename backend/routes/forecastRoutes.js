const express = require('express');
const forecastController = require('../controllers/forecastController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/generate', forecastController.generateForecast);
router.get('/list', forecastController.getForecasts);

module.exports = router;
