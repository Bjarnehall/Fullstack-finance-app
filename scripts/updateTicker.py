import time
import requests
import random

API_URL = "http://localhost:3005/api/ticker/get"
file_name = "log_file.txt"

# Function to write a message to file.
def write_to_file(message):
    with open(file_name, "a") as filehandle:
        filehandle.write(message)

# Get all available tickers from API.
def get_available_tickers():
    response = requests.get(f"{API_URL}/available", timeout=10)
    return response.json()

# Call information ticker return status and
# write to file if status not 200 to log errors.
def get_information_ticker(url, ticker):
    response = requests.get(url, timeout=10)
    message = f"Call information: {ticker} -> {response.status_code}"
    print(message)
    if response.status_code != 200:
        write_to_file(message + "\n")

# Call prices from ticker return status and
# write to file if status not 200 to log errors.
def get_thirtymin_ticker(url, ticker):
    response = requests.get(url, timeout=10)
    message = f"Call thirtymin:   {ticker} -> {response.status_code}"
    print(message)
    if response.status_code != 200:
        write_to_file(message + "\n")

# Run program to update data and continuosly test API calls.
# Prevents API from rate limiting.
while True:
    tickers = get_available_tickers()

    for ticker in tickers:
        url_information = f"{API_URL}/information/{ticker}"
        url_thirty_min = f"{API_URL}/thirtymin/{ticker}"
        get_information_ticker(url_information, ticker)
        time.sleep(random.randint(12, 20))
        get_thirtymin_ticker(url_thirty_min, ticker)
        time.sleep(random.randint(12, 20))
    print("Sleeping...\n")
    time.sleep(random.randint(30, 60))