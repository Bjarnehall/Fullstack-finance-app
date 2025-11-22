const { expect } = require('chai');
const { describe, it } = require('mocha');
const {
    validateTicker,
    listAllTickers
} = require('../helpers/checks.helper');
/*
Unit tests for check.helper.js
*/
describe("validate ticker is in set", function () {
    it("return 'valid' if ticker in set", function () {
        const tickerInSet = validateTicker("AAPL")
        expect(tickerInSet).to.equal("valid");
    });
    it("return 'not-valid' if ticker not in set", function () {
        const tickerInSet = validateTicker("AAAAAA")
        expect(tickerInSet).to.equal("not-valid");
    });
});

describe("Available tickers is an array of tickers", function () {
    it("return an array", function () {
        const tickers = listAllTickers();
        expect(tickers).to.be.an("array");
    });
    it("array contains items of strings", function () {
        const tickers = listAllTickers();
        for (let i = 0; i < tickers.length; i++) {
            expect(tickers[i]).to.be.a("string");
        }
    });
});