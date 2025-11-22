import requests
import time
import random
import re
import matplotlib.pyplot as plt
from datetime import datetime

def start_msg():
    print("hello, im a program")

API_URL = "http://localhost:3005/api/ticker/get"

# Function to get all tickers available in API
def get_available_tickers():
    response = requests.get(f"{API_URL}/available", timeout=10)
    return response.json()

# Function to get thirty minute datarows from API
def get_thirtymin_ticker(url):
    response = requests.get(url, timeout=10)
    data = response.json()
    return data

# Function to add moving average value to close price as a tuple pair
def moving_average(prices, period):
    close_mavg = []
    for i in range(len(prices)):
        if i + 1 >= period:
            start_index = i + 1 - period
            end_index = i + 1
            window = prices[start_index:end_index]
            avg = sum(window) / period
            close_mavg.append((close[i], avg))
    return close_mavg

# Function to track trades made with a single mavg strategy
def list_trades(close_mavg):
    trades = []
    amount = 100

    # If price below average take long position
    # If price over average take short position
    for close, mavg in close_mavg:
        if close < mavg:
            profit = amount * (mavg - close) / close
        else:
            profit = amount * (close - mavg) / close
        trades.append(profit)
    
    return trades

def plot_trades(date_and_close, trades):
    dates = [row[0] for row in date_and_close][-len(trades):]

    # Convert ISO strings with 'Z' to datetime objects
    dates = [
        datetime.strptime(d, "%Y-%m-%dT%H:%M:%S.%fZ") if isinstance(d, str) else d
        for d in dates
    ]

    # Format dates to only show year-month-day
    formatted_dates = [d.strftime("%Y-%m-%d") for d in dates]

    plt.figure(figsize=(12, 6))
    plt.scatter(formatted_dates, trades, c=['green' if t >= 0 else 'red' for t in trades], label='Trades')
    plt.axhline(0, color='black', linestyle='--')
    plt.xticks(formatted_dates[::50], rotation=45)
    plt.xlabel('Datetime')
    plt.ylabel('Profit/Loss per trade')
    plt.title('Trade simulation scatter plot')
    plt.legend()
    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    start_msg()
    
    # Store all tickers
    ticker = get_available_tickers()

    # Format url to get data on first ticker
    url_thirty_min = f"{API_URL}/thirtymin/{ticker[0]}"

    # Get data from ticker
    data = get_thirtymin_ticker(url_thirty_min)

    # Set a variable to hold date and close prices
    date_and_close = []

    # Append date and close prices to date_and_close
    for row in data:
        date_and_close.append((row['datetime'], row['close']))

    # Set a variable to hold only close prices
    close = []

    # Append close prices to variable
    for row in date_and_close:
        close.append(row[1])

    # Add moving average 10 to close prices
    close_mavg10 = moving_average(close, 20)

    #print(close_mavg10)

    trades = list_trades(close_mavg10)
    #print(trades)

    # Plot trades
    plot_trades(date_and_close, trades)