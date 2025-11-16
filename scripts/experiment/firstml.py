import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import requests
import matplotlib.pyplot as plt

API_URL = "http://localhost:3005/api/ticker/get"

# --------------------------
# Fetch data from API
# --------------------------
def get_available_tickers():
    response = requests.get(f"{API_URL}/available")
    return response.json()

def get_thirtymin_ticker(url, ticker):
    response = requests.get(f"{url}/thirtymin/{ticker}")
    data = response.json()
    return data

tickers = get_available_tickers()
data = get_thirtymin_ticker(API_URL, tickers[0])

# --------------------------
# Prepare DataFrame
# --------------------------
df = pd.DataFrame(data)

# Convert datetime column
df['datetime'] = pd.to_datetime(df['datetime'])

# Sort by time
df = df.sort_values('datetime')

# Create target: next close price
df['target'] = df['close'].shift(-1)

# Drop last row (no next price)
df = df.dropna()

# Features and target
X = df[['open', 'high', 'low', 'close']]
y = df['target']

# --------------------------
# Train/test split
# --------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, shuffle=False
)

# --------------------------
# Train RandomForest model
# --------------------------
model = RandomForestRegressor()
model.fit(X_train, y_train)

# --------------------------
# Evaluate model
# --------------------------
preds = model.predict(X_test)
print("MAE:", mean_absolute_error(y_test, preds))

# Predict next close using last known row
last_row = df[['open','high','low','close']].iloc[-1]
input_row = pd.DataFrame([last_row], columns=['open','high','low','close'])
next_close_prediction = model.predict(input_row)[0]
print("Predicted next close:", next_close_prediction)

# --------------------------
# Predict next N closes (multi-step)
# --------------------------
def predict_next_n(model, df, n=100):
    # Start with last real row
    last_row = df[['open','high','low','close']].iloc[-1].copy()
    predictions = []

    for i in range(n):
        # Keep feature names to avoid sklearn warning
        input_row = pd.DataFrame([last_row], columns=['open','high','low','close'])

        # Predict next close
        next_close = model.predict(input_row)[0]
        predictions.append(next_close)

        # Create synthetic next row
        last_row['open']  = next_close
        last_row['high']  = next_close
        last_row['low']   = next_close
        last_row['close'] = next_close

    return predictions

future_100 = predict_next_n(model, df, n=7)
print("Next 100 predicted closes:", future_100)

# Number of historical points to show
hist_points = 50

# Slice last 'hist_points' historical closes
df_slice = df.tail(hist_points)

# Generate future timestamps: extend beyond last historical datetime
future_dates = pd.date_range(
    start=df_slice['datetime'].iloc[-1] + pd.Timedelta(minutes=30),  # start after last real point
    periods=100,  # exactly 100 future points
    freq='30min'
)

plt.figure(figsize=(12,6))

# Historical indices
hist_idx = range(hist_points)
# Predicted indices
pred_idx = range(hist_points, hist_points + 7)

plt.plot(hist_idx, df_slice['close'], label='Actual close')
plt.plot(pred_idx, future_100, label='Predicted future close', marker='o')

plt.axvline(hist_points-1, color='gray', linestyle='--')  # optional separation line
plt.legend()
plt.xlabel('Index')
plt.ylabel('Price')
plt.title(f'Last {hist_points} closes + 100 predicted for {tickers[0]}')
plt.show()
