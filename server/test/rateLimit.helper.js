// Unit tests for rateLimit.helper.js

// Dependencies
const { expect } = require('chai');
const { describe, it } = require('mocha');

// Import functions
const { yhApiRandomTimeLimit } = require('../helpers/rateLimit.helper');


describe("*yhApiRandomTimeLimit* check that vaule is random", function () {
    it("", function () {
        for (let i = 0; i < 10; i++) {
            const time = yhApiRandomTimeLimit();
            let storedTime = 0;

            if (storedTime != 0) {
                expect(storedTime).to.not.equal(time);
                storedTime = time;
            }
        }
    });
});
