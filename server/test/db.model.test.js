const { expect } = require('chai');
const { describe, it } = require('mocha');
const mongoose = require('mongoose');
const { MONGOKEY } = require('../../keys.js');

const {
    findTicker
} = require("../models/db.model");
const {
    listAllTickers
} = require("../helpers/checks.helper.js");


describe("*findTicker* Use to find ticker in db", function () {

    this.timeout(20000);

    before(async function () {
        await mongoose.connect(MONGOKEY);
    });

    after(async function () {
        await mongoose.connection.close();
    });

    it("Check if all tickers used by system is in database", async function () {

        let tickers = listAllTickers();
        let promises = [];

        for(let i = 0; i < tickers.length; i++) {
            promises.push(findTicker(tickers[i]));
        }

        let documents = await Promise.all(promises);
        let storedSymbols = [];
        
        for (let i = 0; i < documents.length; i++) {
            storedSymbols.push(documents[i].information.symbol);
        }

        expect(storedSymbols).to.deep.equal(tickers);
    });
});