//Unit tests for information.model.js
const { expect } = require('chai');
const { describe, it } = require('mocha');
const { getFinanceData } = require('../models/information.model.js');

describe("*getFinanceData* use to get 'qoute' data on ticker from YHfinance", function () {
    this.timeout(20000);
    
    it("Check if all tickers used by system is in database", async function () {

        const testTickers = ["AAPL", "TSLA", "PLTR"]
        let data = [];

        console.log("Fetching stockdata 'qoute' using YHfinance")

        for (let i = 0; i < testTickers.length; i++) {
            const qoutData = await getFinanceData(testTickers[i]);
            data.push(qoutData);
        }

        console.log("Checking that expected data is in result")

        for (let i = 0; i < data.length; i++) {
            expect(data[i].symbol).to.be.equal(testTickers[i]);
            console.log(`----expect ${data[i].symbol} == ${testTickers[i]}`);
        }

    });
});