# AlgoTrade Pro - Modern Algorithmic Trading Platform

A sleek, modern algorithmic trading platform built with Next.js, featuring a powerful strategy editor and comprehensive backtesting capabilities.

## Features

- **Strategy Editor**: Write trading strategies in JavaScript with Monaco Editor (VS Code editor)
- **Quick Examples**: 5 pre-built trading strategies (MA Crossover, Mean Reversion, Breakout, Momentum, Buy & Hold)
- **Save/Load Strategies**: Persist your custom strategies to the database for later use
- **Real Market Data**: Integration with Alpha Vantage API for historical stock prices
- **Advanced Backtesting**: Test strategies against real historical data with detailed metrics
- **Real-time Analytics**: Visualize performance with interactive charts
- **Performance Metrics**: Track returns, Sharpe ratio, drawdown, win rate, and more
- **Smart Caching**: 24-hour data cache to respect API rate limits
- **Data Source Indicator**: Clear UI feedback showing real vs simulated data
- **API Health Check**: Manual connectivity test to preserve API quota
- **Modern UI**: Dark theme with beautiful gradients and smooth animations
- **Fast & Scalable**: Built on Next.js and Neon serverless Postgres

## Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon (Serverless Postgres)
- **Market Data**: Alpha Vantage API
- **Editor**: Monaco Editor
- **Charts**: Recharts
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Alpha Vantage API key (free tier available - [get yours here](https://www.alphavantage.co/support/#api-key))
- A Neon database account (optional - free tier available)

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
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```bash
# Required: Alpha Vantage API key for real market data
ALPHA_VANTAGE_API_KEY=your_api_key_here

# Optional: Neon database (for saving strategies)
DATABASE_URL=postgresql://user:password@your-neon-hostname.neon.tech/neondb?sslmode=require
```

**Get your free Alpha Vantage API key:**
- Visit https://www.alphavantage.co/support/#api-key
- Enter your email
- Copy your API key and paste it in `.env.local`

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

5. (Optional) Set up Neon database for saving strategies:

**Get your free Neon database:**
- Visit https://neon.tech and sign up for a free account
- Create a new project
- Copy the connection string from the project dashboard
- Add it to `.env.local` as `DATABASE_URL`

**Initialize the database tables:**

Once your DATABASE_URL is configured, visit:
```
http://localhost:3000/api/db/init
```

This will automatically create all required tables (strategies, backtests, market_data, backtest_trades).

Alternatively, you can manually run the SQL from `src/lib/schema.sql` in your Neon console.

## Deployment to Vercel

1. Push your code to GitHub

2. Import your repository in Vercel

3. Add environment variables in Vercel:
   - `ALPHA_VANTAGE_API_KEY`: Your Alpha Vantage API key (required)
   - `DATABASE_URL`: Your Neon database connection string (optional - needed for Save/Load features)

4. Deploy!

5. After deployment, initialize the database by visiting:
```
https://your-app.vercel.app/api/db/init
```

6. (Optional) Delete the `/api/db/init` endpoint after initialization for security:

Once the database is set up, you can remove the initialization endpoint:
```bash
rm src/app/api/db/init/route.ts
```

Vercel will automatically detect Next.js and configure the build settings.

## Market Data

The platform uses **Alpha Vantage** for real historical stock price data:

**Free Tier Limits:**
- 25 API calls per day
- 5 API calls per minute

**Smart Features:**
- 24-hour data caching to minimize API calls
- Automatic fallback to simulated data if API is unavailable
- Clear UI indicator showing data source (real vs simulated)
- Support for any US stock symbol (AAPL, MSFT, TSLA, etc.)

**Supported Stocks:**
The platform works with any valid US stock ticker symbol available on Alpha Vantage. Popular examples:
- Tech: AAPL, MSFT, GOOGL, AMZN, META, NVDA
- Finance: JPM, BAC, GS, V, MA
- Consumer: WMT, HD, NKE, SBUX, MCD

## Project Structure

```
├── src/
│   ├── app/                        # Next.js app directory
│   │   ├── api/                   # API routes
│   │   │   ├── backtest/          # Backtest endpoint
│   │   │   ├── health/            # API health check
│   │   │   ├── strategies/        # Strategy CRUD operations
│   │   │   └── db/init/           # Database initialization
│   │   ├── platform/              # Trading platform page
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Landing page
│   │   └── globals.css            # Global styles
│   ├── components/                # React components
│   │   ├── ui/                   # UI components (Button, Card, Dialog)
│   │   ├── StrategyEditor.tsx     # Code editor component
│   │   ├── BacktestResults.tsx    # Results visualization
│   │   ├── ApiStatus.tsx          # API health indicator
│   │   ├── SaveStrategyDialog.tsx # Save strategy modal
│   │   └── LoadStrategyDialog.tsx # Load strategy modal
│   ├── lib/                       # Utilities and core logic
│   │   ├── backtester.ts         # Backtesting engine
│   │   ├── alpha-vantage.ts      # Market data integration
│   │   ├── strategies.ts         # Pre-built strategy examples
│   │   ├── db.ts                 # Database connection
│   │   ├── schema.sql            # Database schema
│   │   └── utils.ts              # Helper functions
│   └── types/                     # TypeScript type definitions
│       └── index.ts
├── public/                        # Static assets
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
