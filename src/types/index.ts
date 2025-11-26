export interface Strategy {
  id: number;
  name: string;
  description?: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface Backtest {
  id: number;
  strategy_id: number;
  initial_capital: number;
  start_date: string;
  end_date: string;
  final_value?: number;
  total_return?: number;
  max_drawdown?: number;
  sharpe_ratio?: number;
  total_trades?: number;
  winning_trades?: number;
  losing_trades?: number;
  created_at: string;
}

export interface MarketData {
  id: number;
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BacktestTrade {
  id: number;
  backtest_id: number;
  date: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  portfolio_value: number;
  created_at: string;
}

export interface BacktestResult {
  backtest: Backtest;
  trades: BacktestTrade[];
  equity_curve: Array<{ date: string; value: number }>;
}

export interface StrategyContext {
  portfolio: {
    cash: number;
    positions: Map<string, { quantity: number; avgPrice: number }>;
  };
  data: MarketData[];
  currentDate: string;
  buy: (symbol: string, quantity: number) => void;
  sell: (symbol: string, quantity: number) => void;
  getPrice: (symbol: string) => number;
  getPosition: (symbol: string) => number;
  getSMA: (symbol: string, period: number) => number;
}
