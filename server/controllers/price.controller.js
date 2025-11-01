const { checkIfPricesUpToDate, populateNewPrices, updatePrices } = require("../models/price.model.js");
const { getInformation } = require("../models/information.model.js");
const { availableTickers } = require("../variables/availableTickers.js");
const Ticker = require("../schemas/ticker.schema.js");

/*
Check if ticker is in available tickers, try to get ticker from collection tickers in
database. If ticker not in database get information data for ticker before proceed.
After information data is surley in collection check if price data is in collection
document, if no data fetch 100 days of new data from Twelvedata API and store in
collection. If already data fetch and store the missing data in collection.
*/
const getThirtyMinPrices = async (req, res) => {
	try {
		const { ticker } = req.params;
		console.log(`api/ticker/get/thirtymin/${ticker} was called`);

		if (!availableTickers.includes(ticker)) {
			return res.status(400).json({ error: "That ticker is not available" });
		}

		let tickerDoc = await Ticker.findOne({ "information.symbol": ticker });

		if (!tickerDoc) {
			tickerDoc = await getInformation(ticker);
		}

		if (!tickerDoc.thirtyMinPrices || tickerDoc.thirtyMinPrices.length === 0) {
			const result = await populateNewPrices(tickerDoc, ticker);
		if (!result.success) {
			return res.status(500).json({ error: result.error });
			}
		}

		if (checkIfPricesUpToDate(tickerDoc)) {
			return res.json(tickerDoc.thirtyMinPrices);
		}

		const result = await updatePrices(tickerDoc, ticker);
		if (!result.success) {
		return res.status(500).json({ error: result.error });
		}
		return res.json(result.sortedUnique);
	} catch (err) {
		res.status(500).json({ error: "Failed to get or update price data" });
	}
};

module.exports = { getThirtyMinPrices };
