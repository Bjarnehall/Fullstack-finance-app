const Ticker = require('../models/tickerSchema.model.js');
const { TWELVE } = require("../../keys.js");
const { startDateDays, getTwelveData} = require("../models/priceModel.js");

let startDate = startDateDays(10);
let timeframe = "45min";
let ticker = "AAPL";
let key = TWELVE;


async function main() {
	try {
		const data = await getTwelveData(ticker, timeframe, startDate, key);
		handleData(data);
	} catch (err) {
		console.error("Error:", err);
	}
}

function handleData(data) {
	console.log(data);
}

main();
