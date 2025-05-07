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
  shares?: number;
  allocated_amount?: number;
  current_value?: number;
}

// Portfolio history item
export interface HistoryItem {
  date: string;
  value: number;
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
  strategy_value?: number;
}

// Portfolio result
export interface PortfolioResult {
  input: {
    amount: number;
    strategies: InvestmentStrategy[];
  };
  allocation: Allocation;
  results: StrategyResult[];
  portfolio_id?: string;
  total_value?: number;
  history?: HistoryItem[];
}

// Form values
export interface PortfolioFormValues {
  amount: number;
  strategies: InvestmentStrategy[];
} 