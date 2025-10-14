import { useEffect, useState } from "react";
import styled from 'styled-components';

function TickerInformaiton({ symbol }) {
    const [ticker, setTicker] = useState([]);

    async function fetchTicker() {
        try {
            const response = await fetch (`http://localhost:3005/api/ticker/get/${symbol}`);

            const data = await response.json();

            setTicker(data);

        } catch (error) {
            console.error("Error fetching ticker:", error);
            setTicker([]);
        }
    }

    useEffect(() => {
        if (symbol) {
            fetchTicker();
        }
    }, [symbol]);

    const info = ticker.information?.[0];

    return (
        <Wrapper >
            <div className="ticker-information">
                <h4>{info?.name}</h4>
                <ul>
                    <li>Ticker: {info?.symbol}</li>
                    <li>Exchange: {info?.exchange}</li>
                    <li>Type: {info?.type}</li>
                    <li>Sector: {info?.sector}</li>
                    <li>Industry: {info?.industry}</li>
                </ul>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    .ticker-information {
        background-color: var(--color-main-light);
        color: var(--color-font-main);
        font-family:Verdana, Geneva, Tahoma, sans-serif;
        padding: 1rem;
        margin: 0.5rem;
        height: 180px;
        width: 420px;
    }
    .ticker-information ul {
        list-style: none;
        color: var(--color-font-highlight);
        font-size: 0.7rem;
    }
    h4 {
        margin-bottom: 0.5rem;
    }
`;

export default TickerInformaiton;
