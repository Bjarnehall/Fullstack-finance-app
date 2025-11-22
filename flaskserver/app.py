#!/usr/bin/env python3

# Importera relevanta moduler
from flask import Flask
from flask import jsonify

from src.research import Research

app = Flask(__name__)

research = Research()


@app.route("/")
def main():
    """ Main route """
    return "Välkommen!"

@app.route("/plot_mavg_return/<int:num>", methods = ["GET"])
def scatter_return(num):
    return f"plot number {num}"

@app.route("/test/<name>")
def say_hello(name):
    return research.greet(name)

@app.route("/available/tickers")
def return_tickers():
    tickers = research.get_available_tickers()

    return jsonify(tickers)

@app.route("/price_data/<ticker>")
def return_price_data(ticker):
    return research.get_thirtymin_price_data(ticker)

@app.route("/date_and_close/<ticker>")
def return_date_and_close(ticker):
    data = research.get_date_and_close(ticker)
    return jsonify(data)

@app.route("/close/<ticker>")
def return_close(ticker):
    data = research.get_close(ticker)
    return jsonify(data)

@app.route("/close_mavg/<ticker>/<int:num>")
def return_close_mavg(ticker, num):
    data = research.get_moving_average(ticker, num)
    return jsonify(data)

if __name__ == "__main__":
    app.run()