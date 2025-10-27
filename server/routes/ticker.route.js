const express = require('express');
const router = express.Router();
const { getTicker, getDailyPrices } = require('../controllers/ticker.controller.js');
const { getMetaDataTicker } = require("../controllers/metaData.controller.js");

/*
API route to get "meta-data" about a ticker.
*/
router.get("/get/information/:ticker", getMetaDataTicker);

router.get('/get/:symbol', getTicker);
router.get('/daily/:symbol', getDailyPrices);

module.exports = router;
