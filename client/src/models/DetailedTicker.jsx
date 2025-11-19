
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import CandleChart from './CandleChart';

function DetailedTicker({ ticker }) {

    const [priceData, setPriceData] = useState([]);
    const [chartUrl, setChartUrl] = useState(null);
    const [mlChartUrl, setMlChartUrl] = useState(null);

    const lastFetch = useRef(0);
    const FETCH_LIMIT = 2000;

    async function fetchPrices() {
        const now = Date.now();
        const timeSinceFetch = now - lastFetch.current;

        if (timeSinceFetch < FETCH_LIMIT) {
            console.log("Skip fetch since recently called");
            return;
        }

        lastFetch.current = now;
        
        try {
            const response = await fetch (`http://localhost:3005/api/ticker/get/thirtymin/${ticker}`);
            const priceData = await response.json();
            setPriceData(priceData);

        } catch (err) {
            console.error(`Could not get priceData from ${ticker}:`, err);
            setPriceData([]);
        }
    }

    async function fetchChart() {
        if (!ticker) return;

        const url = `http://localhost:3005/api/ticker/get/fullchart/${ticker}`;
        setChartUrl(url)
    }

    async function fetchMlChart() {
        if (!ticker) return;

        const url = `http://localhost:3005/api/ticker/get/mlchart/${ticker}`;
        setMlChartUrl(url)
    }

    useEffect(() => {
        if (ticker) {
            fetchPrices();
            fetchChart();
            fetchMlChart();
        }
    }, [ticker]);

    return (
        <Wrapper>
            <div className="price-chart">
                <div className="chart">
                    <CandleChart priceData={priceData} tickerSymbol={ticker} />
                </div>
                <div className="fullchart">
                    <img src={chartUrl}></img>
                    <img src={mlChartUrl}></img>
                </div>
            </div>
            <div className="extra-data">
                <div className="data">
                    <p>This is extra data</p>   
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.section`
    .price-chart {
        color: var(--color-font-highlight);
        background-color: var(--color-main-light);
        width: 1375px;
        height: 800px;
        margin: 7px;
        padding: 15px;
        text-shadow: 1px 1px black;
        border-radius: 5px;
        margin-left: -14px;
    }
    .extra-data {
        margin-top: -430px;
        margin-left: -267px;
        color: var(--color-font-highlight);
        background-color: var(--color-main-light);
        width: 260px;
        height: 423px;
    }
    .chart {
        height: 340px;
        background-color: var(--color-main-dark);
    }
    .fullchart {
        background-color: var(--color-main-dark);
        display: flex;

    }
    .fullchart img {
        width: 50%;
        margin-left: auto;
    }
/*     .mlchart {
        height: 340px;
        display: flex;
    } */
    .data {
        background-color: var(--color-main-detail-mellow);
        margin-left: 15px;
        width: 230px;
        height: 407px;
    }
`;

export default DetailedTicker;
