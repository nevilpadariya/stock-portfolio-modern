import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Stock } from '../types';

interface StockCardProps {
  stock: Stock;
  amount: number;
}

const StockCard: React.FC<StockCardProps> = ({ stock, amount }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Determine if stock is positive or negative
  const isPositive = stock.change >= 0;
  
  // Icon and color based on performance
  const iconColor = isPositive ? 'success.main' : 'error.main';
  
  // Handle clicking on the card to show details
  const showDetails = async () => {
    setIsModalOpen(true);
    setIsLoading(true);
    setError(null);
    
    try {
      // Get stock history data from Financial Modeling Prep API
      const apiKey = 'nGNYeJajsvrBRZnZ4rq1Gmj7shiF9Ytf'; // Using the same API key as backend
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${stock.symbol}?timeseries=25&apikey=${apiKey}`
      );
      
      if (response.data && response.data.historical) {
        // Transform data for chart
        const transformedData = response.data.historical
          .slice(0, 25)
          .reverse()
          .map((item: any) => ({
            label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            close: item.close,
            open: item.open,
          }));
          
        setChartData(transformedData);
      } else {
        setError('No historical data available for this stock');
      }
    } catch (err) {
      setError('Failed to fetch stock history. Please try again later.');
      console.error('Error fetching stock history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card 
        className={`card-shadow ${isPositive ? 'card-positive' : 'card-negative'}`}
        sx={{ 
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={showDetails}
      >
        <CardHeader
          title={stock.companyName || stock.name || stock.symbol}
          titleTypographyProps={{ variant: 'h6', noWrap: true }}
          action={
            <IconButton aria-label="info">
              <InfoIcon />
            </IconButton>
          }
          sx={{ 
            pb: 1, 
            '& .MuiCardHeader-action': { m: 0 }
          }}
        />
        <CardContent sx={{ pt: 0, pb: 2, flex: 1 }}>
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="body2" color="text.secondary" component="span">
              Price:
            </Typography>
            <Typography variant="body1" component="span" sx={{ ml: 1 }}>
              ${stock.latestPrice || stock.price}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="body2" color="text.secondary" component="span">
              Investment:
            </Typography>
            <Typography variant="body1" component="span" sx={{ ml: 1 }}>
              ${Math.round(amount).toLocaleString()}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {isPositive ? (
              <ArrowUpIcon sx={{ color: 'success.main', mr: 1 }} />
            ) : (
              <ArrowDownIcon sx={{ color: 'error.main', mr: 1 }} />
            )}
            <Typography sx={{ color: iconColor, mr: 0.5 }}>
              ${Math.abs(stock.change).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({(stock.changePercent * 100).toFixed(2)}%)
            </Typography>
          </Box>
          
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              {stock.latestTime || new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {stock.companyName || stock.name || stock.symbol} ({stock.symbol})
          <IconButton
            aria-label="close"
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current Price:
                  </Typography>
                  <Typography variant="h6">
                    ${stock.latestPrice || stock.price}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isPositive ? (
                    <ArrowUpIcon sx={{ color: 'success.main', mr: 0.5 }} />
                  ) : (
                    <ArrowDownIcon sx={{ color: 'error.main', mr: 0.5 }} />
                  )}
                  <Typography sx={{ color: iconColor }}>
                    ${Math.abs(stock.change).toFixed(2)} ({(stock.changePercent * 100).toFixed(2)}%)
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ height: 350, width: '100%' }}>
                <ResponsiveContainer>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label">
                      <Label value="Date" offset={0} position="bottom" />
                    </XAxis>
                    <YAxis 
                      label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }} 
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      type="monotone"
                      dataKey="close"
                      stroke="#4caf50"
                      activeDot={{ r: 8 }}
                      name="Close Price"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="open" 
                      stroke="#1976d2" 
                      name="Open Price" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StockCard; 