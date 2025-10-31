/* import { useEffect, useState } from "react";
import styled from 'styled-components';
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function TickerInformaiton({ symbol }) {
    const [ticker, setTicker] = useState([]);
    const [daily, setDaily] = useState([]); */

    /*
    fetch ticker information
    */
/*     async function fetchTicker() {
        try {
            const response = await fetch (`http://localhost:3005/api/ticker/get/${symbol}`);
            const data = await response.json();
            setTicker(data);
        } catch (error) {
            console.error("Error fetching ticker:", error);
            setTicker([]);
        }
    }

    async function fetchDaily() {
        try {
            const response = await fetch(`http://localhost:3005/api/ticker/daily/${symbol}`);
            const data = await response.json();
            setDaily(data);
        } catch (error) {
            console.error("Error fetching prices", error);
            setDaily([]);
        }
    }

    function getDateDaily (daily) {
        let dateAndClose = [];
        for (let i = 0; i < daily.length; i++) {
            let date = daily[i][0].substring(5, 10);
            let close = daily[i][4];
            dateAndClose.push({ date, close });
        }
        console.log(dateAndClose);
        return dateAndClose
    }

    const dateAndClose = getDateDaily (daily);


    const labels = [];
    const data = [];

    for (let i = 0; i < dateAndClose.length; i++) {
        labels.push(dateAndClose[i].date);
        data.push(dateAndClose[i].close);
    };


    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Closing Price",
                data: data,
                fill: false,
                backgroundColor: "yellow",
                borderColor: "yellow",
                borderWidth: 1,
                pointRadius: 0,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
        x: { 
            title: { display: true },
            ticks: {
                callback: function (value, index) {
                    return index % 4 === 0 ? this.getLabelForValue(value) : "";
                },
                maxRotation: 0,
            },
            grid: {
                color: "rgba(155, 189, 223, 0.233)" },
             },
        y: { 
            title: { display: true, text: "Price" },
            grid: {
                color: "rgba(155, 189, 223, 0.233)" },
            },
        },
    };

    useEffect(() => {
        if (symbol) {
            fetchTicker();
            fetchDaily ();
        }
    }, [symbol]);

    const info = ticker.information?.[0];

    return (
        <Wrapper >
            <div className="asset">
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
                <div className="chart">
                    <Line data={chartData} options={chartOptions} />
                </div>
                
            </div>
        </Wrapper>
    );
}; */

/* const Wrapper = styled.section`
    .asset {
        display: flex;
        background-color: var(--color-main-light);
        height: 260px;
        width: 840px;
        margin: 10px;
    }
    .ticker-information {
        color: var(--color-font-main);
        font-family:Verdana, Geneva, Tahoma, sans-serif;
        padding: 1rem;
        margin: 0.5rem;
        
    }
    .chart {
        margin-top: 20px;
        width: 65%;
        height: 90%;
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

export default TickerInformaiton; */
