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

module.exports = {
    validateTicker
};