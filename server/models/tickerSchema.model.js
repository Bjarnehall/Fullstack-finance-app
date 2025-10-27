/*
Shecma for ticker collection in mongoDB.
*/
const mongoose = require('mongoose');

// Define schema
const TickerSchema = mongoose.Schema(
    {
        // Information table
        information: {
            type: Object,
            required: true,
        },
        // Adds date for when data was added
        informationDate: {
            type: Date,
            default: Date.now,
        },
    },
);

const Ticker = mongoose.model("Ticker", TickerSchema);

module.exports = Ticker;
