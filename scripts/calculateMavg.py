import requests
import time
import random

API_URL = "http://localhost:3005/api/ticker/get"
file_name = "mavg_pair.txt"


def write_to_file(ticker, mavg1, mavg2, result, crossings):
    with open(file_name, "a") as filehandle:
        filehandle.write(f"{ticker}\n TRADES: {crossings}\n MAVG1: {mavg1}\n MAVG2: {mavg2}\n Return ${result}\n")



# Get all available tickers from API.
def get_available_tickers():
    response = requests.get(f"{API_URL}/available", timeout=10)
    return response.json()

# Call prices from ticker return status and
# write to file if status not 200 to log errors.
def get_thirtymin_ticker(url, ticker):
    response = requests.get(url, timeout=10)
    data = response.json()
    return data;

def calculate_mavg(prices, period):
    """Simple moving average over a given period."""
    if len(prices) < period:
        return []
    return [sum(prices[i-period:i])/period for i in range(period, len(prices)+1)]


def test_mavg_combinations(ticker, data):
    """
    Test all combinations of moving average periods for a ticker,
    simulating $100 per trade and returning the combination
    with the highest total profit in dollars.
    """
    # Extract close prices in chronological order
    closes = [candle['close'] for candle in data]

    # Define periods to test (replace or expand as desired)
    #periods = [1, 5, 50]  # you can use range(1, 51) for more exhaustive testing
    periods = list(range(10, 100))
    results = []


    def simulate_crossover(short_mavg, long_mavg, closes_segment):
        
        position = 0  # 0 = no position, 1 = long
        cash = 0
        trade_size = 100  # $100 per trade
        crossings = 0  # count how many times short crosses long

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

    # Test all period pairs both ways
    for p1 in periods:
        for p2 in periods:
            if p1 == p2:
                continue  # optional: skip identical periods

            if abs(p1 -p2) < 5:
                continue

            # Combination 1: p1 as short, p2 as long
            short_mavg = calculate_mavg(closes, p1)
            long_mavg = calculate_mavg(closes, p2)
            min_len = min(len(short_mavg), len(long_mavg))
            short_mavg1 = short_mavg[-min_len:]
            long_mavg1 = long_mavg[-min_len:]
            closes_segment1 = closes[-min_len:]
            #cash1 = simulate_crossover(short_mavg1, long_mavg1, closes_segment1)
            cash1, crossings1 = simulate_crossover(short_mavg1, long_mavg1, closes_segment1)

            # Combination 2: p2 as short, p1 as long
            short_mavg = calculate_mavg(closes, p2)
            long_mavg = calculate_mavg(closes, p1)
            min_len = min(len(short_mavg), len(long_mavg))
            short_mavg2 = short_mavg[-min_len:]
            long_mavg2 = long_mavg[-min_len:]
            closes_segment2 = closes[-min_len:]
            #cash2 = simulate_crossover(short_mavg2, long_mavg2, closes_segment2)
            cash2, crossings2 = simulate_crossover(short_mavg2, long_mavg2, closes_segment2)

            # Keep the better result
            if cash1 >= cash2:
                results.append((p1, p2, cash1, crossings1))
            else:
                results.append((p2, p1, cash2, crossings2))

    # Find the best combination overall
    best = max(results, key=lambda x: x[2])

    # Print and save the result in dollars
    #print(f"Ticker: {ticker}, Best MAVG: {best[0]}-{best[1]}, Dollar Return: ${best[2]:.2f}")
    print(f"Ticker: {ticker}, Best MAVG: {best[0]}-{best[1]}, Dollar Return: ${best[2]:.2f}, Crossings: {best[3]}")

    #write_to_file(ticker, best[0], best[1], round(best[2], 2))
    write_to_file(ticker, best[0], best[1], round(best[2], 2), best[3])

while True:
    tickers = get_available_tickers()

    for ticker in tickers:
        url_thirty_min = f"{API_URL}/thirtymin/{ticker}"
        """ time.sleep(random.randint(60, 90)) """
        data = get_thirtymin_ticker(url_thirty_min, ticker)
        """ print(data); """
        test_mavg_combinations(ticker, data)
        time.sleep(random.randint(60, 90))
    print("Sleeping...\n")
    time.sleep(random.randint(60, 90))