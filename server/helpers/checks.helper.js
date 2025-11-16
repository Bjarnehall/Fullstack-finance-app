/*
Function to validate that requested ticker is one of the
availables.
*/
function validateTicker (ticker) {
    const { availableTickers } = require("../variables/availableTickers.js");
    let msg = "";

    if (availableTickers.includes(ticker)) {
        msg = "valid";
        return msg;
    } else {
        msg = "not-valid";
        return msg;
    }
}
/*
Function to return an array of all tickers available
*/
function listAllTickers () {
    const { availableTickers } = require("../variables/availableTickers.js");
    return availableTickers;
}

module.exports = {
    validateTicker,
    listAllTickers
};