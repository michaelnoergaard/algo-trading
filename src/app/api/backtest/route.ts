import { NextRequest, NextResponse } from 'next/server';
import { Backtester } from '@/lib/backtester';
import { MarketData } from '@/types';

// Sample market data generator (in production, this would come from the database)
function generateSampleMarketData(
  symbol: string,
  startDate: string,
  endDate: string
): MarketData[] {
  const data: MarketData[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Start with a base price (simulating real stock prices)
  let currentPrice = 150;
  let id = 1;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    // Random walk with drift
    const change = (Math.random() - 0.48) * 5; // Slight upward bias
    currentPrice = Math.max(currentPrice + change, 50); // Don't go below $50

    const open = currentPrice + (Math.random() - 0.5) * 2;
    const close = currentPrice + (Math.random() - 0.5) * 2;
    const high = Math.max(open, close) + Math.random() * 3;
    const low = Math.min(open, close) - Math.random() * 3;
    const volume = Math.floor(50000000 + Math.random() * 50000000);

    data.push({
      id: id++,
      symbol,
      date: d.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { strategyCode, symbol, startDate, endDate, initialCapital } = body;

    // Validate inputs
    if (!strategyCode || !symbol || !startDate || !endDate || !initialCapital) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Generate or fetch market data
    // In production, this would query the database
    const marketData = generateSampleMarketData(symbol, startDate, endDate);

    if (marketData.length === 0) {
      return NextResponse.json(
        { error: 'No market data available for the specified period' },
        { status: 404 }
      );
    }

    // Run backtest
    const backtester = new Backtester(marketData, initialCapital);
    const results = await backtester.run(strategyCode);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Backtest error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
