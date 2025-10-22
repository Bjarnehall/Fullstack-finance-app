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

async function pricesThirtyDaily(symbol) {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    const queryOptions = {
      period1: start,
      period2: end,
      interval: "1d"
  };

  const { quotes } = await yahooFinance.chart(symbol, queryOptions);

  return quotes;
}
stockInfo('GOOG').then(tickerInfo => console.log(tickerInfo));

pricesThirtyDaily('GOOG').then(quotes => console.log(quotes));
