

const { expect } = require('chai');
const { describe, it } = require('mocha');
const mongoose = require('mongoose');
const { MONGOKEY } = require('../../keys.js');

const { 
    startDateDays,
    getTwelveData,
	checkIfPricesUpToDate,
	populateNewPrices,
	updatePrices,
	formatPriceData
} = require('../models/price.model');

describe("Check if startDateDays outputs a valid date for twelve data api", function () {

    it("Check if startDateDays outputs a valid date for twelve data api", async function () {
		const twelveDataDateString = startDateDays(10);
		let twelveCount = 0;

		for (let i = 0; i < twelveDataDateString.length; i++) {
			if (twelveDataDateString[i] === "%") {
				twelveCount += 1;
			}
		}

		const exampleDataDateString = "2025-11-28%2020%3A07%3A28";
		let exampleCount = 0;

		for (let i = 0; i < exampleDataDateString.length; i++) {
			if (exampleDataDateString[i] === "%") {
				exampleCount += 1;
			}
		}
		expect(exampleCount).to.equal(twelveCount);
		
	});
});

describe("Check if formatPriceData delivers", function () {

    it("", function () {
        const input = {
            meta: {
                symbol: 'MU',
                interval: '30min',
                currency: 'USD',
                exchange_timezone: 'America/New_York',
                exchange: 'NASDAQ',
                mic_code: 'XNGS',
                type: 'Common Stock'
            },
            values: [
                {
                    datetime: '2025-12-08 15:30:00',
                    open: '244.53',
                    high: '244.57',
                    low: '244',
                    close: '244.11',
                    volume: '13274'
                }
            ],
            status: 'ok'
        };

		const result = formatPriceData(input);

        const expected = [
            {
                datetime: new Date('2025-12-08 15:30:00'),
                open: 244.53,
                high: 244.57,
                low: 244,
                close: 244.11,
                volume: 13274
            }
        ];

		expect(result).to.deep.equal(expected);
	});
});