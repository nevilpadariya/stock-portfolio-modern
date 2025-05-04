import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Card,
  Grid,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  OutlinedInput,
  CircularProgress
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import MainLayout from '../components/MainLayout';
import TradingViewWidget from '../components/TradingViewWidget';
import { InvestmentStrategy } from '../types';
import apiService from '../services/api';

// Minimum investment amount
const MIN_INVESTMENT = 5000;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [strategies, setStrategies] = useState<InvestmentStrategy[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0,
    strategies: [] as InvestmentStrategy[]
  });
  const [errors, setErrors] = useState({
    amount: false,
    strategies: false
  });
  
  useEffect(() => {
    // Fetch available strategies
    const fetchStrategies = async () => {
      try {
        const response = await apiService.getStrategies();
        setStrategies(response.strategies);
      } catch (error) {
        console.error('Failed to fetch strategies:', error);
        // We'll handle errors more gracefully with Material UI snackbars in a production app
      }
    };
    
    fetchStrategies();
  }, []);
  
  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors({
        ...errors,
        [field]: false
      });
    }
  };
  
  // Validate current step
  const validateStep = (): boolean => {
    const newErrors = { ...errors };
    let isValid = true;
    
    if (activeStep === 0) {
      if (!formData.amount || formData.amount < MIN_INVESTMENT) {
        newErrors.amount = true;
        isValid = false;
      }
    } else if (activeStep === 1) {
      if (!formData.strategies.length || formData.strategies.length > 2) {
        newErrors.strategies = true;
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Go to next step
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  // Go to previous step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        setLoading(true);
        
        // Navigate to results page with query params
        const queryParams = new URLSearchParams();
        queryParams.set('amount', formData.amount.toString());
        formData.strategies.forEach((strategy) => {
          queryParams.append('strategy', strategy);
        });
        
        navigate(`/results?${queryParams.toString()}`);
      } catch (error) {
        console.error('Error navigating to results:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Steps content
  const steps = [
    {
      label: 'Investment Amount',
      icon: <MoneyIcon />,
      content: (
        <Box sx={{ mt: 2, mb: 2 }}>
          <FormControl fullWidth error={errors.amount} variant="outlined">
            <InputLabel htmlFor="amount-input">Investment Amount</InputLabel>
            <OutlinedInput
              id="amount-input"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              label="Investment Amount"
              type="number"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', Number(e.target.value))}
              inputProps={{ min: MIN_INVESTMENT }}
              placeholder="Minimum $5000"
            />
            {errors.amount && (
              <FormHelperText error>
                Please enter an amount of at least ${MIN_INVESTMENT}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
      ),
    },
    {
      label: 'Investment Strategy',
      icon: <TrendingUpIcon />,
      content: (
        <Box sx={{ mt: 2, mb: 2 }}>
          <FormControl fullWidth error={errors.strategies}>
            <InputLabel id="strategies-label">Investment Strategies</InputLabel>
            <Select
              labelId="strategies-label"
              id="strategies-select"
              multiple
              value={formData.strategies}
              onChange={(e) => handleInputChange('strategies', e.target.value)}
              label="Investment Strategies"
              renderValue={(selected) => (selected as string[]).join(', ')}
            >
              {strategies.map((strategy) => (
                <MenuItem 
                  key={strategy} 
                  value={strategy}
                  disabled={formData.strategies.length >= 2 && !formData.strategies.includes(strategy)}
                >
                  {strategy}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {errors.strategies 
                ? 'Please select 1 or 2 investment strategies'
                : 'Select up to 2 investment strategies'}
            </FormHelperText>
          </FormControl>
        </Box>
      ),
    },
    {
      label: 'Confirmation',
      icon: <CheckCircleIcon />,
      content: (
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Please confirm your investment details:
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography color="text.secondary">Investment Amount:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography fontWeight="medium">
                  ${formData.amount.toLocaleString()}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography color="text.secondary">Selected Strategies:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography fontWeight="medium">
                  {formData.strategies.join(' & ')}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      ),
    },
  ];
  
  return (
    <MainLayout title="Stock Portfolio Suggestion Engine">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel StepIconComponent={() => (
                    <Box sx={{ 
                      mr: 1, 
                      color: activeStep >= index ? 'primary.main' : 'text.disabled' 
                    }}>
                      {step.icon}
                    </Box>
                  )}>
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    {step.content}
                    <Box sx={{ mb: 2, mt: 2 }}>
                      <div>
                        {index > 0 && (
                          <Button
                            variant="outlined"
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                          >
                            Back
                          </Button>
                        )}
                        
                        {index < steps.length - 1 ? (
                          <Button
                            variant="contained"
                            onClick={handleNext}
                          >
                            Continue
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : undefined}
                          >
                            Submit
                          </Button>
                        )}
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            {activeStep === 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Investment Planning
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Start by entering the amount you'd like to invest. We recommend 
                  starting with at least ${MIN_INVESTMENT} for a well-diversified portfolio.
                </Typography>
                <Typography variant="body2" paragraph>
                  Your investment will be allocated across selected stocks based on their 
                  potential and alignment with your chosen investment strategies.
                </Typography>
              </>
            )}
            
            {activeStep === 1 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Choose Your Strategy
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Select up to two investment strategies that align with your financial goals.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>Ethical Investing</Typography>
                        <Typography variant="body2">
                          Focus on companies with strong environmental and social governance practices.
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>Growth Investing</Typography>
                        <Typography variant="body2">
                          Target companies with above-average growth potential.
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>Index Investing</Typography>
                        <Typography variant="body2">
                          Track market indices for stable, diversified returns.
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>Value Investing</Typography>
                        <Typography variant="body2">
                          Seek undervalued stocks with strong fundamentals.
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
            
            {activeStep === 2 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Almost There!
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Review your selections and submit to generate your personalized 
                  stock portfolio recommendations.
                </Typography>
                <Typography variant="body2" paragraph>
                  Our algorithm will analyze current market conditions and select 
                  stocks that best match your investment strategy and goals.
                </Typography>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Market Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Stay informed with real-time market data to make better investment decisions
        </Typography>
        <TradingViewWidget />
      </Card>
    </MainLayout>
  );
};

export default HomePage; 