const Ticker = require("../schemas/ticker.schema.js");
const yahooFinance = require("yahoo-finance2").default;
const { yhApiRandomTimeLimit, yhApiQouteRequestLogMsg } = require("../helpers/rateLimit.helper.js");
yahooFinance.suppressNotices(['yahooSurvey']);


/*
Use Yahoofinance API to get 'qoute' data on given ticker.
Return data on ticker.
*/
async function getFinanceData (ticker) {
    const quote = await yahooFinance.quote(ticker);
    return quote;
}

/*
Checks current date, get information data from "ticker" cluster
in database. Check if data returned from collection or if its older than
one day. If the data is older than one day replace data with fresh data,
if no data get new data with getFinanceData and store in database collection.
Return data
*/
async function getInformation(ticker) {
    try {
        const now = new Date();
        
        // Limit the time for updates (1 -> 4 hours)
       //const hoursMultiply = Math.floor(Math.random() * 4) + 1;
        //const limitUpdateTime = hoursMultiply * 60 * 60 * 1000;

        let rateLimit = yhApiRandomTimeLimit();

        let financeData = await Ticker.findOne({ 'information.symbol': ticker });

        if (!financeData || (now - financeData.informationDate) > rateLimit) {
            const newData = await getFinanceData(ticker);

            // Log api calls to yahoo finance
            yhApiQouteRequestLogMsg(newData, now);

            if (financeData) {
                financeData.information = newData;
                financeData.informationDate = now;
                await financeData.save();
            
            } else {
                financeData = await Ticker.create({
                    information: newData,
                    informationDate: now,
                });
            }
        }

        return financeData;
    } catch (err) {
        console.error(err);
    }
}

module.exports = { getInformation, getFinanceData };
