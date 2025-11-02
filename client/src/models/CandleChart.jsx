
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

function renderCandles(data, chartWidth, chartHeight) {
  if (!data || data.length === 0) return null;

  const leftPadding = 60;
  const candleWidth = 5;
  const spacing = 5;


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

function CandleChart({ priceData }) {

    const [shortTermData, setShortTermData] = useState([]);

    function chartPrices(priceData) {
        let priceForChart = [];
        let count = priceData.length - 1;
        for (let i = 0; i < 125; i++) {
            priceForChart.push(priceData[count]);
            count = count - 1;
        }
        setShortTermData(priceForChart.reverse());
    }

    useEffect(() => {
        if (priceData.length > 0) {
            chartPrices(priceData);
        }
    }, [priceData]);


    return (
        <Wrapper>
            <svg width={1345} height={340} textRendering="geometricPrecision">
                {/* Background */}
                <rect width="100%" height="100%" fill="#11151a" />
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
                {renderCandles(shortTermData, 1345, 320)}
                <rect width="100%" height="5%" fill="#0c0e11" />
                <rect width="100%" height="4%"  y="96%" fill="#0c0e11" />
            </svg>
        </Wrapper>
    );
}

const Wrapper = styled.section`

`;

export default CandleChart;
