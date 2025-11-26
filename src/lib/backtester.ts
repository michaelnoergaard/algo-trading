import { MarketData, BacktestTrade, StrategyContext } from '@/types';

export interface BacktestConfig {
  strategyCode: string;
  symbol: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
}

export interface BacktestMetrics {
  finalValue: number;
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
}

export class Backtester {
  private marketData: MarketData[];
  private portfolio: {
    cash: number;
    positions: Map<string, { quantity: number; avgPrice: number }>;
  };
  private trades: BacktestTrade[];
  private equityCurve: Array<{ date: string; value: number }>;
  private currentDate: string;

  constructor(marketData: MarketData[], initialCapital: number) {
    this.marketData = marketData.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    this.portfolio = {
      cash: initialCapital,
      positions: new Map(),
    };
    this.trades = [];
    this.equityCurve = [];
    this.currentDate = '';
  }

  async run(strategyCode: string): Promise<{
    trades: BacktestTrade[];
    equityCurve: Array<{ date: string; value: number }>;
    metrics: BacktestMetrics;
  }> {
    // Create strategy function
    const strategyFunc = this.createStrategyFunction(strategyCode);

    // Run strategy for each day
    for (let i = 0; i < this.marketData.length; i++) {
      const currentData = this.marketData[i];
      this.currentDate = currentData.date;

      // Create context for strategy
      const context: StrategyContext = {
        portfolio: this.portfolio,
        data: this.marketData.slice(0, i + 1),
        currentDate: this.currentDate,
        buy: (symbol: string, quantity: number) => this.buy(symbol, quantity, currentData.close),
        sell: (symbol: string, quantity: number) => this.sell(symbol, quantity, currentData.close),
        getPrice: (symbol: string) => currentData.close,
        getPosition: (symbol: string) => this.getPosition(symbol),
        getSMA: (symbol: string, period: number) => this.calculateSMA(symbol, period, i),
      };

      // Execute strategy
      try {
        await strategyFunc(context);
      } catch (error) {
        console.error('Strategy execution error:', error);
      }

      // Record equity curve
      const portfolioValue = this.calculatePortfolioValue(currentData.close);
      this.equityCurve.push({
        date: this.currentDate,
        value: portfolioValue,
      });
    }

    // Calculate metrics
    const metrics = this.calculateMetrics();

    return {
      trades: this.trades,
      equityCurve: this.equityCurve,
      metrics,
    };
  }

  private createStrategyFunction(code: string): (context: StrategyContext) => Promise<void> {
    return new Function('context', `
      return (async () => {
        ${code}
      })();
    `) as any;
  }

  private buy(symbol: string, quantity: number, price: number): void {
    const cost = quantity * price;

    if (this.portfolio.cash < cost) {
      console.warn('Insufficient funds for purchase');
      return;
    }

    this.portfolio.cash -= cost;

    const position = this.portfolio.positions.get(symbol) || { quantity: 0, avgPrice: 0 };
    const totalQuantity = position.quantity + quantity;
    const avgPrice = ((position.quantity * position.avgPrice) + (quantity * price)) / totalQuantity;

    this.portfolio.positions.set(symbol, {
      quantity: totalQuantity,
      avgPrice,
    });

    const portfolioValue = this.calculatePortfolioValue(price);

    this.trades.push({
      id: this.trades.length + 1,
      backtest_id: 0, // Will be set when saved to DB
      date: this.currentDate,
      symbol,
      action: 'BUY',
      quantity,
      price,
      total: cost,
      portfolio_value: portfolioValue,
      created_at: new Date().toISOString(),
    });
  }

  private sell(symbol: string, quantity: number, price: number): void {
    const position = this.portfolio.positions.get(symbol);

    if (!position || position.quantity < quantity) {
      console.warn('Insufficient position to sell');
      return;
    }

    const revenue = quantity * price;
    this.portfolio.cash += revenue;

    if (position.quantity === quantity) {
      this.portfolio.positions.delete(symbol);
    } else {
      this.portfolio.positions.set(symbol, {
        quantity: position.quantity - quantity,
        avgPrice: position.avgPrice,
      });
    }

    const portfolioValue = this.calculatePortfolioValue(price);

    this.trades.push({
      id: this.trades.length + 1,
      backtest_id: 0,
      date: this.currentDate,
      symbol,
      action: 'SELL',
      quantity,
      price,
      total: revenue,
      portfolio_value: portfolioValue,
      created_at: new Date().toISOString(),
    });
  }

  private getPosition(symbol: string): number {
    return this.portfolio.positions.get(symbol)?.quantity || 0;
  }

  private calculateSMA(symbol: string, period: number, currentIndex: number): number {
    if (currentIndex < period - 1) {
      return 0;
    }

    let sum = 0;
    for (let i = currentIndex - period + 1; i <= currentIndex; i++) {
      sum += this.marketData[i].close;
    }

    return sum / period;
  }

  private calculatePortfolioValue(currentPrice: number): number {
    let positionValue = 0;

    for (const [symbol, position] of this.portfolio.positions.entries()) {
      positionValue += position.quantity * currentPrice;
    }

    return this.portfolio.cash + positionValue;
  }

  private calculateMetrics(): BacktestMetrics {
    const initialCapital = this.equityCurve[0]?.value || 0;
    const finalValue = this.equityCurve[this.equityCurve.length - 1]?.value || 0;
    const totalReturn = ((finalValue - initialCapital) / initialCapital) * 100;

    // Calculate max drawdown
    let maxDrawdown = 0;
    let peak = initialCapital;

    for (const point of this.equityCurve) {
      if (point.value > peak) {
        peak = point.value;
      }
      const drawdown = ((peak - point.value) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    // Calculate Sharpe Ratio (simplified)
    const returns: number[] = [];
    for (let i = 1; i < this.equityCurve.length; i++) {
      const dailyReturn = (this.equityCurve[i].value - this.equityCurve[i - 1].value) / this.equityCurve[i - 1].value;
      returns.push(dailyReturn);
    }

    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = stdDev !== 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;

    // Calculate win/loss trades
    const buyTrades = this.trades.filter(t => t.action === 'BUY');
    const sellTrades = this.trades.filter(t => t.action === 'SELL');

    let winningTrades = 0;
    let losingTrades = 0;

    for (let i = 0; i < Math.min(buyTrades.length, sellTrades.length); i++) {
      if (sellTrades[i] && buyTrades[i]) {
        const profit = (sellTrades[i].price - buyTrades[i].price) * sellTrades[i].quantity;
        if (profit > 0) winningTrades++;
        else if (profit < 0) losingTrades++;
      }
    }

    return {
      finalValue,
      totalReturn,
      maxDrawdown,
      sharpeRatio,
      totalTrades: this.trades.length,
      winningTrades,
      losingTrades,
    };
  }
}
