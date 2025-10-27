const { TWELVE } = require("../../keys.js");
const { startDateDays } = require("../models/dataHelpers.js");
const http = require("https");

let date = startDateDays(60);

const options = {
	"method": "GET",
	"hostname": "api.twelvedata.com",
	"port": null,
	"path": `/time_series?apikey=${TWELVE}&symbol=AAPL&interval=45min&start_date=${date}&format=JSON`
};

const req = http.request(options, function (res) {
	const chunks = [];

	res.on("data", function (chunk) {
		chunks.push(chunk);
	});

	res.on("end", function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});

req.end();        