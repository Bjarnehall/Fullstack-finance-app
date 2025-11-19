const { TWELVE } = require("../../keys.js");
const http = require("https");
const timeframe = "30min";
const key = TWELVE;

/*
Takes a number of days as an argument and returns a timestamp that is
valid for Twelvedata date comparision.
*/
function startDateDays (days) {
    const now = new Date();
    const daysBack = new Date(now);
    daysBack.setDate(now.getDate() - days);
    const formattedDate = daysBack.toISOString().slice(0, 19).replace('T', ' ');
    const startDate = encodeURIComponent(formattedDate);

    return startDate;
}

/*
Format price data from Tvelwe API response format to collection storage.
*/
function formatPriceData (priceData) {
	const prices = priceData.values.map(v => ({
		datetime: new Date(v.datetime),
		open: parseFloat(v.open),
		high: parseFloat(v.high),
		low: parseFloat(v.low),
		close: parseFloat(v.close),
		volume: parseInt(v.volume),
	}));
	return prices;
}

/*
Check if prices are up to date in db return true if time delta
less than 30 minutes.
*/
function checkIfPricesUpToDate (tickerDoc) {
	const lastUpdate = tickerDoc.thirtyMinPricesDate;
	const now = new Date();
	const diffMinutes = (now - lastUpdate) / (1000 * 60);

	if (diffMinutes < 30) {
		return true;
	} else {
		return false;
	}
}

/*
Takes ticker, timeframe, startDate and API key and get pricedata from Twelvedata
API and returnsa json response. 
*/
function getTwelveData(ticker, timeframe, startDate, key) {
	return new Promise((resolve, reject) => {
		const options = {
			"method": "GET",
			"hostname": "api.twelvedata.com",
			"port": null,
			"path": `/time_series?apikey=${key}&symbol=${ticker}&interval=${timeframe}&start_date=${startDate}&format=JSON`
		}

		const req = http.request(options, function (res) {
			const chunks = [];

			res.on("data", function (chunk) {
				chunks.push(chunk);
			});

			res.on("end", function () {
				const body = Buffer.concat(chunks).toString();
				const json = JSON.parse(body);
				resolve(json);
			});
		});

		req.end();
	});
}



/*
Function to populate a document in ticker collection with new data from
twelvedata API. Populate empty document with 100 days of 30 min data.
Return prices.
*/
async function populateNewPrices (tickerDoc, ticker) {
	const startDate = startDateDays(100);

	const getPriceData = await getTwelveData(ticker, timeframe, startDate, key);

	if (!getPriceData.values) {
		return { success: false, error: "Could not fetch new price data to store new prices" };
	}

	const prices = formatPriceData(getPriceData)
		.sort((a, b) => a.datetime - b.datetime);

	tickerDoc.thirtyMinPrices = prices;
	tickerDoc.thirtyMinPricesDate = new Date();
	await tickerDoc.save();

	return  { success: true, prices };
}

/*
Function to update a document in ticker collection with new data from
twelvedata API. Populate empty document with missing data of 30 min data.
Return prices.
*/
async function updatePrices (tickerDoc, ticker) {
	const lastPrice = tickerDoc.thirtyMinPrices[tickerDoc.thirtyMinPrices.length -1];
	const startDate = encodeURIComponent(lastPrice.datetime.toISOString().slice(0, 19).replace("T", " "));

	const getPricesData = await getTwelveData(ticker, timeframe, startDate, key);

	if (!getPricesData.values || getPricesData.values.length === 0) {
		console.log("Could not get any new prices from API but tried");
		return { success: true, sortedUnique: tickerDoc.thirtyMinPrices };
	}

	const newPrices = formatPriceData(getPricesData)
		.sort((a, b) => a.datetime - b.datetime);

		const filteredNewPrices = newPrices.filter(p => p.datetime > lastPrice.datetime);

		const now = new Date();

		if (filteredNewPrices.length > 0) {
			// Merge existing + new
			const merged = [...tickerDoc.thirtyMinPrices, ...filteredNewPrices];

		// Deduplicate by datetime (keep latest data per timestamp)
		const uniqueByDatetime = merged.reduce((map, price) => {
			map.set(price.datetime.getTime(), price); // use timestamp as unique key
			return map;
		}, new Map());

		// Sort chronologically again (optional but clean)
		const sortedUnique = Array.from(uniqueByDatetime.values())
			.sort((a, b) => a.datetime - b.datetime);

		// Save new data to collection document
		tickerDoc.thirtyMinPrices = sortedUnique;
		tickerDoc.thirtyMinPricesDate = now;
		await tickerDoc.save();

		return  { success: true, sortedUnique: tickerDoc.thirtyMinPrices };
	}
	return { success: true, sortedUnique: tickerDoc.thirtyMinPrices };
}

module.exports = { 
    startDateDays,
    getTwelveData,
	checkIfPricesUpToDate,
	populateNewPrices,
	updatePrices
};
