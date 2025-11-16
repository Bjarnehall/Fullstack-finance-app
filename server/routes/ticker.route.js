const express = require('express');
const router = express.Router();
const { getMetaDataTicker, getAvailableTickers } = require("../controllers/information.controller.js");
const { getThirtyMinPrices, savePriceChart, getFullChart, saveMlChart, getMlChart } = require("../controllers/price.controller.js");

/*
API route to return all available tickers.
*/
router.get("/get/available/", getAvailableTickers);
/*
API route to get "meta-data" about a ticker.
*/
router.get("/get/information/:ticker", getMetaDataTicker);
/*
API route to get 30min prices from a certain ticker.
Data goes at least 100 days back.
*/
router.get("/get/thirtymin/:ticker", getThirtyMinPrices);

router.post("/save/pricechart/:ticker", savePriceChart);

router.post("/save/mlchart/:ticker", saveMlChart);

router.get("/get/fullchart/:ticker", getFullChart);

router.get("/get/mlchart/:ticker", getMlChart);
module.exports = router;
