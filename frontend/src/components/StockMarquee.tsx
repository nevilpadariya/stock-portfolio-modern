import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';
import axios from 'axios';

// Styled component for the scrolling marquee effect
const StockScrollerContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  position: 'relative',
}));

const StockScroller = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1),
  animation: 'marquee 30s linear infinite',
  whiteSpace: 'nowrap',
  '&:hover': {
    animationPlayState: 'paused',
  },
  '@keyframes marquee': {
    '0%': { transform: 'translateX(0%)' },
    '100%': { transform: 'translateX(-50%)' }
  }
}));

const StockItem = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.action.hover,
  }
}));

interface Stock {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  companyName?: string;
}

const StockMarquee: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularStocks = async () => {
      try {
        // List of popular stock symbols
        const popularSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'V', 'DIS'];
        const apiKey = '14chOYTjZ9ecu8iqCVPqYnzWE53RlwXI'; // Updated to match backend API key
        
        // Fetch real-time quotes for these symbols
        const response = await axios.get(
          `https://financialmodelingprep.com/api/v3/quote/${popularSymbols.join(',')}?apikey=${apiKey}`
        );
        
        if (response.data && response.data.length) {
          const stockData = response.data.map((stock: any) => ({
            symbol: stock.symbol,
            price: stock.price,
            change: stock.change,
            changePercent: stock.changesPercentage / 100,
            companyName: stock.name
          }));
          setStocks(stockData);
        } else {
          setError('No stock data available');
        }
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError('Failed to load stock data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPopularStocks();
    
    // Refresh data every 60 seconds
    const refreshInterval = setInterval(fetchPopularStocks, 60000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Typography color="error" align="center">{error}</Typography>
    );
  }
  
  // Create duplicate list of stocks for continuous scrolling effect
  const scrollerStocks = [...stocks, ...stocks];
  
  return (
    <StockScrollerContainer>
      <StockScroller>
        {scrollerStocks.map((stock, index) => {
          const isPositive = stock.change >= 0;
          
          return (
            <StockItem 
              key={`${stock.symbol}-${index}`}
              onClick={() => handleStockClick(stock.symbol)}
              sx={{
                borderColor: isPositive ? 'success.light' : 'error.light',
                '&:hover': {
                  borderColor: isPositive ? 'success.main' : 'error.main',
                }
              }}
            >
              <Box sx={{ mr: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {stock.symbol}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ${stock.price.toFixed(2)}
                </Typography>
              </Box>
              
              <Chip
                size="small"
                icon={isPositive ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                label={`${isPositive ? '+' : ''}${stock.change.toFixed(2)} (${(stock.changePercent * 100).toFixed(2)}%)`}
                color={isPositive ? 'success' : 'error'}
                variant="outlined"
              />
            </StockItem>
          );
        })}
      </StockScroller>
    </StockScrollerContainer>
  );
};

export default StockMarquee; 