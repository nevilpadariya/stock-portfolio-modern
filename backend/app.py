import os
import json
import requests
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime, timedelta
import random

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
# Allow CORS from any origin in production
if os.environ.get('FLASK_ENV') == 'production':
    CORS(app)  # This allows all origins in production
else:
    # For development, restrict to localhost
    allowed_origins = [
        'http://localhost:3000',  # Local development
        'https://stock-portfolio-frontend.vercel.app',  # Vercel deployment
        os.getenv('CORS_ORIGINS', '')  # Additional origins from environment
    ]
    # Filter out empty strings
    allowed_origins = [origin for origin in allowed_origins if origin]
    CORS(app, origins=allowed_origins)

app.config['CORS_HEADERS'] = 'Content-Type'

# Get API key from environment variables or use default for development
API_KEY = os.getenv('API_KEY', 'nGNYeJajsvrBRZnZ4rq1Gmj7shiF9Ytf')

# Stock lists for different investment strategies
STRATEGY_STOCKS = {
    "Ethical Investing": ["AAPL", "TSLA", "ADBE"],
    "Growth Investing": ["OXLC", "ECC", "AMD"],
    "Index Investing": ["VOO", "VTI", "ILTB"],
    "Quality Investing": ["NVDA", "MU", "CSCO"],
    "Value Investing": ["INTC", "BABA", "GE"]
}

PORTFOLIO_HISTORY = {}

def get_stock_quote(stock_list):
    """
    Get stock quotes for a list of stock tickers from Financial Modeling Prep API
    
    Args:
        stock_list (list): List of stock ticker symbols
        
    Returns:
        list: List of stock data dictionaries
    """
    stock_quote = []
    
    for ticker in stock_list:
        try:
            # API URL for stock quotes
            url = f'https://financialmodelingprep.com/api/v3/quote/{ticker}?apikey={API_KEY}'
            
            # Make request to API
            response = requests.get(url, timeout=10)
            response.raise_for_status()  # Raise exception for 4XX/5XX responses
            
            data = response.json()
            
            if data and len(data) > 0:
                stock_quote.append(data[0])
            else:
                app.logger.error(f"No data available for {ticker}")
        except requests.exceptions.RequestException as e:
            app.logger.error(f"Error fetching data for {ticker}: {str(e)}")
    
    return stock_quote

def generate_portfolio_id(amount, strategies):
    """Generate a unique identifier for a portfolio based on amount and strategies"""
    # Sort strategies to ensure consistent IDs regardless of order
    sorted_strategies = sorted(strategies)
    return f"{amount}_{'-'.join(sorted_strategies)}"

def update_portfolio_history(portfolio_id, total_value):
    """Update the history of a portfolio with current value and generate sample history if needed"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    if portfolio_id not in PORTFOLIO_HISTORY:
        # Generate mock historical data for the last 5 days
        PORTFOLIO_HISTORY[portfolio_id] = []
        base_value = total_value * 0.95  # Start at 95% of current value
        
        # Generate data for past 4 days + today
        for i in range(4, -1, -1):
            past_date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
            # Small random fluctuation (±3%)
            fluctuation = random.uniform(-0.03, 0.03)
            past_value = base_value * (1 + fluctuation)
            base_value = past_value  # Each day builds on the previous
            
            # Add the historical data point
            PORTFOLIO_HISTORY[portfolio_id].append({
                "date": past_date,
                "value": round(past_value, 2)
            })
        
        # Set the last day (today) to the actual value
        PORTFOLIO_HISTORY[portfolio_id][-1] = {
            "date": today,
            "value": total_value
        }
    else:
        # If history exists, just update today's value
        # Check if today's entry exists
        if PORTFOLIO_HISTORY[portfolio_id][-1]["date"] == today:
            # Update today's value
            PORTFOLIO_HISTORY[portfolio_id][-1]["value"] = total_value
        else:
            # Add a new day
            PORTFOLIO_HISTORY[portfolio_id].append({
                "date": today,
                "value": total_value
            })
            # Keep only the last 5 entries (5 days of history)
            PORTFOLIO_HISTORY[portfolio_id] = PORTFOLIO_HISTORY[portfolio_id][-5:]
    
    return PORTFOLIO_HISTORY[portfolio_id]

def get_portfolio_history(portfolio_id):
    """Get the history of a portfolio"""
    if portfolio_id not in PORTFOLIO_HISTORY:
        return []
    
    return PORTFOLIO_HISTORY[portfolio_id]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy"}), 200

@app.route('/api/strategies', methods=['GET'])
def get_strategies():
    """Return available investment strategies"""
    return jsonify({
        "strategies": list(STRATEGY_STOCKS.keys())
    })

@app.route('/api/portfolio', methods=['POST'])
def generate_portfolio():
    """Generate portfolio recommendations based on selected strategies and amount"""
    try:
        # Get request data
        request_data = request.get_json()
        
        if not request_data:
            return jsonify({"error": "Invalid JSON data"}), 400
            
        strategies = request_data.get('strategies')
        amount = request_data.get('amount')
        
        # Validate input
        if not strategies or not amount:
            return jsonify({"error": "Strategies and amount are required"}), 400
            
        if not isinstance(amount, (int, float)) or amount < 5000:
            return jsonify({"error": "Amount must be a number at least 5000"}), 400
            
        if not isinstance(strategies, list) or len(strategies) > 2:
            return jsonify({"error": "Strategies must be a list with at most 2 items"}), 400
            
        # Generate portfolio allocation
        allocation = {
            "amounts": [
                amount * 0.5,   # 50% for first stock
                amount * 0.3,   # 30% for second stock
                amount * 0.2    # 20% for third stock
            ]
        }
        
        # Get stock quotes for each strategy
        strategy_results = []
        total_portfolio_value = 0
        
        for strategy in strategies:
            if strategy not in STRATEGY_STOCKS:
                return jsonify({"error": f"Invalid strategy: {strategy}"}), 400
                
            stocks = STRATEGY_STOCKS[strategy]
            quotes = get_stock_quote(stocks)
            
            # Calculate current value of these stocks
            strategy_value = 0
            for i, stock in enumerate(quotes):
                # Calculate shares based on allocation
                shares = allocation["amounts"][i] / stock["price"]
                current_value = shares * stock["price"]
                strategy_value += current_value
                
                # Add shares to stock info
                stock["shares"] = shares
                stock["allocated_amount"] = allocation["amounts"][i]
                stock["current_value"] = current_value
            
            total_portfolio_value += strategy_value
            
            strategy_results.append({
                "strategy": strategy,
                "stocks": quotes,
                "strategy_value": strategy_value
            })
        
        # Generate a unique portfolio ID
        portfolio_id = generate_portfolio_id(amount, strategies)
        
        # Update portfolio history
        history = update_portfolio_history(portfolio_id, total_portfolio_value)
        
        # Prepare response
        result = {
            "input": {
                "amount": amount,
                "strategies": strategies
            },
            "allocation": allocation,
            "results": strategy_results,
            "portfolio_id": portfolio_id,
            "total_value": total_portfolio_value,
            "history": history
        }
        
        return jsonify(result)
        
    except Exception as e:
        app.logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": "An internal server error occurred"}), 500

# Add a new endpoint to get portfolio history
@app.route('/api/portfolio/history/<portfolio_id>', methods=['GET'])
def portfolio_history(portfolio_id):
    """Get the history of a portfolio"""
    history = get_portfolio_history(portfolio_id)
    return jsonify({"history": history})

# Run the app
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=True) 