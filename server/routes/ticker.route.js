const express = require('express');
const router = express.Router();
const { getTicker } = require('../controllers/ticker.controller.js');

router.get('/get/:symbol', getTicker);

module.exports = router;