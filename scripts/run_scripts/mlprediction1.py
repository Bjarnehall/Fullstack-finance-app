import io
import base64
import requests
import time
import random
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import matplotlib.dates as mdates
API_URL = "http://localhost:3006/api/ticker"

def predict_future_closes(df, n=7):
    if df.empty:
        return []
    df = df.copy()
    df['target'] = df['close'].shift(-1)
    df = df.dropna()
    model = RandomForestRegressor()
    model.fit(df[['open','high','low','close']], df['target'])
    last_row = df[['open','high','low','close']].iloc[-1].copy()
    preds = []
    for _ in range(n):
        input_row = pd.DataFrame([last_row], columns=['open','high','low','close'])
        next_close = model.predict(input_row)[0]
        preds.append(next_close)
        last_row[:] = next_close
    return preds

def save_chart_to_api(ticker, df_hist, future_preds):
    if df_hist.empty or not future_preds:
        print(f"{ticker} - No data to plot.")
        return

    plt.style.use("dark_background")
    plt.figure(figsize=(12,6), facecolor="#0d0d0d")

    hist_dates = df_hist['datetime']
    last_date = hist_dates.iloc[-1]

    pred_dates = pd.date_range(start=last_date, periods=len(future_preds)+1, freq='30min')[1:]

    plt.plot(hist_dates, df_hist['close'], label='Actual close', color='yellow', linewidth=2)
    plt.plot(pred_dates, future_preds, label='Predicted close', marker='o', color='cyan')
    plt.axvline(last_date, color='gray', linestyle='--')

    plt.legend()


    ax = plt.gca()
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d %H:%M'))
    ax.xaxis.set_major_locator(mdates.AutoDateLocator())

    for i, label in enumerate(ax.get_xticklabels()):
        if i % 2 != 0:
            label.set_visible(False)

    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close()

    payload = {"image": img_base64}
    try:
        response = requests.post(f"{API_URL}/save/mlchart/{ticker}", json=payload, timeout=10)
        if response.status_code == 200:
            try:
                print(f"{ticker} - API response:", response.json())
            except:
                print(f"{ticker} - API response not JSON. Raw:", response.text)
        else:
            print(f"{ticker} - Failed to save chart. Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        print(f"{ticker} - Exception during POST:", e)


def get_available_tickers():
    try:
        return requests.get(f"{API_URL}/get/available", timeout=10).json()
    except Exception as e:
        print("Failed to fetch available tickers:", e)
        return []

def get_thirtymin_ticker(ticker):
    try:
        return requests.get(f"{API_URL}/get/thirtymin/{ticker}", timeout=10).json()
    except Exception as e:
        print(f"Failed to fetch 30min data for {ticker}:", e)
        return []


tickers = get_available_tickers()
print("Tickers found:", tickers)

while True:
    for ticker in tickers:
        print(f"Processing {ticker}...")
        #data = get_thirtymin_ticker(ticker)
        #if not data:
            #continue
        data = get_thirtymin_ticker(ticker)

        # Ensure data is always a list of records
        if isinstance(data, dict):
            data = [data]
        elif not isinstance(data, list):
            print(f"{ticker} - Unexpected data format:", data)
            continue

        if not data:
            print(f"{ticker} - No data returned.")
            continue

        df = pd.DataFrame(data)
        df['datetime'] = pd.to_datetime(df['datetime'])
        df = df.sort_values('datetime')

        future_preds = predict_future_closes(df, n=7)
        df_hist = df.tail(min(30, len(df)))

        save_chart_to_api(ticker, df_hist, future_preds)


        time.sleep(random.randint(120, 300))

    print("Completed one full pass of all tickers. Sleeping before next pass...")
    time.sleep(random.randint(1100, 2100))
