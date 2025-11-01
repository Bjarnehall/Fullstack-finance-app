
import styled from 'styled-components';

function DetailedTicker({ ticker }) {

    return (
        <Wrapper>
            <div className="price-chart">
                <div className="chart">
                    <p>prices {ticker}</p>
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
