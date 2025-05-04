# Stock Portfolio Suggestion Engine - Backend

A modern Flask API that provides stock portfolio suggestions based on different investment strategies.

## Features

- Get portfolio suggestions based on investment amount and strategies
- Uses Financial Modeling Prep API for real-time stock data
- Support for multiple investment strategies:
  - Ethical Investing
  - Growth Investing
  - Index Investing
  - Quality Investing
  - Value Investing

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd stock-portfolio-modern/backend
   ```
3. Create a virtual environment:
   ```
   python -m venv venv
   ```
4. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
5. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
6. Create a .env file from the example:
   ```
   cp .env-example .env
   ```
7. Edit the .env file and add your Financial Modeling Prep API key

### Running the Server

Start the development server:
```
python app.py
```

The server will run at http://localhost:5001 by default.

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/strategies` - Get available investment strategies
- `POST /api/portfolio` - Generate portfolio suggestions based on strategies and amount

### Example Request

```json
POST /api/portfolio
{
  "amount": 10000,
  "strategies": ["Ethical Investing", "Growth Investing"]
}
```

## License

MIT 