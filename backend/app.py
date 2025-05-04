import os
import json
import requests
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
# Allow CORS from multiple origins
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
            
        if not isinstance(amount, (int, float)) or amount < 5001:
            return jsonify({"error": "Amount must be a number at least 5001"}), 400
            
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
        
        for strategy in strategies:
            if strategy not in STRATEGY_STOCKS:
                return jsonify({"error": f"Invalid strategy: {strategy}"}), 400
                
            stocks = STRATEGY_STOCKS[strategy]
            quotes = get_stock_quote(stocks)
            strategy_results.append({
                "strategy": strategy,
                "stocks": quotes
            })
        
        # Prepare response
        result = {
            "input": {
                "amount": amount,
                "strategies": strategies
            },
            "allocation": allocation,
            "results": strategy_results
        }
        
        return jsonify(result)
        
    except Exception as e:
        app.logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": "An internal server error occurred"}), 500

# Run the app
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=True) 