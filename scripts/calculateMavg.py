import requests
import time
import random

API_URL = "http://localhost:3005/api/ticker/get"
file_name = "mavg_pair.txt"


def write_to_file(ticker, mavg1, mavg2, result, crossings):
    with open(file_name, "a") as filehandle:
        filehandle.write(f"{ticker}\n TRADES: {crossings}\n MAVG1: {mavg1}\n MAVG2: {mavg2}\n Return ${result}\n")

def get_available_tickers():
    response = requests.get(f"{API_URL}/available", timeout=10)
    return response.json()


def get_thirtymin_ticker(url, ticker):
    response = requests.get(url, timeout=10)
    data = response.json()
    return data;

def calculate_mavg(prices, period):

    if len(prices) < period:
        return []
    return [sum(prices[i-period:i])/period for i in range(period, len(prices)+1)]


def test_mavg_combinations(ticker, data):

    closes = [candle['close'] for candle in data]


    periods = list(range(10, 100))
    results = []


    def simulate_crossover(short_mavg, long_mavg, closes_segment):
        
        position = 0
        cash = 0
        trade_size = 100
        crossings = 0

        for i in range(len(short_mavg)):
            price = closes_segment[i]
            if short_mavg[i] > long_mavg[i] and position == 0:
                position = 1
                buy_price = price
                crossings += 1
            elif short_mavg[i] < long_mavg[i] and position == 1:
                position = 0
                cash += trade_size * (price - buy_price) / buy_price
                crossings += 1

        return cash, crossings

    for p1 in periods:
        for p2 in periods:
            if p1 == p2:
                continue

            if abs(p1 -p2) < 5:
                continue

            short_mavg = calculate_mavg(closes, p1)
            long_mavg = calculate_mavg(closes, p2)
            min_len = min(len(short_mavg), len(long_mavg))
            short_mavg1 = short_mavg[-min_len:]
            long_mavg1 = long_mavg[-min_len:]
            closes_segment1 = closes[-min_len:]

            cash1, crossings1 = simulate_crossover(short_mavg1, long_mavg1, closes_segment1)

            short_mavg = calculate_mavg(closes, p2)
            long_mavg = calculate_mavg(closes, p1)
            min_len = min(len(short_mavg), len(long_mavg))
            short_mavg2 = short_mavg[-min_len:]
            long_mavg2 = long_mavg[-min_len:]
            closes_segment2 = closes[-min_len:]
            cash2, crossings2 = simulate_crossover(short_mavg2, long_mavg2, closes_segment2)

            if cash1 >= cash2:
                results.append((p1, p2, cash1, crossings1))
            else:
                results.append((p2, p1, cash2, crossings2))

    best = max(results, key=lambda x: x[2])

    print(f"Ticker: {ticker}, Best MAVG: {best[0]}-{best[1]}, Dollar Return: ${best[2]:.2f}, Crossings: {best[3]}")

    write_to_file(ticker, best[0], best[1], round(best[2], 2), best[3])

while True:
    tickers = get_available_tickers()

    for ticker in tickers:
        url_thirty_min = f"{API_URL}/thirtymin/{ticker}"
        data = get_thirtymin_ticker(url_thirty_min, ticker)
        test_mavg_combinations(ticker, data)
        time.sleep(random.randint(60, 90))
    print("Sleeping...\n")
    time.sleep(random.randint(60, 90))