const yahooFinance = require("yahoo-finance2").default;

async function stockInfo (symbol) {
    const { quotes } = await yahooFinance.search(symbol);
    const q = quotes[0];

    const tickerInfo = {
        name: q.shortname,
        type: q.quoteType,
        symbol: q.symbol,
        exchange: q.exchDisp,
        sector: q.sectorDisp,
        industry: q.industryDisp,
    };
    return tickerInfo;
}

stockInfo('AAPL').then(tickerInfo => console.log(tickerInfo));