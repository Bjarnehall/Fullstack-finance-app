const { expect } = require('chai');
const {
    validateTicker
} = require('../helpers/checks.helper');

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