
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import CandleChart from './CandleChart';

function DetailedTicker({ ticker }) {

    const [priceData, setPriceData] = useState([]);

    async function fetchPrices() {
        try {
            const response = await fetch (`http://localhost:3005/api/ticker/get/thirtymin/${ticker}`);
            const priceData = await response.json();
/*             console.log(setPriceData); */
            setPriceData(priceData);
            
/*             chartPrices(priceData); */
        } catch (err) {
            console.error(`Could not get priceData from ${ticker}:`, err);
            setPriceData([]);
        }
    }

/*     function chartPrices(priceData) {
        let count = priceData.length - 1;
        for (let i = 0; i < 5; i++) {
            console.log(priceData[count]);
            count = count - 1;
        }
    } */

    useEffect(() => {
        if (ticker) {
            fetchPrices();
/*             chartPrices(); */
        }
    }, [ticker]);

    return (
        <Wrapper>
            <div className="price-chart">
                <div className="chart">
                    <p>prices {ticker}</p>
                    <CandleChart priceData={priceData} />
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
        background-color: var(--color-main-detail-mellow);
        height: 770px;
    }
    .data {
        background-color: var(--color-main-detail-mellow);
        margin-left: 15px;
        width: 230px;
        height: 407px;
    }
`;

export default DetailedTicker;
