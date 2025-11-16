import io
import base64
import requests
import time
import random
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np


API_URL = "http://localhost:3005/api/ticker"

pairs = [
        ["NVDA", 89, 41],
        ["TSLA", 31, 22],
        ["AAPL", 15, 21],
        ["MSFT", 40, 33],
        ["AMZN", 42, 28],
        ["AMD", 51, 56],
        ["GOOG", 18, 57],
        ["PLTR", 51, 57],
        ["META", 53, 28],
        ["TSM", 17, 54],
        ["KLAR", 43, 55],
        ["KO", 35, 13],
        ["GME", 10, 38],
        ["INTC", 39, 34],
        ["SPOT", 59, 38],
        ["AMC", 50, 34],
        ["PFE", 21, 26],
        ["NFLX", 42, 37],
        ["AVGO", 40, 53],
        ["TTWO", 59, 51],
        ["BABA", 31, 10],
        ["XPEV", 20, 11],
        ["MU", 10, 27],
        ["V", 31, 13],
        ["PEP", 21, 29],
        ["SOFI", 33, 28],
        ["BYND", 17, 23],
        ["ADBE", 57, 50],
        ["SMCI", 17, 22],
        ["PYPL", 59, 53],
        ["RBLX", 23, 14],
        ["JPM", 30, 25],
        ["BLK", 22, 28],
        ["NKE", 10, 15],
        ["LCID", 12, 17],
        ["WMT", 35, 42],
        ["T", 77, 83],
        ["MARA", 39, 10],
        ["XOM", 78, 73],
        ["SONY", 28, 16],
        ["CRWD", 26, 11],
        ["SBUX", 87, 74],
        ["ABCL", 94, 63],
        ["CVX", 57, 52],
        ["BAC", 25, 55],
        ["GS", 43, 25],
        ["AI", 16, 21],
        ["RTX", 34, 44],
        ["SHOP", 96, 90],
        ["UBER", 32, 23],
        ["CAT", 46, 66],
        ["COST", 24, 19],
    ]

def get_available_tickers():
    response = requests.get(f"{API_URL}/get/available")
    return response.json()

def get_thirtymin_ticker(url, ticker):
    response = requests.get(f"{url}/get/thirtymin/{ticker}")
    data = response.json()
    return data

def get_mavg_pair(ticker):
    for pair in pairs:
        if pair[0] == ticker:
            print(f"{pair[1]}-{pair[2]}")
            mavg1 = pair[1]
            mavg2 = pair[2]
            return mavg1, mavg2

tickers = get_available_tickers()


while True:
    for ticker in tickers:
        data = get_thirtymin_ticker(API_URL, ticker)
        mavg1, mavg2 = get_mavg_pair(ticker)

        df = pd.DataFrame(data)
        df['datetime'] = pd.to_datetime(df['datetime'])

        df["mavg1"] = df["close"].rolling(window=mavg1).mean()
        df["mavg2"] = df["close"].rolling(window=mavg2).mean()

        df["signal"] = np.where(df["mavg1"] > df["mavg2"], 1, 0)
        df["cross"] = df["signal"].diff()

        cross_rows = df[df["cross"].isin([1, -1])]
        if not cross_rows.empty:
            last_cross = cross_rows.iloc[-1]["cross"]
            heading = "BUY" if last_cross == 1 else "SELL"
        else:
            heading = "NO SIGNAL"

        golden = df[df["cross"] == 1]
        death = df[df["cross"] == -1]

        plt.style.use("dark_background")


        plt.figure(figsize=(11, 7), facecolor="#0d0d0d")
        plt.plot(df['datetime'], df['close'], linewidth=2, color="yellow", zorder=1)

        plt.scatter(golden["datetime"], golden["close"], marker="^", color="limegreen", s=280, label="Golden Cross", zorder=2)
        plt.scatter(death["datetime"], death["close"], marker="v", color="red", s=280, label="Death Cross", zorder=2)


        plt.tight_layout()

        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        buf.seek(0)

        img_base64 = base64.b64encode(buf.read()).decode("utf-8")
        buf.close()

        payload = {
            "image": img_base64
        }

        response = requests.post(f"{API_URL}/save/pricechart/{ticker}", json=payload)

        print(response.json())
        time.sleep(random.randint(60, 120))
    time.sleep(random.randint(500, 900))
