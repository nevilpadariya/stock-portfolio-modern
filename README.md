# Stock Portfolio Suggestion Engine

A modern full-stack application that generates stock portfolio suggestions based on different investment strategies using real-time market data.

![Stock Portfolio Suggestion Engine](https://img.shields.io/badge/Project-Stock_Portfolio-blue)
![Python](https://img.shields.io/badge/Backend-Python_Flask-green)
![React](https://img.shields.io/badge/Frontend-React_TypeScript-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Overview

This application helps users create a diversified stock portfolio based on their chosen investment strategies and investment amount. It:

1. Takes user input for investment amount (minimum $5,000)
2. Allows selection of up to two investment strategies
3. Generates stock recommendations based on those strategies
4. Displays detailed stock information with visualizations

The system uses Financial Modeling Prep API to fetch real-time stock data and provides visual representations of performance and portfolio distribution.

## Project Structure

```
stock-portfolio-modern/
├── backend/               # Flask API server
│   ├── app.py             # Main application file
│   ├── requirements.txt   # Python dependencies
│   └── ...
│
├── frontend/              # React TypeScript frontend
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── ...
│   ├── package.json       # Node.js dependencies
│   └── ...
│
└── README.md              # This file
```

## Key Features

- **Multiple Investment Strategies**:
  - Ethical Investing
  - Growth Investing
  - Index Investing
  - Quality Investing
  - Value Investing

- **Real-time Stock Data**:
  - Current price and change
  - Historical performance charts
  - Detailed stock information

- **Modern UI/UX**:
  - Clean, responsive design
  - Interactive visualizations
  - Guided multi-step form process

- **Robust Architecture**:
  - RESTful API design
  - Type-safe code with TypeScript
  - Error handling and validation

## Getting Started

### Prerequisites

- Python 3.8+ for the backend
- Node.js 16+ for the frontend
- Financial Modeling Prep API key (register at [financialmodelingprep.com](https://financialmodelingprep.com/developer))

### Setup and Installation

1. Clone the repository
2. Set up the backend:
   ```bash
   cd stock-portfolio-modern/backend
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env-example .env  # Edit .env and add your API key
   python app.py
   ```

3. Set up the frontend:
   ```bash
   cd stock-portfolio-modern/frontend
   npm install
   npm start
   ```

4. Visit [http://localhost:3000](http://localhost:3000) to use the application

See the individual README files in the backend and frontend directories for more detailed instructions.

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/strategies` - Get available investment strategies
- `POST /api/portfolio` - Generate portfolio suggestions

## Technologies Used

- **Backend**:
  - Flask (Python web framework)
  - Financial Modeling Prep API
  - RESTful API design

- **Frontend**:
  - React 18 with TypeScript
  - Material UI library
  - Recharts for data visualization
  - TradingView widget integration

## License

MIT

## Acknowledgments

- Financial data provided by [Financial Modeling Prep API](https://financialmodelingprep.com/)
- Market overview widget powered by [TradingView](https://www.tradingview.com/)

## Deployment

This project can be deployed for free using Render (backend) and Vercel (frontend).

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

For detailed deployment instructions, please see [DEPLOYMENT.md](DEPLOYMENT.md). 
