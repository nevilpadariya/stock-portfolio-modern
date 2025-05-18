import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Typography,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import axios from 'axios';
import MainLayout from '../components/MainLayout';
import EnhancedStockChart from '../components/EnhancedStockChart';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  companyName: string;
  marketCap: number;
  volume: number;
  avgVolume: number;
  pe: number;
  eps: number;
  beta: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  description?: string;
}

interface ChartData {
  date: string;
  value: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

const StockDetailPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) {
        setError('No stock symbol provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const apiKey = '14chOYTjZ9ecu8iqCVPqYnzWE53RlwXI';
        
        // Fetch stock profile data
        const [quoteResponse, profileResponse, historicalResponse] = await Promise.all([
          // Get real-time quote
          axios.get(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`),
          
          // Get company profile
          axios.get(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKey}`),
          
          // Get historical data
          axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=90&apikey=${apiKey}`)
        ]);
        
        if (quoteResponse.data && quoteResponse.data.length > 0) {
          const quote = quoteResponse.data[0];
          const profile = profileResponse.data[0] || {};
          
          setStockData({
            symbol: quote.symbol,
            price: quote.price,
            change: quote.change,
            changePercent: quote.changesPercentage / 100,
            companyName: quote.name || profile.companyName,
            marketCap: quote.marketCap,
            volume: quote.volume,
            avgVolume: quote.avgVolume,
            pe: quote.pe,
            eps: quote.eps,
            beta: quote.beta,
            fiftyTwoWeekHigh: quote.yearHigh,
            fiftyTwoWeekLow: quote.yearLow,
            description: profile.description
          });
        } else {
          setError('Stock data not found');
        }
        
        // Process historical data for chart
        if (historicalResponse.data && historicalResponse.data.historical) {
          const transformedData = historicalResponse.data.historical
            .slice(0, 90)
            .reverse()
            .map((item: any) => ({
              date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              value: item.close,
              open: item.open,
              high: item.high,
              low: item.low,
              volume: item.volume
            }));
            
          setChartData(transformedData);
        }
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError('Failed to load stock data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStockData();
  }, [symbol]);
  
  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else {
      return `$${num.toLocaleString()}`;
    }
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return (
      <MainLayout title={`Loading ${symbol} Data`}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }
  
  if (error || !stockData) {
    return (
      <MainLayout title="Error">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Failed to load stock data'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={goBack}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </MainLayout>
    );
  }
  
  const isPositive = stockData.change >= 0;
  const iconColor = isPositive ? 'success.main' : 'error.main';
  
  return (
    <MainLayout title={`${stockData.companyName} (${stockData.symbol})`}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={goBack}
        sx={{ mb: 2 }}
      >
        Back to Previous Page
      </Button>
      
      <Card sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4">{stockData.companyName}</Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>{stockData.symbol}</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="h3" sx={{ mr: 2 }}>
                  ${stockData.price.toFixed(2)}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isPositive ? (
                    <ArrowUpIcon sx={{ color: 'success.main', mr: 0.5 }} />
                  ) : (
                    <ArrowDownIcon sx={{ color: 'error.main', mr: 0.5 }} />
                  )}
                  <Typography variant="h6" sx={{ color: iconColor, mr: 1 }}>
                    ${Math.abs(stockData.change).toFixed(2)}
                  </Typography>
                  <Typography variant="h6" sx={{ color: iconColor }}>
                    ({(stockData.changePercent * 100).toFixed(2)}%)
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                  <Typography variant="body1">{formatLargeNumber(stockData.marketCap)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">P/E Ratio</Typography>
                  <Typography variant="body1">{stockData.pe ? stockData.pe.toFixed(2) : 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Volume</Typography>
                  <Typography variant="body1">{stockData.volume.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">EPS</Typography>
                  <Typography variant="body1">${stockData.eps ? stockData.eps.toFixed(2) : 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">52-Week High</Typography>
                  <Typography variant="body1">${stockData.fiftyTwoWeekHigh.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">52-Week Low</Typography>
                  <Typography variant="body1">${stockData.fiftyTwoWeekLow.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Card>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Price History</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              90-day price history with detailed information on hover
            </Typography>
            
            <Box sx={{ height: 500 }}>
              {chartData.length > 0 ? (
                <EnhancedStockChart 
                  data={chartData}
                  symbol={stockData.symbol}
                  name={stockData.companyName}
                  height={450}
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography color="text.secondary">No historical data available</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {stockData.description && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Company Overview</Typography>
              <Typography variant="body1" paragraph>
                {stockData.description}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </MainLayout>
  );
};

export default StockDetailPage; 