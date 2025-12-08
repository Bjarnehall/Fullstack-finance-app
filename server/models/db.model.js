const Ticker = require("../schemas/ticker.schema.js");

/*
Find a full document by searching for information.symbol
*/
async function findTicker(ticker) {
	return await Ticker.findOne({ "information.symbol": ticker});
}

module.exports = {
    findTicker
};