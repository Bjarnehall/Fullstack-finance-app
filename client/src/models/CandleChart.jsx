
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

function CandleChart({ priceData }) {
/*     const [shortTermData, setShortTermData] = useState([]);

 */

/*     function chartPrices(priceData) {
        setShortTermData(priceData);
        let priceDataShortTerm = [];
        let count = shortTermData.length - 1;
        for (let i = 0; i < 5; i++) {
            console.log(shortTermData[count]);
            priceDataShortTerm.push(shortTermData[count]);
            count = count - 1;
        }
        setShortTermData(priceDataShortTerm);
    }


    useEffect(() => {
            chartPrices(priceData);
    }, [priceData]); */

    return (
        <Wrapper>
            {/* {shortTermData} */}
            here is price
        </Wrapper>
    );
}

const Wrapper = styled.section`

`;

export default CandleChart;
