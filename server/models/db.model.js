const Ticker = require("../schemas/ticker.schema.js");

/*
Find a full document by searchint for information.symbol
*/
async function findTicker(ticker) {
	let tickerDocument = await Ticker.findOne({ "information.symbol": ticker});
	return tickerDocument;
}

module.exports = {
    findTicker
};