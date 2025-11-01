import { useState, useEffect } from "react";
import TickerMeta from "../models/TickerMeta.jsx";
import {
  Menu,
} from '../views/index.js';
import styled from 'styled-components';

function showTickers(tickers) {
    const tickerList = [];
    for (let i = 0; i < tickers.length; i++) {
      tickerList.push(<TickerMeta key={tickers[i]} ticker={tickers[i]} />)
    }
    return tickerList;
}

function AllTickers() {
  const [tickers, setTickers] = useState([]);

  const fetchTickers = () => {
    fetch("http://localhost:3005/api/ticker/get/available")
      .then(res => res.json())
      .then(data => setTickers(data));
  }

  useEffect(() => {
    fetchTickers();
  }, []);

    return (
      <Wrapper>
          <Menu />
          <div className="information-dashboard">
            {showTickers(tickers)}
          </div>
      </Wrapper>
    );
}

const Wrapper = styled.section`
    display: flex;
    .information-dashboard {
        display: flex;
        flex-wrap: wrap;
        max-width: 100%;
        height: 94vh;
        background-color: var(--color-main);
        padding: 1rem;
        overflow-y: auto;
    }
`;

export default AllTickers;