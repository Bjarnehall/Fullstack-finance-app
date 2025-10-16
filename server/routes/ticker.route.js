const express = require('express');
const router = express.Router();
const { getTicker, getDailyPrices } = require('../controllers/ticker.controller.js');

router.get('/get/:symbol', getTicker);
router.get('/daily/:symbol', getDailyPrices);

module.exports = router;
