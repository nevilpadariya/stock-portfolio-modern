import React from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer } from 'recharts';

interface HistoryItem {
  date: string;
  value: number;
}

interface PortfolioHistoryChartProps {
  history: HistoryItem[];
  loading?: boolean;
  error?: string | null;
}

const PortfolioHistoryChart: React.FC<PortfolioHistoryChartProps> = ({ 
  history, 
  loading = false,
  error = null 
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No portfolio history available yet. Check back tomorrow for trend data!
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Portfolio Value - 5 Day Trend
      </Typography>
      
      <Box sx={{ height: 300, width: '100%' }}>
        <ResponsiveContainer>
          <LineChart data={history} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date">
              <Label value="Date" offset={0} position="bottom" />
            </XAxis>
            <YAxis 
              label={{ value: 'Portfolio Value ($)', angle: -90, position: 'insideLeft' }}
              domain={['dataMin - 500', 'dataMax + 500']}
            />
            <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Portfolio Value']} />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4caf50"
              activeDot={{ r: 8 }}
              name="Portfolio Value"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default PortfolioHistoryChart;
