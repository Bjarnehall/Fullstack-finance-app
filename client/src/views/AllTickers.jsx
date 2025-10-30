import TickerInformation from '../models/TickerInformation.jsx';
import TickerMeta from "../models/TickerMeta.jsx";
import {
  Menu,
} from '../views/index.js';
import styled from 'styled-components';

function AllTickers() {
  return (
    <Wrapper>
        <Menu />
        <div className="information-dashboard">
{/*             <TickerInformation symbol="AAPL" />
            <TickerInformation symbol="TSLA" /> */}
            <TickerMeta ticker="AAPL"/>
            <TickerMeta ticker="TSLA" />
            <TickerMeta ticker="XTRAF" />
            <TickerMeta ticker="NVDA" />
            <TickerMeta ticker="AMD" />
            <TickerMeta ticker="MRNA" />
            <TickerMeta ticker="CRM" />
            <TickerMeta ticker="GOOG" />
            <TickerMeta ticker="META" />
            <TickerMeta ticker="INTC" />
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