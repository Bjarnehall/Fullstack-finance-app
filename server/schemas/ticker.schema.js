/*
Shecma for ticker collection in mongoDB.
*/
const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
    datetime: { type: Date, required: true },
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
});

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
        thirtyMinPrices: [PriceSchema],
        thirtyMinPricesDate: {
            type: Date,
            default: Date.now,
        },
    },
);

const Ticker = mongoose.model("Ticker", TickerSchema);

module.exports = Ticker;
