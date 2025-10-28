import { useEffect, useState } from "react";
/* import styled from 'styled-components'; */

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
        <div>
            <h4>{dataMeta.information?.displayName} </h4>
            <p>Analyst Rating: {dataMeta.information?.averageAnalystRating.split(" - ")[1]}</p>
            <ul>
                <li>{dataMeta.information?.currency} {dataMeta.information?.bid}</li>
                <li>50 day AVG: {dataMeta.information?.fiftyDayAverage.toFixed(2)}</li>
                <li>200 day AVG: {dataMeta.information?.twoHundredDayAverage.toFixed(2)}</li>
                <li>Year to date high: {dataMeta.information?.fiftyTwoWeekHigh}</li>
                <li>Year to date low: {dataMeta.information?.fiftyTwoWeekLow}</li>
                <li>Dividend yield: {dataMeta.information?.dividendYield || "No dividend"}</li>
                <li>EPS current year: {dataMeta.information?.epsCurrentYear}</li>
                <li>EPS forward year: {dataMeta.information?.epsForward}</li>
                <li>EPS Last year: {dataMeta.information?.epsTrailingTwelveMonths}</li>
                <li>Market CAP: {(dataMeta.information?.marketCap / 1000000).toFixed(0)} M {dataMeta.information?.currency}</li>    
            </ul>
        </div>
    );
}

export default TickerMeta;
