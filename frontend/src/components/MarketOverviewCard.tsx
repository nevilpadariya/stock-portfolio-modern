import React, { useState } from 'react';
import {
  Card,
  Typography,
  Box,
  Tooltip,
  Paper,
  Fade,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import TradingViewWidget from './TradingViewWidget';

interface MarketValue {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const marketData: MarketValue[] = [
  { name: 'S&P 500', value: '5,346.92', change: '+0.74%', isPositive: true },
  { name: 'Dow 30', value: '39,069.11', change: '+0.56%', isPositive: true },
  { name: 'Nasdaq', value: '16,920.80', change: '+1.12%', isPositive: true },
  { name: 'Shanghai Composite', value: '3,088.87', change: '-0.34%', isPositive: false },
  { name: 'Nikkei 225', value: '38,623.56', change: '+0.18%', isPositive: true },
  { name: 'Gold', value: '2,334.10', change: '+0.45%', isPositive: true },
  { name: 'Crude Oil', value: '78.26', change: '-0.89%', isPositive: false },
  { name: 'EUR/USD', value: '1.0865', change: '+0.12%', isPositive: true }
];

const MarketOverviewCard: React.FC = () => {
  return (
    <Card sx={{ p: 3, position: 'relative' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Market Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Stay informed with real-time market data to make better investment decisions
      </Typography>

      {/* Quick value indicators */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: 1.5, 
          mb: 3,
          px: 2
        }}
      >
        {marketData.map((item) => (
          <Tooltip
            key={item.name}
            title={
              <Box sx={{ p: 0.5 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {item.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    Value:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {item.value}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    Change:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {item.isPositive ? 
                      <TrendingUpIcon fontSize="small" sx={{ color: 'success.main', mr: 0.5 }} /> : 
                      <TrendingDownIcon fontSize="small" sx={{ color: 'error.main', mr: 0.5 }} />
                    }
                    <Typography 
                      variant="body2" 
                      fontWeight="medium"
                      color={item.isPositive ? 'success.main' : 'error.main'}
                    >
                      {item.change}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            }
            arrow
            placement="bottom"
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 300 }}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  boxShadow: 3,
                  borderRadius: 1,
                  p: 1.5,
                  maxWidth: 'none',
                  border: '1px solid',
                  borderColor: (theme) => theme.palette.divider,
                  borderLeft: '4px solid',
                  borderLeftColor: item.isPositive ? 'success.main' : 'error.main',
                  '& .MuiTooltip-arrow': {
                    color: 'background.paper'
                  }
                }
              }
            }}
          >
            <Chip
              label={item.name}
              variant="outlined"
              icon={item.isPositive ? 
                <TrendingUpIcon fontSize="small" color="success" /> : 
                <TrendingDownIcon fontSize="small" color="error" />
              }
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderColor: item.isPositive ? 'success.light' : 'error.light',
                '&:hover': {
                  boxShadow: 2,
                  bgcolor: item.isPositive ? 'success.50' : 'error.50',
                  borderColor: item.isPositive ? 'success.main' : 'error.main',
                }
              }}
            />
          </Tooltip>
        ))}
      </Box>

      <TradingViewWidget />
    </Card>
  );
};

export default MarketOverviewCard; 