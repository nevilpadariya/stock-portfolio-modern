# Stock Portfolio Suggestion Engine - Frontend

A modern React application for generating and visualizing stock portfolio suggestions based on different investment strategies.

## Features

- Modern UI built with React 18, TypeScript, and Ant Design
- Responsive layout that works on desktop and mobile devices
- Interactive investment form with multi-step process
- Real-time stock visualizations with TradingView widget
- Dynamic stock charts using Recharts
- Clean, component-based architecture
- Type-safe development with TypeScript

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend server running (see the backend README)

### Installation

1. Navigate to the frontend directory:
   ```
   cd stock-portfolio-modern/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Page components
├── services/         # API and data services
├── types/            # TypeScript interfaces and types
├── utils/            # Utility functions
├── App.tsx           # Main application component
├── index.tsx         # Entry point
└── ...
```

## Main Components

- **StockCard**: Displays individual stock information with interactive details
- **TradingViewWidget**: Integrates the TradingView market overview widget
- **MainLayout**: Provides consistent layout structure for all pages

## Pages

- **HomePage**: Displays the investment form and market overview
- **ResultsPage**: Shows portfolio suggestions based on selected strategies

## API Integration

The frontend connects to the backend API for:
- Fetching available investment strategies
- Generating portfolio suggestions based on user inputs
- Getting real-time stock data

## Customization

You can customize the application by:

1. Modifying the theme in `App.css`
2. Changing the API endpoints in `services/api.ts`
3. Updating the investment strategies in the backend

## Deployment

To build the application for production:

```
npm run build
```

This will create optimized files in the `build` directory that can be deployed to any static hosting service.

## License

MIT 