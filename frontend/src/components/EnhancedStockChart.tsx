import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { useTheme as useCustomTheme } from '../context/ThemeContext';

interface ChartData {
  date: string;
  value: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

interface EnhancedStockChartProps {
  data: ChartData[];
  symbol: string;
  name?: string;
  color?: string;
  height?: number | string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  const theme = useTheme();
  
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const valueColor = payload[0].value && payload[0].value >= (data.open || 0) 
      ? theme.palette.success.main 
      : theme.palette.error.main;
      
    return (
      <Paper
        elevation={3}
        sx={{
          p: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          borderLeft: '4px solid',
          borderLeftColor: valueColor,
          minWidth: 180,
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          {label}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Close:
          </Typography>
          <Typography variant="body2" fontWeight="medium" color={valueColor}>
            ${payload[0].value?.toFixed(2)}
          </Typography>
        </Box>
        
        {data.open !== undefined && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Open:
            </Typography>
            <Typography variant="body2">
              ${data.open.toFixed(2)}
            </Typography>
          </Box>
        )}
        
        {data.high !== undefined && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              High:
            </Typography>
            <Typography variant="body2" color="success.main">
              ${data.high.toFixed(2)}
            </Typography>
          </Box>
        )}
        
        {data.low !== undefined && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Low:
            </Typography>
            <Typography variant="body2" color="error.main">
              ${data.low.toFixed(2)}
            </Typography>
          </Box>
        )}
        
        {data.volume !== undefined && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Volume:
            </Typography>
            <Typography variant="body2">
              {(data.volume / 1000000).toFixed(2)}M
            </Typography>
          </Box>
        )}
      </Paper>
    );
  }

  return null;
};

const EnhancedStockChart: React.FC<EnhancedStockChartProps> = ({
  data,
  symbol,
  name,
  color,
  height = 300
}) => {
  const theme = useTheme();
  const { darkMode } = useCustomTheme();
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number; data: ChartData | null }>({
    x: 0,
    y: 0,
    data: null
  });

  // Determine if the stock has increased or decreased
  const isPositive = data.length > 1 && data[data.length - 1].value >= data[0].value;
  const lineColor = color || (isPositive ? theme.palette.success.main : theme.palette.error.main);

  // Format data for better display
  const formattedData = data.map(item => ({
    ...item,
    value: Number(item.value)
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect();
      setHoverInfo({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        data: hoverInfo.data
      });
    }
  };

  return (
    <Box 
      ref={chartRef} 
      sx={{ 
        width: '100%', 
        height, 
        position: 'relative',
        '& .recharts-tooltip-cursor': {
          stroke: lineColor,
          strokeWidth: 1,
          strokeDasharray: '5 5',
        }
      }}
      onMouseMove={handleMouseMove}
    >
      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
        {name || symbol}
      </Typography>
      
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: lineColor, stroke: theme.palette.background.paper, strokeWidth: 2 }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default EnhancedStockChart; 