const Ticker = require('../models/ticker.model.js');
const yahooFinance = require("yahoo-finance2").default;

async function fetchInformation (symbol) {
    const { quotes } = await yahooFinance.search(symbol);
    const q = quotes[0];

    return {
        name: q.shortname,
        type: q.quoteType,
        symbol: q.symbol,
        exchange: q.exchDisp,
        sector: q.sectorDisp,
        industry: q.industryDisp,
    };
}

const getTicker = async (req, res) => {
    try {
        const { symbol } = req.params;

        let data = await Ticker.findOne({ 'information.symbol': symbol });

        if (!data) {

            const tickerInfo = await fetchInformation(symbol);

            const newTicker = new Ticker({
                information: [tickerInfo],
            });

            data = await newTicker.save();
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getTicker,
};
