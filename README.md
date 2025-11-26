# AlgoTrade Pro - Modern Algorithmic Trading Platform

A sleek, modern algorithmic trading platform built with Next.js, featuring a powerful strategy editor and comprehensive backtesting capabilities.

## Features

- **Strategy Editor**: Write trading strategies in JavaScript with Monaco Editor (VS Code editor)
- **Advanced Backtesting**: Test strategies against historical data with detailed metrics
- **Real-time Analytics**: Visualize performance with interactive charts
- **Performance Metrics**: Track returns, Sharpe ratio, drawdown, win rate, and more
- **Modern UI**: Dark theme with beautiful gradients and smooth animations
- **Fast & Scalable**: Built on Next.js and Neon serverless Postgres

## Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon (Serverless Postgres)
- **Editor**: Monaco Editor
- **Charts**: Recharts
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon database account (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd algo-trading
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Neon database URL:
```
DATABASE_URL=postgresql://user:password@your-neon-hostname.neon.tech/neondb?sslmode=require
```

4. Initialize the database:

Connect to your Neon database and run the SQL schema from `src/lib/schema.sql`

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment to Vercel

1. Push your code to GitHub

2. Import your repository in Vercel

3. Add environment variables in Vercel:
   - `DATABASE_URL`: Your Neon database connection string

4. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

## Project Structure

```
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   └── backtest/      # Backtest endpoint
│   │   ├── platform/          # Trading platform page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # UI components (Button, Card, etc.)
│   │   ├── StrategyEditor.tsx # Code editor component
│   │   └── BacktestResults.tsx # Results visualization
│   ├── lib/                   # Utilities and core logic
│   │   ├── backtester.ts     # Backtesting engine
│   │   ├── db.ts             # Database connection
│   │   ├── schema.sql        # Database schema
│   │   └── utils.ts          # Helper functions
│   └── types/                 # TypeScript type definitions
│       └── index.ts
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Writing Trading Strategies

Strategies are written in JavaScript and have access to a `context` object with the following methods:

### Available Methods

- `context.buy(symbol, quantity)` - Execute a buy order
- `context.sell(symbol, quantity)` - Execute a sell order
- `context.getPrice(symbol)` - Get current price
- `context.getPosition(symbol)` - Get current position size
- `context.getSMA(symbol, period)` - Calculate Simple Moving Average
- `context.portfolio.cash` - Access available cash
- `context.data` - Access historical market data

### Example Strategy

```javascript
// Moving Average Crossover Strategy
const shortPeriod = 50;
const longPeriod = 200;
const symbol = 'AAPL';

const shortMA = context.getSMA(symbol, shortPeriod);
const longMA = context.getSMA(symbol, longPeriod);

const position = context.getPosition(symbol);

// Buy signal: short MA crosses above long MA
if (shortMA > longMA && position === 0) {
  const sharesToBuy = Math.floor(context.portfolio.cash / context.getPrice(symbol));
  if (sharesToBuy > 0) {
    context.buy(symbol, sharesToBuy);
  }
}

// Sell signal: short MA crosses below long MA
if (shortMA < longMA && position > 0) {
  context.sell(symbol, position);
}
```

## Backtest Configuration

- **Symbol**: Stock ticker symbol (e.g., AAPL, MSFT)
- **Start Date**: Beginning of backtest period
- **End Date**: End of backtest period
- **Initial Capital**: Starting portfolio value

## Performance Metrics

- **Total Return**: Percentage gain/loss over the period
- **Final Value**: Ending portfolio value
- **Max Drawdown**: Largest peak-to-trough decline
- **Sharpe Ratio**: Risk-adjusted return metric
- **Win Rate**: Percentage of profitable trades
- **Total Trades**: Number of buy/sell transactions

## Database Schema

The platform uses four main tables:

- **strategies**: Store trading strategy code
- **backtests**: Store backtest results and metrics
- **market_data**: Historical price data
- **backtest_trades**: Individual trades from backtests

See `src/lib/schema.sql` for the complete schema.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ using Next.js and Neon
