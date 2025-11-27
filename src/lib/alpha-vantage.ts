import { MarketData } from '@/types';

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Simple in-memory cache to avoid hitting API rate limits
const dataCache = new Map<string, { data: MarketData[]; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface AlphaVantageResponse {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Output Size': string;
    '5. Time Zone': string;
  };
  'Time Series (Daily)': {
    [date: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. volume': string;
    };
  };
}

export async function fetchHistoricalData(
  symbol: string,
  startDate: string,
  endDate: string
): Promise<MarketData[]> {
  // Check cache first
  const cacheKey = `${symbol}_${startDate}_${endDate}`;
  const cached = dataCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for ${symbol}`);
    return cached.data;
  }

  if (!API_KEY) {
    throw new Error('ALPHA_VANTAGE_API_KEY is not configured');
  }

  try {
    // Alpha Vantage Daily Time Series endpoint
    const url = new URL(ALPHA_VANTAGE_BASE_URL);
    url.searchParams.append('function', 'TIME_SERIES_DAILY');
    url.searchParams.append('symbol', symbol);
    url.searchParams.append('outputsize', 'full'); // Get full historical data
    url.searchParams.append('apikey', API_KEY);

    console.log(`Fetching data for ${symbol} from Alpha Vantage...`);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.statusText}`);
    }

    const data: AlphaVantageResponse = await response.json();

    // Log the response for debugging
    console.log('Alpha Vantage response keys:', Object.keys(data));

    // Check for API errors or rate limit
    if ('Error Message' in data) {
      throw new Error(`Alpha Vantage error: ${(data as any)['Error Message']}`);
    }

    if ('Note' in data) {
      throw new Error('Alpha Vantage API rate limit reached. Please try again later.');
    }

    if ('Information' in data) {
      throw new Error(`Alpha Vantage info: ${(data as any)['Information']}`);
    }

    if (!data['Time Series (Daily)']) {
      // Log what we actually received
      console.error('Unexpected Alpha Vantage response:', JSON.stringify(data, null, 2));
      throw new Error(`Invalid response from Alpha Vantage API. Received keys: ${Object.keys(data).join(', ')}`);
    }

    // Transform Alpha Vantage data to our MarketData format
    const timeSeriesData = data['Time Series (Daily)'];
    const marketData: MarketData[] = [];

    let id = 1;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Process each date in the time series
    for (const [dateStr, values] of Object.entries(timeSeriesData)) {
      const date = new Date(dateStr);

      // Filter by date range
      if (date >= start && date <= end) {
        marketData.push({
          id: id++,
          symbol,
          date: dateStr,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume']),
        });
      }
    }

    // Sort by date ascending
    marketData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Cache the result
    dataCache.set(cacheKey, {
      data: marketData,
      timestamp: Date.now(),
    });

    console.log(`Successfully fetched ${marketData.length} days of data for ${symbol}`);

    return marketData;
  } catch (error: any) {
    console.error('Alpha Vantage fetch error:', error);
    throw error;
  }
}

// Generate sample data as fallback (for testing or when API is unavailable)
export function generateSampleMarketData(
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

// Clear cache (useful for testing)
export function clearCache(): void {
  dataCache.clear();
}
