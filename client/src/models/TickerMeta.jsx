import { useEffect, useState } from "react";
/* import styled from 'styled-components'; */
import styled from 'styled-components';

function TickerMeta({ ticker }) {
    const [dataMeta, setTickerMeta] = useState({});


    async function fetchTicker() {
        try {
            const response = await fetch (`http://localhost:3005/api/ticker/get/information/${ticker}`);
            const dataMeta = await response.json();
            setTickerMeta(dataMeta);
            console.log(dataMeta);
        } catch (err) {
            console.error(`Could not get metaData from ${ticker}:`, err);
            setTickerMeta([]);
            }
        }

    useEffect(() => {
        if (ticker) {
            fetchTicker();
        }
    }, [ticker]);

    return (
        <Wrapper>
            <div className="metaDash">
                <h4>{dataMeta.information?.displayName} </h4>
                <p>Analyst Rating: {dataMeta.information?.averageAnalystRating ? dataMeta.information.averageAnalystRating.split(" - ")[1] : "No data"}</p>
                <ul>
                    <li>{dataMeta.information?.currency} {dataMeta.information?.bid}</li>
                    <li>50 day AVG: {dataMeta.information?.fiftyDayAverage.toFixed(2)}</li>
                    <li>200 day AVG: {dataMeta.information?.twoHundredDayAverage.toFixed(2)}</li>
                    <li>200 daily Movement AVG: {dataMeta.information?.twoHundredDayAverageChangePercent.toFixed(2)}</li>
                    <li>Year to date high: {dataMeta.information?.fiftyTwoWeekHigh}</li>
                    <li>Year to date low: {dataMeta.information?.fiftyTwoWeekLow}</li>
                    <li>Dividend yield: {dataMeta.information?.dividendYield || "No dividend"}</li>
                    <li>Current year P/E: {dataMeta.information?.priceEpsCurrentYear ? dataMeta.information.priceEpsCurrentYear.toFixed(2) : "No data"}</li>
                    <li>Trailing year P/E: {dataMeta.information?.trailingPE ? dataMeta.information.trailingPE.toFixed(2) : "No data"}</li>
                    <li>Forward year P/E: {dataMeta.information?.forwardPE ? dataMeta.information.forwardPE.toFixed(2) : "No data"}</li>
                    <li>Market CAP: {(dataMeta.information?.marketCap / 1000000).toFixed(0)} M {dataMeta.information?.currency}</li>    
                </ul>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.section`
    .metaDash {
        background-color: #fdfda4;
        width: 90%;
        margin: 20px;
        padding: 15px;
    }
    .metaDash ul {
        background-color: yellow;
        width: 400px;
    }
`;

export default TickerMeta;
