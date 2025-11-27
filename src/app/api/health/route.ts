import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  // Check if API key is configured
  if (!apiKey) {
    return NextResponse.json({
      status: 'error',
      configured: false,
      message: 'ALPHA_VANTAGE_API_KEY is not configured',
      details: 'Add the environment variable in Vercel or .env.local',
    });
  }

  // Test API connectivity with a simple quote request
  try {
    const testUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${apiKey}`;

    const response = await fetch(testUrl, {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      return NextResponse.json({
        status: 'error',
        configured: true,
        connected: false,
        message: `API returned status ${response.status}`,
        details: response.statusText,
      });
    }

    const data = await response.json();

    // Check for API errors or rate limit
    if ('Error Message' in data) {
      return NextResponse.json({
        status: 'error',
        configured: true,
        connected: true,
        message: 'Invalid symbol or API error',
        details: data['Error Message'],
      });
    }

    if ('Note' in data) {
      return NextResponse.json({
        status: 'rate_limited',
        configured: true,
        connected: true,
        message: 'API rate limit reached',
        details: 'Free tier: 25 calls/day, 5 calls/minute',
        note: data['Note'],
      });
    }

    if ('Global Quote' in data && Object.keys(data['Global Quote']).length > 0) {
      return NextResponse.json({
        status: 'operational',
        configured: true,
        connected: true,
        message: 'Alpha Vantage API is working correctly',
        details: 'Successfully fetched test quote for AAPL',
        testData: {
          symbol: data['Global Quote']['01. symbol'],
          price: data['Global Quote']['05. price'],
        },
      });
    }

    // Unknown response format
    return NextResponse.json({
      status: 'warning',
      configured: true,
      connected: true,
      message: 'Unexpected API response format',
      details: 'API responded but with unexpected data structure',
    });

  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json({
        status: 'error',
        configured: true,
        connected: false,
        message: 'Connection timeout',
        details: 'Could not reach Alpha Vantage API (5s timeout)',
      });
    }

    return NextResponse.json({
      status: 'error',
      configured: true,
      connected: false,
      message: 'Connection failed',
      details: error.message || 'Network error',
      error: error.code,
    });
  }
}
