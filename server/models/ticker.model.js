const mongoose = require('mongoose');

const TickerSchema = mongoose.Schema(
    {
        information: {
            type: [Object],
            required: true,
            validate: {
                validator: (arr) => arr.length === 1,
                message: 'Information should only contain one asset',
            },
        },
    },
);

const Ticker = mongoose.model("Ticker", TickerSchema);

module.exports = Ticker;
