"""
Advanced Mock Market Data Server for StockFolio
Simulates realistic stock price movements.

Run:
python market_server.py

Server:ttp://localhost:7666
"""

from flask import Flask, jsonify
import random
import time
from datetime import datetime

app = Flask(__name__)

# Market state
MARKET_OPEN = True

# Stock configuration
STOCKS = {
    "RELIANCE": {"name": "Reliance Industries", "price": 2500},
    "TCS": {"name": "Tata Consultancy Services", "price": 3200},
    "INFY": {"name": "Infosys", "price": 1400},
    "HDFCBANK": {"name": "HDFC Bank", "price": 1600},
    "ICICIBANK": {"name": "ICICI Bank", "price": 900},
    "SBIN": {"name": "State Bank of India", "price": 600},
    "BHARTIARTL": {"name": "Bharti Airtel", "price": 800},
    "HCLTECH": {"name": "HCL Technologies", "price": 1100},
    "WIPRO": {"name": "Wipro", "price": 450},
    "ADANIPORTS": {"name": "Adani Ports", "price": 1200},
}

# Historical data storage
PRICE_HISTORY = {symbol: [] for symbol in STOCKS}


def simulate_market_movement():
    """Simulate realistic market movement"""
    global STOCKS

    market_trend = random.uniform(-0.002, 0.002)  # overall market trend

    for symbol, stock in STOCKS.items():

        current_price = stock["price"]

        # small random fluctuation
        movement = random.uniform(-0.01, 0.01)

        new_price = current_price * (1 + movement + market_trend)

        new_price = round(new_price, 2)

        change = round(new_price - current_price, 2)

        change_percent = round((change / current_price) * 100, 2)

        stock["previous_close"] = current_price
        stock["price"] = new_price
        stock["change"] = change
        stock["change_percent"] = change_percent
        stock["volume"] = random.randint(100000, 5000000)

        # store history
        PRICE_HISTORY[symbol].append({
            "time": datetime.now().isoformat(),
            "price": new_price
        })

        # keep last 100 points
        if len(PRICE_HISTORY[symbol]) > 100:
            PRICE_HISTORY[symbol].pop(0)


def generate_market_snapshot():
    """Generate API response format"""
    data = {}

    for symbol, stock in STOCKS.items():

        price = stock["price"]
        prev_close = stock.get("previous_close", price)

        data[symbol] = {
            "symbol": symbol,
            "name": stock["name"],
            "current_price": price,
            "previous_close": prev_close,
            "change": stock.get("change", 0),
            "change_percent": stock.get("change_percent", 0),
            "day_high": round(price * random.uniform(1.0, 1.02), 2),
            "day_low": round(price * random.uniform(0.98, 1.0), 2),
            "volume": stock.get("volume", 0),
            "timestamp": datetime.now().isoformat()
        }

    return data


@app.route("/market", methods=["GET"])
@app.route("/market/prices", methods=["GET"])
def get_market():
    return jsonify({
        "success": True,
        "market_open": MARKET_OPEN,
        "data": generate_market_snapshot(),
        "timestamp": datetime.now().isoformat()
    })


@app.route("/market/<symbol>", methods=["GET"])
def get_stock(symbol):

    symbol = symbol.upper()

    if symbol not in STOCKS:
        return jsonify({
            "success": False,
            "message": "Stock not found"
        }), 404

    stock = generate_market_snapshot()[symbol]

    return jsonify({
        "success": True,
        "data": stock
    })


@app.route("/market/history/<symbol>", methods=["GET"])
def get_history(symbol):

    symbol = symbol.upper()

    if symbol not in PRICE_HISTORY:
        return jsonify({
            "success": False,
            "message": "Stock not found"
        }), 404

    return jsonify({
        "success": True,
        "symbol": symbol,
        "history": PRICE_HISTORY[symbol]
    })


@app.route("/market/status", methods=["GET"])
def market_status():
    return jsonify({
        "market_open": MARKET_OPEN,
        "timestamp": datetime.now().isoformat()
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "mock-market-data"
    })


# Background market simulator
def run_market_simulator():
    while True:
        simulate_market_movement()
        time.sleep(1000)  # update every 1000 seconds


if __name__ == "__main__":

    import threading

    simulator_thread = threading.Thread(target=run_market_simulator)
    simulator_thread.daemon = True
    simulator_thread.start()

    print("=" * 50)
    print("StockFolio Mock Market Server")
    print("=" * 50)
    print("Server running at: http://localhost:7666")
    print("")
    print("Endpoints:")
    print("GET  /market")
    print("GET  /market/{symbol}")
    print("GET  /market/history/{symbol}")
    print("GET  /market/status")
    print("GET  /health")
    print("=" * 50)

    app.run(host="0.0.0.0", port=7666)