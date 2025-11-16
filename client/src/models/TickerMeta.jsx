
import { useEffect, useState, useRef } from "react";
import styled from 'styled-components';
import DetailedTicker from "./DetailedTicker";

function TickerMeta({ ticker, activeTicker, setActiveTicker }) {

    const [dataMeta, setTickerMeta] = useState({});
    const showDetail = activeTicker === ticker;
    const hidden = activeTicker && activeTicker !== ticker;

    const lastFetch = useRef(0);
    const FETCH_LIMIT = 2000;
    

    async function fetchTicker() {
        const now = Date.now();
        const timeSinceFetch = now - lastFetch.current;

        if (timeSinceFetch < FETCH_LIMIT) {
            console.log("Skip fetch since recently called");
            return;
        }

        lastFetch.current = now;

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

    function toggleDetail() {
        if (showDetail) {
            setActiveTicker(null);
        } else {
            setActiveTicker(ticker);
        }
    }

    return (
        <Wrapper>
            <div className="meta-wrapper" style={{ display: hidden ? "none" : "flex"}}>
            <div className="metaDash">
                <div className="metaHead">
                <h4>{dataMeta.information?.displayName} </h4>
                <p>Analyst Rating: 
                    <span style={{ fontWeight: "bold" }}>{dataMeta.information?.averageAnalystRating ? dataMeta.information.averageAnalystRating.split(" - ")[1] : "No data"}</span>
                </p>
                </div>
                <ul>
                    <li>
                        <span>{dataMeta.information?.currency}</span> 
                        <span style={{ color: "#9e876f" }}>{dataMeta.information?.bid}</span>
                    </li>
                    <li>
                        <span>50 day AVG: </span>
                        <span style={{ color: "#9e876f" }}>{dataMeta.information?.fiftyDayAverage ? dataMeta.information?.fiftyDayAverage.toFixed(2) : "No data"}</span>
                    </li>
                    <li>
                        <span>200 day AVG: </span>
                        <span style={{ color: "#9e876f" }}>{dataMeta.information?.twoHundredDayAverage ? dataMeta.information?.twoHundredDayAverage.toFixed(2) : "No data"}</span>
                    </li>
                    <li>
                        <span>Daily AVG Movment: </span>
                        <span style={{ color: "#9e876f" }}>{dataMeta.information?.twoHundredDayAverageChangePercent ? dataMeta.information?.twoHundredDayAverageChangePercent.toFixed(2) : "No data"} %</span>
                    </li>
                    <li>
                        <span>Year to date high: </span>
                        <span style={{ color: "#9e876f" }}>{dataMeta.information?.fiftyTwoWeekHigh}</span>
                    </li>
                    <li>
                        <span>Year to date low: </span>
                        <span style={{ color: "#9e876f" }}>{dataMeta.information?.fiftyTwoWeekLow}</span>
                    </li>
                    <li>
                        <span>Dividend yield: </span>
                        <span style={{ color: "#9e876f" }}>{dataMeta.information?.dividendYield || "No dividend"}</span>
                    </li>
                    <li>
                        <span>Current year P/E: </span>
                        <span style={{ color: "#9e876f" }}>{dataMeta.information?.priceEpsCurrentYear ? dataMeta.information.priceEpsCurrentYear.toFixed(2) : "No data"}</span>
                    </li>
                    <li>
                        <span>Trailing year P/E: </span>
                        <span style={{ color: "#9e876f" }}>{dataMeta.information?.trailingPE ? dataMeta.information.trailingPE.toFixed(2) : "No data"}</span>
                    </li>
                    <li>
                        <span>Forward year P/E: </span>
                        <span style={{ color: "#9e876f" }}>{dataMeta.information?.forwardPE ? dataMeta.information.forwardPE.toFixed(2) : "No data"}</span>
                    </li>
                    <li>
                        <span>Market CAP <small>in B {dataMeta.information?.currency}: </small></span>
                        <span style={{ color: "#9e876f" }}>{(dataMeta.information?.marketCap / 1000_000_000).toFixed(1)}</span>
                    </li>    
                </ul>
                <div className="metaDash-nav">
                    <button onClick={toggleDetail} className="metaDash-button" id="detail">Detailed view</button>
                    <button className="metaDash-button" id="favorite">Favorite</button>
                </div>

            </div>
            <div className="metaDash-details">
                {showDetail && <DetailedTicker ticker={ticker} />}
            </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.section`
    .meta-wrapper {
        display: flex;
    }
    .metaDash {
        color: var(--color-font-highlight);
        background-color: var(--color-main-light);
        width: 260px;
        margin: 7px;
        padding: 15px;
        text-shadow: 1px 1px black;
        border-radius: 5px;
    }
    .metaHead {
        color: #fff;
        font-size: 0.85em;
        background-color: var(--color-main-detail-mellow);
        padding: 7px;
        margin-bottom: -4px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        min-height: 70px;
    }
    .metaHead p {
        display: flex;
        justify-content: space-between;
    }
    ul {
        background-color: var(--color-main-dark);
        padding-top: 2px;
    }
    li {
        color: var(--color-main-lighter);
        display: flex;
        justify-content: space-between;
        width: 230px;
        padding-left: 5px;
        padding-right: 5px;
        margin-top: 4px;
        border-bottom: solid 1px var(--color-main-light);
        font-size: 0.85em;
    }
    .metaDash-nav {
        display: flex;
        justify-content: space-between;
        padding: 5px;
        background-color: var(--color-main-detail-mellow);
    }
    .metaDash-button {
        width: 45%;
        background-color: var(--color-main-detail);
        border: none;
        margin: 2px;
        padding: 2px;
    }
    .metaDash-button:hover {
        background-color: var(--color-main-light);
        color: var(--color-main-detail);
        cursor: pointer;
    }
`;

export default TickerMeta;
