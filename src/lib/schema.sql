-- Strategies table
CREATE TABLE IF NOT EXISTS strategies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Backtests table
CREATE TABLE IF NOT EXISTS backtests (
  id SERIAL PRIMARY KEY,
  strategy_id INTEGER REFERENCES strategies(id) ON DELETE CASCADE,
  initial_capital DECIMAL(15, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  final_value DECIMAL(15, 2),
  total_return DECIMAL(10, 4),
  max_drawdown DECIMAL(10, 4),
  sharpe_ratio DECIMAL(10, 4),
  total_trades INTEGER,
  winning_trades INTEGER,
  losing_trades INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market data table
CREATE TABLE IF NOT EXISTS market_data (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(10) NOT NULL,
  date DATE NOT NULL,
  open DECIMAL(15, 2) NOT NULL,
  high DECIMAL(15, 2) NOT NULL,
  low DECIMAL(15, 2) NOT NULL,
  close DECIMAL(15, 2) NOT NULL,
  volume BIGINT NOT NULL,
  UNIQUE(symbol, date)
);

-- Backtest trades table
CREATE TABLE IF NOT EXISTS backtest_trades (
  id SERIAL PRIMARY KEY,
  backtest_id INTEGER REFERENCES backtests(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  action VARCHAR(10) NOT NULL, -- 'BUY' or 'SELL'
  quantity INTEGER NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  total DECIMAL(15, 2) NOT NULL,
  portfolio_value DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_market_data_symbol_date ON market_data(symbol, date);
CREATE INDEX IF NOT EXISTS idx_backtests_strategy_id ON backtests(strategy_id);
CREATE INDEX IF NOT EXISTS idx_backtest_trades_backtest_id ON backtest_trades(backtest_id);
