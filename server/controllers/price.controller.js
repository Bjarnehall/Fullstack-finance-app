const { checkIfPricesUpToDate, populateNewPrices, updatePrices } = require("../models/price.model.js");
const { getInformation } = require("../models/information.model.js");
const { validateTicker } = require("../helpers/checks.helper.js");
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

		if (validateTicker(ticker) === "not-valid") {
			return res.status(400).json("That ticker is not available");
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
	} catch (error) {
		res.status(500).json({ message: error.message});
	}
};

const fs = require("fs");
const path = require("path");

const savePriceChart = (req, res) => {
	const { ticker } = req.params;
	const { image } = req.body;

	const chartDir = path.join(__dirname, "../charts");

	const fileName = `${ticker}-fullchart.png`;
	const filePath = path.join(chartDir, fileName);

	const imageBuffer = Buffer.from(image, "base64");

    fs.writeFile(filePath, imageBuffer, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to save chart" });
        }
        return res.json({ success: true, path: filePath });
    });
};

const saveMlChart = (req, res) => {
	const { ticker } = req.params;
	const { image } = req.body;

	const chartDir = path.join(__dirname, "../charts/ml");

	const fileName = `${ticker}-mlchart.png`;
	const filePath = path.join(chartDir, fileName);

	const imageBuffer = Buffer.from(image, "base64");

    fs.writeFile(filePath, imageBuffer, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to save chart" });
        }
        return res.json({ success: true, path: filePath });
    });
};

const getFullChart = (req, res) => {
	const { ticker } = req.params;

	const chartDir = path.join(__dirname, "../charts");
	const fileName = `${ticker}-fullchart.png`;
	const filePath = path.join(chartDir, fileName);

	return res.sendFile(filePath);

}

const getMlChart = (req, res) => {
	const { ticker } = req.params;

	const chartDir = path.join(__dirname, "../charts/ml");
	const fileName = `${ticker}-mlchart.png`;
	const filePath = path.join(chartDir, fileName);

	return res.sendFile(filePath);

}

module.exports = {
	getThirtyMinPrices,
	savePriceChart,
	getFullChart,
	saveMlChart,
	getMlChart
};
