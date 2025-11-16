import requests
import time
import random

API_URL = "http://localhost:3005/api/ticker/get"

def write_to_file(ticker, mavg1, mavg2, result, crossings):
    file_name = f"logs/mid/{ticker}.txt"
    with open(file_name, "a") as filehandle:
        filehandle.write(f"{ticker}\nNUMBER OF TRADES: {crossings}\nAVG TRADE: ${round(crossings/result, 2)}\nMAVG1: {mavg1}\nMAVG2: {mavg2}\nReturn ${result}\n----------------\n")

def get_available_tickers():
    response = requests.get(f"{API_URL}/available", timeout=10)
    return response.json()

def get_thirtymin_ticker(url, ticker):
    response = requests.get(url, timeout=10)
    data = response.json()
    return data

def calculate_mavg(prices, period):
    if len(prices) < period:
        return []
    return [sum(prices[i-period:i])/period for i in range(period, len(prices)+1)]

def test_mavg_combinations(ticker, data):
    closes = [candle['close'] for candle in data]
    periods = list(range(15, 90))
    results = []

    def simulate_crossover(short_mavg, long_mavg, closes_segment):
        position = 1
        entry_price = closes_segment[0]
        cash = 0
        trade_size = 100
        crossings = 0

        for i in range(len(short_mavg)):
            price = closes_segment[i]

            if short_mavg[i] > long_mavg[i] and position != 1:
                if position == -1:
                    cash += trade_size * (entry_price - price) / entry_price
                position = 1
                entry_price = price
                crossings += 1

            elif short_mavg[i] < long_mavg[i] and position != -1:
                if position == 1:
                    cash += trade_size * (price - entry_price) / entry_price
                position = -1
                entry_price = price
                crossings += 1

        final_price = closes_segment[-1]
        if position == 1:
            cash += trade_size * (final_price - entry_price) / entry_price
        elif position == -1:
            cash += trade_size * (entry_price - final_price) / entry_price

        return cash, crossings

    for p1 in periods:
        for p2 in periods:
            if p1 == p2 or abs(p1 - p2) < 7:
                continue

            short_mavg = calculate_mavg(closes, p1)
            long_mavg = calculate_mavg(closes, p2)
            min_len = min(len(short_mavg), len(long_mavg))
            cash1, crossings1 = simulate_crossover(
                short_mavg[-min_len:], long_mavg[-min_len:], closes[-min_len:]
            )

            short_mavg = calculate_mavg(closes, p2)
            long_mavg = calculate_mavg(closes, p1)
            min_len = min(len(short_mavg), len(long_mavg))
            cash2, crossings2 = simulate_crossover(
                short_mavg[-min_len:], long_mavg[-min_len:], closes[-min_len:]
            )

            if cash1 >= cash2:
                results.append((p1, p2, cash1, crossings1))
            else:
                results.append((p2, p1, cash2, crossings2))

    best = max(results, key=lambda x: x[2])

    write_to_file(ticker, best[0], best[1], round(best[2], 2), best[3])

while True:
    tickers = get_available_tickers()
    for ticker in tickers:
        url_thirty_min = f"{API_URL}/thirtymin/{ticker}"
        data = get_thirtymin_ticker(url_thirty_min, ticker)
        test_mavg_combinations(ticker, data)
        time.sleep(random.randint(10, 60))

    break

