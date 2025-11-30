import requests
from flask import jsonify

class Research:
    """Class of Research
    Contain methods to format and do research
    on stockmarket data
    """
    def __init__(self):
        """Constructor
        Has url endpoints to external API
        """
        self.API_URL = "http://localhost:3005/api/ticker/get"
        self.price_data_endpoint = "/thirtymin/"
    
    def get_available_tickers(self):
        """Get available tickers
        Returns a number of tickers that is
        allowed to get data for from external API
        """
        response = requests.get(f"{self.API_URL}/available")
        return response.json()
    
    def get_thirtymin_price_data(self, ticker):
        """Get thirty minute price data from external API
        Returns datapoints: datetime, close, high, low, open, volume
        on a 30 min time frame atleast 100 days back often more data.
        """
        tickers = self.get_available_tickers()

        if ticker not in tickers:
            return jsonify({"message": "ticker not available"})
        else:
            response = requests.get(f"{self.API_URL}{self.price_data_endpoint}{ticker}")
            return response.json()

    def get_date_and_close(self, ticker):
        """Returns only datetime and close price
        from price data.
        """
        data = self.get_thirtymin_price_data(ticker)

        date_and_close = []

        for row in data:
            date_and_close.append((row['datetime'], row['close']))
        
        return date_and_close
    
    def get_close(self, ticker):
        """Returns only close price from price data.
        """
        data = self.get_date_and_close(ticker)
        close = []

        for row in data:
            close.append(row[1])
        
        return close
    
    def get_moving_average(self, ticker, period):
        """Takes period as an argument to calculate
        the average of that period calulated on close
        price. Returns close price and avrage over time.
        """
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
    
    def get_counter_trend_mavg_backtest_trades(self, ticker, period):
        """Backtest counter trend moving average strategy
        returns a list of historic trades.
        """
        close_mavg = self.get_moving_average(ticker, period)
        trades = []
        amount = 100
        total_profit = 0

        position = None
        entry_price = None

        prev_close, prev_mavg = close_mavg[0]

        for close, mavg in close_mavg[1:]:
            if position is None:
                if prev_close >= prev_mavg and close < mavg:
                    position = "long"
                    entry_price = close
                
                elif prev_close <= prev_mavg and close > mavg:
                    position = "short"
                    entry_price = close
            
            else:
                if position == "long" and close >= mavg:
                    profit = amount * ((close - entry_price) / entry_price)
                    trades.append(profit)
                    total_profit += profit
                    position = None

                elif position == "short" and close <= mavg:
                    profit = amount * ((entry_price - close) / entry_price)
                    trades.append(profit)
                    total_profit += profit
                    position = None
            
            prev_close, prev_mavg = close, mavg
        
        return total_profit, trades

    def get_counter_trend_mavg_backtest_stem_and_leaf(self, ticker, period):
        _, trades = self.get_counter_trend_mavg_backtest_trades(ticker, period)
        stem_leaf = {}

        for trade in trades:
            stem = int(trade)
            leaf = int(abs(trade - stem) * 10)
            if stem not in stem_leaf:
                stem_leaf[stem] = []
            stem_leaf[stem].append(leaf)
        
        for leaves in stem_leaf.values():
            leaves.sort()
        
        return stem_leaf


        



