// Pre-built trading strategies for quick examples

export const EXAMPLE_STRATEGIES = {
  maCrossover: {
    name: 'Moving Average Crossover',
    description: 'Buy when 50-day MA crosses above 200-day MA, sell on reverse cross',
    code: `// Moving Average Crossover Strategy
// Buy when short-term MA crosses above long-term MA
// Sell when short-term MA crosses below long-term MA

const shortPeriod = 50;
const longPeriod = 200;
const symbol = 'AAPL';

// Get current moving averages
const shortMA = context.getSMA(symbol, shortPeriod);
const longMA = context.getSMA(symbol, longPeriod);

// Get previous day's data to detect crossover
const prevData = context.data[context.data.length - 2];
if (!prevData) return;

// Calculate previous MAs
let prevShortSum = 0, prevLongSum = 0;
const idx = context.data.indexOf(prevData);

if (idx < longPeriod - 1) return;

for (let i = idx - shortPeriod + 1; i <= idx; i++) {
  prevShortSum += context.data[i].close;
}
for (let i = idx - longPeriod + 1; i <= idx; i++) {
  prevLongSum += context.data[i].close;
}

const prevShortMA = prevShortSum / shortPeriod;
const prevLongMA = prevLongSum / longPeriod;

// Current position
const position = context.getPosition(symbol);

// Buy signal: short MA crosses above long MA
if (prevShortMA <= prevLongMA && shortMA > longMA && position === 0) {
  const sharesToBuy = Math.floor(context.portfolio.cash / context.getPrice(symbol));
  if (sharesToBuy > 0) {
    context.buy(symbol, sharesToBuy);
  }
}

// Sell signal: short MA crosses below long MA
if (prevShortMA >= prevLongMA && shortMA < longMA && position > 0) {
  context.sell(symbol, position);
}`,
  },

  buyAndHold: {
    name: 'Buy and Hold',
    description: 'Simple buy and hold strategy - buy on first day',
    code: `// Buy and Hold Strategy
// Purchase stock on day 1 and hold until end

const symbol = 'AAPL';
const position = context.getPosition(symbol);

// Buy on first day if we have no position
if (position === 0 && context.portfolio.cash > 0) {
  const sharesToBuy = Math.floor(context.portfolio.cash / context.getPrice(symbol));
  if (sharesToBuy > 0) {
    context.buy(symbol, sharesToBuy);
  }
}`,
  },

  momentumTrading: {
    name: 'Momentum Trading',
    description: 'Buy when price is above 20-day MA and trending up',
    code: `// Momentum Trading Strategy
// Buy when price > 20-day MA and recent trend is up
// Sell when price < 20-day MA

const symbol = 'AAPL';
const period = 20;

const currentPrice = context.getPrice(symbol);
const ma = context.getSMA(symbol, period);

if (ma === 0) return; // Not enough data

const position = context.getPosition(symbol);

// Calculate recent momentum (last 5 days)
const recentDays = 5;
if (context.data.length < recentDays + 1) return;

const priceNow = context.data[context.data.length - 1].close;
const priceBefore = context.data[context.data.length - recentDays].close;
const momentum = ((priceNow - priceBefore) / priceBefore) * 100;

// Buy signal: price above MA and positive momentum
if (currentPrice > ma && momentum > 2 && position === 0) {
  const sharesToBuy = Math.floor(context.portfolio.cash / currentPrice);
  if (sharesToBuy > 0) {
    context.buy(symbol, sharesToBuy);
  }
}

// Sell signal: price below MA
if (currentPrice < ma && position > 0) {
  context.sell(symbol, position);
}`,
  },

  meanReversion: {
    name: 'Mean Reversion',
    description: 'Buy when price drops below 20-day MA, sell when it rises above',
    code: `// Mean Reversion Strategy
// Buy when price drops significantly below average
// Sell when it returns to average

const symbol = 'AAPL';
const period = 20;
const threshold = 0.05; // 5% deviation

const currentPrice = context.getPrice(symbol);
const ma = context.getSMA(symbol, period);

if (ma === 0) return; // Not enough data

const position = context.getPosition(symbol);
const deviation = (currentPrice - ma) / ma;

// Buy signal: price significantly below MA
if (deviation < -threshold && position === 0) {
  const sharesToBuy = Math.floor(context.portfolio.cash / currentPrice);
  if (sharesToBuy > 0) {
    context.buy(symbol, sharesToBuy);
  }
}

// Sell signal: price back above MA
if (deviation > 0 && position > 0) {
  context.sell(symbol, position);
}`,
  },

  breakoutStrategy: {
    name: 'Breakout Strategy',
    description: 'Buy when price breaks above recent high',
    code: `// Breakout Strategy
// Buy when price breaks above 20-day high
// Sell when it falls below 20-day low

const symbol = 'AAPL';
const lookback = 20;

if (context.data.length < lookback + 1) return;

const currentPrice = context.getPrice(symbol);
const position = context.getPosition(symbol);

// Calculate 20-day high and low
let high = 0;
let low = Infinity;

for (let i = context.data.length - lookback - 1; i < context.data.length - 1; i++) {
  if (context.data[i].high > high) high = context.data[i].high;
  if (context.data[i].low < low) low = context.data[i].low;
}

// Buy signal: breakout above recent high
if (currentPrice > high && position === 0) {
  const sharesToBuy = Math.floor(context.portfolio.cash / currentPrice);
  if (sharesToBuy > 0) {
    context.buy(symbol, sharesToBuy);
  }
}

// Sell signal: breakdown below recent low
if (currentPrice < low && position > 0) {
  context.sell(symbol, position);
}`,
  },
};

export type StrategyKey = keyof typeof EXAMPLE_STRATEGIES;
