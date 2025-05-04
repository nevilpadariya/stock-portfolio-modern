import axios from 'axios';
import { InvestmentStrategy, PortfolioResult } from '../types';

// Create axios instance with defaults
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const apiService = {
  /**
   * Get health status of API
   */
  getHealth: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
  
  /**
   * Get available investment strategies
   */
  getStrategies: async (): Promise<{ strategies: InvestmentStrategy[] }> => {
    const response = await api.get('/strategies');
    return response.data;
  },
  
  /**
   * Generate portfolio suggestions
   */
  generatePortfolio: async (
    amount: number,
    strategies: InvestmentStrategy[]
  ): Promise<PortfolioResult> => {
    const response = await api.post('/portfolio', {
      amount,
      strategies,
    });
    return response.data;
  },
};

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server returned an error response
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('API Request Error:', error.request);
    } else {
      // Error setting up request
      console.error('API Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiService; 