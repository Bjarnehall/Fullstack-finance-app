const fs = require("fs");
const path = require("path");
/*
Functions to help with rate limiting on external API,s.
*/

// Returns a value in seconds.
function yhApiRandomTimeLimit() {
    const multiplier = Math.floor(Math.random() * 3.5) + 1;
    let joker = (Number(Math.random().toFixed(10)));
    if (joker > 0.5) {
        joker = (joker + 1) * (-50)
    } else {
        joker = (joker + 1) * (50)
    }
    const limitUpdateTime = multiplier * 60 * 60 * 100 + joker;

    return limitUpdateTime;
}

// Write a log message for when qoute from yhfinance API is used.
function yhApiQouteRequestLogMsg(data, timeStamp) {
    console.log("yhfinance qoute was called");

    if (data.symbol) {
        const logFile = path.join(__dirname, "../logs/yhfinance/qoute.txt");
        const line = `Call qoute on yfinance: ${data.symbol}\nBid: ${data.bid}\nTime:${timeStamp}\n`

        fs.appendFile(logFile, line + "\n", (err) => {
            if (err) console.error("Failed to write log:", err);
        });
    }
}

module.exports = {
    yhApiRandomTimeLimit,
    yhApiQouteRequestLogMsg,
};