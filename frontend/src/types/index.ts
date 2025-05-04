// Stock interface
export interface Stock {
  symbol: string;
  name?: string;
  companyName?: string;
  price: number;
  latestPrice?: number;
  change: number;
  changePercent: number;
  latestTime?: string;
}

// Investment strategy options
export type InvestmentStrategy = 
  | 'Ethical Investing'
  | 'Growth Investing'
  | 'Index Investing'
  | 'Quality Investing'
  | 'Value Investing';

// Portfolio allocation
export interface Allocation {
  amounts: number[];
}

// Strategy result
export interface StrategyResult {
  strategy: InvestmentStrategy;
  stocks: Stock[];
}

// Portfolio result
export interface PortfolioResult {
  input: {
    amount: number;
    strategies: InvestmentStrategy[];
  };
  allocation: Allocation;
  results: StrategyResult[];
}

// Form values
export interface PortfolioFormValues {
  amount: number;
  strategies: InvestmentStrategy[];
} 