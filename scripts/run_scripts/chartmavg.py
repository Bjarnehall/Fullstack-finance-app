import io
import base64
import requests
import time
import random
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# DENNNA ÄR RÄTT
API_URL = "http://localhost:3006/api/ticker"


def get_available_tickers():
    response = requests.get(f"{API_URL}/get/available")
    return response.json()

def get_smaPairs():
    response = requests.get(f"{API_URL}/get/sma/pair", timeout=10)
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
pairs = get_smaPairs()


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
        time.sleep(random.randint(80, 180))
        
    time.sleep(random.randint(1200, 2000))
