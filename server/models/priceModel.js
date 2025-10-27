const http = require("https");

function startDateDays (days) {
    const now = new Date();
    const daysBack = new Date(now);
    daysBack.setDate(now.getDate() - days);
    const formattedDate = daysBack.toISOString().slice(0, 19).replace('T', ' ');
    const startDate = encodeURIComponent(formattedDate);

    return startDate;
}

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

module.exports = { 
    startDateDays,
    getTwelveData,
};

