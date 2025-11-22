import requests
from flask import jsonify

class Research:

    def __init__(self):
        self.API_URL = "http://localhost:3005/api/ticker/get"
        self.price_data_endpoint = "/thirtymin/"

    def greet(self, name):
        return f"hello, {name}"
    
    def get_available_tickers(self):
        response = requests.get(f"{self.API_URL}/available")
        return response.json()
    
    def get_thirtymin_price_data(self, ticker):
        tickers = self.get_available_tickers()

        if ticker not in tickers:
            return jsonify({"message": "ticker not available"})
        else:
            response = requests.get(f"{self.API_URL}{self.price_data_endpoint}{ticker}")
            return response.json()

    def get_date_and_close(self, ticker):
        data = self.get_thirtymin_price_data(ticker)

        date_and_close = []

        for row in data:
            date_and_close.append((row['datetime'], row['close']))
        
        return date_and_close
    
    def get_close(self, ticker):
        data = self.get_date_and_close(ticker)
        close = []

        for row in data:
            close.append(row[1])
        
        return close
    
    def get_moving_average(self, ticker, period):
        data = self.get_close(ticker)
        close_mavg = []

        for i in range(len(data)):
            if i + 1 >= period:
                start_index = i + 1 - period
                end_index = i + 1
                window = data[start_index:end_index]
                avg = sum(window) / period
                close_mavg.append((data[i], avg))
        
        return close_mavg


