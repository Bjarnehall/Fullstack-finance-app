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
        ["NVDA", 92, 46],
        ["TSLA", 20, 54],
        ["AAPL", 105, 97],
        ["MSFT", 88, 77],
        ["AMZN", 62, 20],
        ["AMD", 28, 19],
        ["GOOG", 92, 106],
        ["PLTR", 79, 32],
        ["META", 53, 29],
        ["TSM", 102, 94],
        ["KLAR", 99, 44],
        ["KO", 27, 16],
        ["INTC", 71, 95],
        ["SPOT", 59, 38],
        ["AMC", 50, 34],
        ["PFE", 21, 26],
        ["AVGO", 102, 54],
        ["TTWO", 93, 44],
        ["BABA", 41, 86],
        ["XPEV", 20, 11],
        ["MU", 27, 95],
        ["V", 31, 13],
        ["PEP", 21, 29],
        ["SOFI", 33, 28],
        ["BYND", 15, 24],
        ["ADBE", 93, 65],
        ["SMCI", 17, 22],
        ["PYPL", 59, 53],
        ["RBLX", 23, 14],
        ["JPM", 61, 28],
        ["BLK", 16, 25],
        ["NKE", 16, 24],
        ["LCID", 16, 80],
        ["WMT", 35, 42],
        ["T", 25, 103],
        ["MARA", 55, 69],
        ["XOM", 78, 73],
        ["ASML", 16, 44],
        ["CRWD", 27, 15],
        ["SBUX", 87, 74],
        ["ABCL", 45, 62],
        ["CVX", 45, 31],
        ["BAC", 19, 63],
        ["GS", 100, 92],
        ["AI", 16, 24],
        ["RTX", 34, 44],
        ["SHOP", 96, 90],
        ["UBER", 32, 23],
        ["CAT", 46, 66],
        ["COST", 26, 18],
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
        time.sleep(random.randint(100, 390))
    time.sleep(random.randint(1200, 3100))
