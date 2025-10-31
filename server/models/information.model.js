const Ticker = require('./tickerSchema.model.js');
const yahooFinance = require("yahoo-finance2").default;
yahooFinance.suppressNotices(['yahooSurvey']);

/*
Get fincance meta data from ticker.
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
        const twelveHourTime = 12 * 60 * 60 * 1000;
        let financeData = await Ticker.findOne({ 'information.symbol': ticker });

        if (!financeData || (now - financeData.informationDate) > twelveHourTime) {
            const newData = await getFinanceData(ticker);

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

module.exports = { getInformation };
