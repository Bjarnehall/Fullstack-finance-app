#!/usr/bin/env python3

from flask import Flask
from flask import jsonify

# Import classes
from src.research import Research

app = Flask(__name__)

# Initiate research class
research = Research()

@app.route("/")
def main():
    """ Main route """
    return "Välkommen!"

@app.route("/available/tickers")
#Returns all tickers available to do research on
def return_tickers():
    tickers = research.get_available_tickers()

    return jsonify(tickers)

@app.route("/price_data/<ticker>")
#Returns full price data available on ticker
def return_price_data(ticker):
    return research.get_thirtymin_price_data(ticker)

@app.route("/date_and_close/<ticker>")
#Returns datetime and close pricedata
def return_date_and_close(ticker):
    data = research.get_date_and_close(ticker)
    return jsonify(data)

@app.route("/close/<ticker>")
#Returns close pricedata
def return_close(ticker):
    data = research.get_close(ticker)
    return jsonify(data)

@app.route("/close_mavg/<ticker>/<int:period>")
#Returns close and movingaverage over time of given period
def return_close_mavg(ticker, period):
    data = research.get_moving_average(ticker, period)
    return jsonify(data)

@app.route("/counter_trend_mavg_backtest/<ticker>/<int:period>")
def return_counter_trend_mavg_backtest(ticker, period):
    data = research.get_counter_trend_mavg_backtest_trades(ticker, period)
    return jsonify(data)

@app.route("/counter_trend_mavg_backtest_compare/<ticker>/<int:range1>/<int:range2>")
def return_counter_trend_mavg_backtest_on_range_of_mavg_periods(ticker, range1, range2):
    results = {}
    best_period = None
    best_profit = float("-inf")

    for period in range(range1, range2 + 1):
        total_profit, trades = research.get_counter_trend_mavg_backtest_trades(ticker, period)
        results[period] = {
            "total_profit": total_profit,
            "trades": trades
        }

        if total_profit > best_profit:
            best_profit = total_profit
            best_period = period
    
    return jsonify({
        "best_period": best_period,
        "best_total_profit": best_profit,
        #"all_results": results
    })

""" @app.route("/counter_trend_mavg_backtest_stem_leaf/<ticker>/<int:period>")
def return_counter_trend_mavg_backtest_stem_leaf(ticker, period):
    data = research.get_counter_trend_mavg_backtest_stem_and_leaf(ticker, period)
    return data """

@app.route("/counter_trend_mavg_backtest_stem_leaf/<ticker>/<int:period>")
def return_counter_trend_mavg_backtest_stem_leaf(ticker, period):
    stem_leaf = research.get_counter_trend_mavg_backtest_stem_and_leaf(ticker, period)
    
    # Build a readable chart as a string
    lines = []
    for stem in sorted(stem_leaf.keys()):
        leaves = " ".join(str(leaf) for leaf in stem_leaf[stem])
        lines.append(f"{stem} | {leaves}")
    
    chart = "\n".join(lines)
    
    # Return plain text for readability
    return chart, 200, {"Content-Type": "text/plain; charset=utf-8"}


if __name__ == "__main__":
    app.run()