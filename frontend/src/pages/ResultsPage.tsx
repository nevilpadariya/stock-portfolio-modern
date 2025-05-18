import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Box, 
  Card, 
  Grid, 
  CircularProgress, 
  Alert, 
  AlertTitle, 
  Typography, 
  Divider, 
  Paper,
  Button
} from '@mui/material';
import MainLayout from '../components/MainLayout';
import StockCard from '../components/StockCard';
import PortfolioHistoryChart from '../components/PortfolioHistoryChart';
import { PortfolioResult, InvestmentStrategy, Stock } from '../types';
import apiService from '../services/api';

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioResult | null>(null);
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Parse query parameters
        const params = new URLSearchParams(location.search);
        const amount = Number(params.get('amount'));
        const strategies = params.getAll('strategy') as InvestmentStrategy[];
        
        // Validate query parameters
        if (!amount || isNaN(amount) || amount < 4999) {
          setError('Invalid investment amount. Please enter at least $5,000.');
          setLoading(false);
          return;
        }
        
        if (!strategies || strategies.length === 0 || strategies.length > 2) {
          setError('Please select 1 or 2 investment strategies.');
          setLoading(false);
          return;
        }
        
        // Fetch portfolio data
        const result = await apiService.generatePortfolio(amount, strategies);
        setPortfolioData(result);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError('Failed to load portfolio data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [location.search]);
  
  // Render the stocks for a strategy
  const renderStrategyStocks = (
    strategyName: InvestmentStrategy, 
    stocks: Stock[], 
    allocations: number[]
  ) => {
    return (
      <Box key={strategyName} sx={{ mb: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {strategyName}
        </Typography>
        
        <Box className="card-grid" sx={{ mt: 3 }}>
          {stocks.map((stock, index) => (
            <StockCard 
              key={stock.symbol} 
              stock={stock} 
              amount={allocations[index] || 0} 
            />
          ))}
        </Box>
      </Box>
    );
  };
  
  return (
    <MainLayout title="Investment Portfolio Results">
      <Card sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Generating your portfolio...
            </Typography>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" component={Link} to="/" size="small">
                Return to home
              </Button>
            }
          >
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        ) : portfolioData ? (
          <>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <Typography component="span" fontWeight="bold">Investment Amount: </Typography>
                    ${portfolioData.input.amount.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Typography variant="body1">
                    <Typography component="span" fontWeight="bold">Strategies: </Typography>
                    {portfolioData.input.strategies.join(' & ')}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Divider sx={{ my: 3 }} />
            
            {portfolioData.results.map((result, index) => (
              <React.Fragment key={result.strategy}>
                {renderStrategyStocks(
                  result.strategy,
                  result.stocks,
                  portfolioData.allocation.amounts
                )}
                {index < portfolioData.results.length - 1 && (
                  <Divider sx={{ my: 4 }} />
                )}
              </React.Fragment>
            ))}
            
            {portfolioData.results.length === 0 && (
              <Alert severity="info" sx={{ my: 2 }}>
                <AlertTitle>No Results</AlertTitle>
                No stock recommendations available at this time.
              </Alert>
            )}
            
            {/* Portfolio History Chart */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" align="center" gutterBottom>
                Portfolio Value - 5 Day Trend
              </Typography>
              {portfolioData.history && portfolioData.history.length > 0 ? (
                <PortfolioHistoryChart history={portfolioData.history} />
              ) : (
                <Alert severity="info" sx={{ my: 2 }}>
                  <AlertTitle>Portfolio History</AlertTitle>
                  No historical data available yet. Check back tomorrow to see your portfolio trend!
                </Alert>
              )}
            </Box>
          </>
        ) : null}
      </Card>
    </MainLayout>
  );
};

export default ResultsPage; 