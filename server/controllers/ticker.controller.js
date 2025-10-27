const Ticker = require('../models/ticker.model.js');
const yahooFinance = require("yahoo-finance2").default;
/*
 * Fetches data from yahooFinance and return
 * meta data about ticker
*/
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
/*
 * Check if ticker is stored in database and return
 * meta data about ticker. If ticker does not exist
 * in database call fetchInformation and store the
 * data in database as new ticker.
*/
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
/*
 * Fetch 30 days daily price data from yahooFinance
 * and return the data as an array.
*/
async function fetchDailyPrices (symbol) {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    const queryOptions = {
        period1: start,
        period2: end,
        interval: "1d"
    };

    const { quotes } = await yahooFinance.chart(symbol, queryOptions);

  return quotes.map(q => [
    q.date,
    q.open,
    q.high,
    q.low,
    q.close,
    q.volume
  ]);
}
/*
 * Find ticker in database check if daily prices exist if not
 * use fetchDailyPrices to get prices and store them in database.
 * if prices check the data of prices available if older than toady
 * replace last 30 days of data with new and keep older records.
 */
const getDailyPrices = async (req, res) => {
    try {
        const { symbol } = req.params;
        let ticker = await Ticker.findOne({ 'information.symbol': symbol });
        
        if (!ticker) {
            console.log("That ticker is not available");
            return res.status(404).json({ message: "Ticker not found" });
        }

        let dailyPrices = ticker.daily || [];

        if (dailyPrices.length === 0) {
            const newDaily = await fetchDailyPrices(symbol);
            ticker.daily = newDaily;
            await ticker.save();
            return res.status(200).json(newDaily);
        }

        const latestDate = new Date(dailyPrices[dailyPrices.length -1][0]);
        const today = new Date();
        const isOutDated = latestDate.toDateString() !== today.toDateString();

        if (isOutDated) {
          console.log("Data is outdated");
          const newDaily = await fetchDailyPrices(symbol);

          const cutoffDate = new Date();
          cutoffDate.setDate(today.getDate() - 30);

          ticker.daily = dailyPrices.filter(p => new Date(p[0]) < cutoffDate);
          
          ticker.daily.push(...newDaily);
          await ticker.save();
      }
      res.status(200).json(ticker.daily);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

module.exports = {
    getTicker,
    getDailyPrices
};
