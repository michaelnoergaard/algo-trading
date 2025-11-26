import { NextRequest, NextResponse } from 'next/server';
import { Backtester } from '@/lib/backtester';
import { fetchHistoricalData, generateSampleMarketData } from '@/lib/alpha-vantage';

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

    let marketData;
    let dataSource = 'real'; // Track whether we're using real or mock data

    try {
      // Try to fetch real market data from Alpha Vantage
      marketData = await fetchHistoricalData(symbol, startDate, endDate);

      if (marketData.length === 0) {
        throw new Error('No data returned for date range');
      }
    } catch (error: any) {
      // Fallback to sample data if Alpha Vantage fails
      console.warn('Alpha Vantage fetch failed, using sample data:', error.message);
      marketData = generateSampleMarketData(symbol, startDate, endDate);
      dataSource = 'simulated';
    }

    if (marketData.length === 0) {
      return NextResponse.json(
        { error: 'No market data available for the specified period' },
        { status: 404 }
      );
    }

    // Run backtest
    const backtester = new Backtester(marketData, initialCapital);
    const results = await backtester.run(strategyCode);

    // Include data source in response
    return NextResponse.json({
      ...results,
      dataSource,
      dataPoints: marketData.length,
    });
  } catch (error: any) {
    console.error('Backtest error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
