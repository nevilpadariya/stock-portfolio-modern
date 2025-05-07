import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  ShowChart,
  BarChart,
  Timeline,
  Assessment,
  Group
} from '@mui/icons-material';
import MainLayout from '../components/MainLayout';

const AboutPage: React.FC = () => {
  return (
    <MainLayout title="About Investmate">
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
          Welcome to Investmate
        </Typography>
        
        <Typography variant="body1" paragraph>
          Investmate is a modern stock portfolio suggestion engine designed to help investors make informed decisions 
          based on different investment strategies. Our platform provides personalized stock recommendations 
          tailored to your investment amount and preferred strategies.
        </Typography>
        
        <Typography variant="body1" paragraph>
          This project was developed as part of the CMPE 285 course at San Jose State University, focusing on 
          creating a practical application that applies financial technology concepts to real-world investment scenarios.
        </Typography>
      </Card>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Key Features
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Multiple Investment Strategies" 
                  secondary="Choose from Ethical, Growth, Index, Quality, and Value investing approaches"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <ShowChart color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Real-time Stock Data" 
                  secondary="Access current market prices and performance metrics"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <BarChart color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Smart Allocation" 
                  secondary="Intelligent distribution of funds across recommended stocks"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Timeline color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Portfolio Trend Analysis" 
                  secondary="Track your portfolio's performance with 5-day historical data"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Investment Strategies
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Ethical Investing
              </Typography>
              <Typography variant="body2">
                Focus on companies with strong environmental and social governance practices, including Apple (AAPL), 
                Tesla (TSLA), and Adobe (ADBE).
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Growth Investing
              </Typography>
              <Typography variant="body2">
                Target companies with above-average growth potential, including Oxford Lane Capital (OXLC), 
                Eagle Point Credit Company (ECC), and Advanced Micro Devices (AMD).
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Index Investing
              </Typography>
              <Typography variant="body2">
                Track market indices for stable, diversified returns with ETFs like Vanguard Total Stock Market (VTI), 
                Vanguard S&P 500 (VOO), and iShares Core 10+ Year USD Bond (ILTB).
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Quality Investing
              </Typography>
              <Typography variant="body2">
                Invest in companies with strong balance sheets and competitive advantages, including NVIDIA (NVDA), 
                Micron Technology (MU), and Cisco Systems (CSCO).
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Value Investing
              </Typography>
              <Typography variant="body2">
                Seek undervalued stocks with strong fundamentals, including Intel Corporation (INTC), 
                Alibaba Group (BABA), and General Electric (GE).
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Card sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom color="primary" align="center">
          Our Team
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, mx: 'auto', bgcolor: 'primary.main', mb: 2 }}>
              <Group fontSize="large" />
            </Avatar>
            <Typography variant="h6">CMPE 285 Team</Typography>
            <Typography variant="body1">Nevil, Nagaraj, Jeevan, Siri</Typography>
            <Typography variant="body2" color="text.secondary">
              San Jose State University
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            This project uses the Financial Modeling Prep API for real-time stock data.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Built with React, TypeScript, Material UI, and Flask.
          </Typography>
        </Box>
      </Card>
    </MainLayout>
  );
};

export default AboutPage;
