import { useState, useEffect } from 'react';
import styled from 'styled-components';

function renderCandles(data, chartWidth, chartHeight, signals) {
  if (!data || data.length === 0) return null;

  const leftPadding = 60;
  const candleWidth = 6;
  const spacing = 2;


  const maxPrice = Math.max(...data.map(p => p.high)) * 1.03;
  const minPrice = Math.min(...data.map(p => p.low)) * 0.97;

  const priceLabels = 10;
  const priceStep = (maxPrice - minPrice) / (priceLabels - 1);
  const pricesToShow = Array.from({ length: priceLabels }, (_, i) => minPrice + i * priceStep);

  const priceToY = (price) => ((maxPrice - price) / (maxPrice - minPrice)) * chartHeight;

  return data.map((p, i) => {
    const x = leftPadding + i * (candleWidth + spacing);
    
    const yOpen = priceToY(p.open);
    const yClose = priceToY(p.close);
    const yHigh = priceToY(p.high);
    const yLow = priceToY(p.low);
    const bodyHeight = Math.abs(yOpen - yClose);
    const isUp = p.close >= p.open;

    return (
      <g key={i}>
        {/* Wick */}
        <line
          x1={x + candleWidth / 2}
          x2={x + candleWidth / 2}
          y1={yHigh}
          y2={yLow}
          stroke="white"
        />
        {/* Body */}
        <rect
          x={x}
          y={Math.min(yOpen, yClose)}
          width={candleWidth}
          height={bodyHeight || 1}
          fill={isUp ? "green" : "red"}
        />
        {/* Date Label */}
        {i >= 16 && i % 16 === 0 && (
        <text
            x={x + candleWidth / 2}
            y={chartHeight -5}
            fontSize="10"
            fill="white"
            textAnchor="middle"
        >
            {new Date(p.datetime).toLocaleString([], {
                month: '2-digit',
                day: '2-digit',
            })}
        </text>
        )}
        {/* Buy/Sell Markers */}
        {signals.map((signal, i) => {
        const index = data.findIndex(d => d.datetime === signal.datetime);
        if (index === -1) return null;

        const x = leftPadding + index * (candleWidth + spacing);

        const priceToY = (price) => ((maxPrice - price) / (maxPrice - minPrice)) * 320;

        const y = priceToY(signal.price);

        return (
            <line
            key={i}
            x1={x + candleWidth / 2}
            x2={x + candleWidth / 2}
            y1={y - 1000}
            y2={y + 1000}
            stroke={signal.type === 'BUY' ? '#285c06' : '#912a1c'}
            strokeWidth="1"
            />
        );
        })}
        {/* Last Signal Display */}
        {signals.length > 0 && (() => {
            const lastSignal = signals[signals.length - 1];
            return (
                <text
                    x={70}
                    y={58}
                    fontSize="20"
                    fill={lastSignal.type === 'BUY' ? '#48a10c' : '#ff6a56'}
                    
                >
                    {lastSignal.type} :  {lastSignal.price.toFixed(2)}
                </text>
            );
        })()}
        {pricesToShow.map((price, idx) => {
        const y = priceToY(price);
        return (
            <text
            key={idx}
            x={leftPadding - 15}
            y={y}
            fontSize="10"
            fill="white"
            textAnchor="end"
            dominantBaseline="middle"
            >
            {price.toFixed(2)}
            </text>
        );
        })}
      </g>
    );
  });
}

function CandleChart({ priceData , tickerSymbol}) {

    const [shortTermData, setShortTermData] = useState([]);
    const [signals, setSignals] = useState([]);

    const customPairs = [
        ["NVDA", 89, 41],
        ["TSLA", 31, 22],
        ["AAPL", 15, 21],
        ["MSFT", 40, 33],
        ["AMZN", 42, 28],
        ["AMD", 51, 56],
        ["GOOG", 18, 57],
        ["PLTR", 51, 57],
        ["META", 53, 28],
        ["TSM", 17, 54],
        ["KLAR", 43, 55],
        ["KO", 35, 13],
        ["GME", 10, 38],
        ["INTC", 39, 34],
        ["SPOT", 59, 38],
        ["AMC", 50, 34],
        ["PFE", 21, 26],
        ["NFLX", 42, 37],
        ["AVGO", 40, 53],
        ["TTWO", 59, 51],
        ["BABA", 31, 10],
        ["XPEV", 20, 11],
        ["MU", 10, 27],
        ["V", 31, 13],
        ["PEP", 21, 29],
        ["SOFI", 33, 28],
        ["BYND", 17, 23],
        ["ADBE", 57, 50],
        ["SMCI", 17, 22],
        ["PYPL", 59, 53],
        ["RBLX", 23, 14],
        ["JPM", 30, 25],
        ["BLK", 22, 28],
        ["NKE", 10, 15],
        ["LCID", 12, 17],
        ["WMT", 35, 42],
        ["T", 77, 83],
        ["MARA", 39, 10],
        ["XOM", 78, 73],
        ["SONY", 28, 16],
        ["CRWD", 26, 11],
        ["SBUX", 87, 74],
        ["ABCL", 94, 63],
        ["CVX", 57, 52],
        ["BAC", 25, 55],
        ["GS", 43, 25],
        ["AI", 16, 21],
        ["RTX", 34, 44],
        ["SHOP", 96, 90],
        ["UBER", 32, 23],
        ["CAT", 46, 66],
        ["COST", 24, 19],
    ];

    function chartSignals(priceData) {
        const subset = priceData.slice(-155);

        const pair = customPairs.find(p => p[0] === tickerSymbol);
        const period1 = pair ? pair[1] : 10;
        const period2 = pair ? pair[2] : 20;
        const { result, signals } = mavgAvg(subset, period1, period2);
        setShortTermData(result);
        setSignals(signals);
    }

    function mavgAvg (priceData, period1, period2) {

        const closes = priceData.map(d => d.close);

        const mavg1 = closes.map((_, i, arr) => {
            if (i < period1 - 1) return null;
            const window = arr.slice(i - period1 + 1, i + 1);
            const avg = window.reduce((sum, val) => sum + val, 0) / period1;
            return avg;
        });

        const mavg2 = closes.map((_, i, arr) => {
            if (i < period2 - 1) return null;
            const window = arr.slice(i - period2 + 1, i + 1);
            const avg = window.reduce((sum, val) => sum + val, 0) / period2;
            return avg;
        });

        const result = priceData.map((d, i) => ({
            ...d,
            mavg1: mavg1[i],
            mavg2: mavg2[i],
        }));

        console.log(result);
        

        const signals = [];
        for (let i = 1; i < result.length; i++) {
            const prev = result[i - 1];
            const curr = result[i];

            if (prev.mavg1 && prev.mavg2 && curr.mavg1 && curr.mavg2) {
            
            if (prev.mavg1 <= prev.mavg2 && curr.mavg1 > curr.mavg2) {
                signals.push({ type: 'BUY', datetime: curr.datetime, price: curr.close });
            }
            
            else if (prev.mavg1 >= prev.mavg2 && curr.mavg1 < curr.mavg2) {
                signals.push({ type: 'SELL', datetime: curr.datetime, price: curr.close });
            }
            }
        }

        console.log(signals);
        return { result, signals };
    }

    useEffect(() => {
        if (priceData.length > 0) {
            chartSignals(priceData);
        }
    }, [priceData]);


    return (
        <Wrapper>
            <svg width={1345} height={340} textRendering="geometricPrecision">
                {/* Background */}
                <rect width="100%" height="100%" fill="#000000" />
                {/* Lines */}
                <rect width="95%" height="0.2px" x="4%" y="10%" fill ="#ffffff3b" />
                <rect width="95%" height="0.2px" x="4%" y="21%" fill ="#ffffff3b" />
                <rect width="95%" height="0.2px" x="4%" y="31%" fill ="#ffffff3b" />
                <rect width="95%" height="0.2px" x="4%" y="41%" fill ="#ffffff3b" />
                <rect width="95%" height="0.2px" x="4%" y="52%" fill ="#ffffff3b" />
                <rect width="95%" height="0.2px" x="4%" y="62%" fill ="#ffffff3b" />
                <rect width="95%" height="0.2px" x="4%" y="73%" fill ="#ffffff3b" />
                <rect width="95%" height="0.2px" x="4%" y="83%" fill ="#ffffff3b" />
                {/* Lines */}
                <rect width="0.2px" height="95%" x="16.5%" fill ="#ffffff3b" />
                <rect width="0.2px" height="95%" x="28.5%" fill ="#ffffff3b" />
                <rect width="0.2px" height="95%" x="40.25%" fill ="#ffffff3b" />
                <rect width="0.2px" height="95%" x="52.25%" fill ="#ffffff3b" />
                <rect width="0.2px" height="95%" x="64.25%" fill ="#ffffff3b" />
                <rect width="0.2px" height="95%" x="76.25%" fill ="#ffffff3b" />
                <rect width="0.2px" height="95%" x="88%" fill ="#ffffff3b" />
                {renderCandles(shortTermData, 1345, 320, signals)}
                <rect width="100%" height="5%" fill="#0c0e11" />
                <rect width="100%" height="4%"  y="96%" fill="#0c0e11" />
            </svg>
        </Wrapper>
    );
}

const Wrapper = styled.section`

`;

export default CandleChart;
