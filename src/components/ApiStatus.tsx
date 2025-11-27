'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, AlertCircle, Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface ApiHealth {
  status: 'operational' | 'error' | 'rate_limited' | 'warning';
  configured: boolean;
  connected?: boolean;
  message: string;
  details: string;
  testData?: {
    symbol: string;
    price: string;
  };
}

export default function ApiStatus() {
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  const checkHealth = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      setHealth({
        status: 'error',
        configured: false,
        connected: false,
        message: 'Failed to check API status',
        details: 'Could not reach health check endpoint',
      });
    } finally {
      setLoading(false);
      setTesting(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
            <div>
              <p className="text-sm font-semibold text-slate-300">Checking API Status...</p>
              <p className="text-xs text-slate-500">Testing Alpha Vantage connection</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!health) {
    return null;
  }

  const getStatusColor = () => {
    switch (health.status) {
      case 'operational':
        return {
          bg: 'bg-green-500/10 border-green-500/20',
          text: 'text-green-400',
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        };
      case 'rate_limited':
        return {
          bg: 'bg-orange-500/10 border-orange-500/20',
          text: 'text-orange-400',
          icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10 border-yellow-500/20',
          text: 'text-yellow-400',
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
        };
      case 'error':
      default:
        return {
          bg: 'bg-red-500/10 border-red-500/20',
          text: 'text-red-400',
          icon: <XCircle className="h-5 w-5 text-red-500" />,
        };
    }
  };

  const statusColor = getStatusColor();

  return (
    <Card className={`border ${statusColor.bg}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {statusColor.icon}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-sm font-semibold ${statusColor.text}`}>
                  {health.message}
                </p>
                {health.configured ? (
                  <Wifi className="h-3 w-3 text-slate-500" />
                ) : (
                  <WifiOff className="h-3 w-3 text-slate-500" />
                )}
              </div>
              <p className="text-xs text-slate-400">{health.details}</p>

              {health.testData && (
                <div className="mt-2 text-xs text-slate-500">
                  ✓ Test: {health.testData.symbol} @ ${health.testData.price}
                </div>
              )}

              {!health.configured && (
                <div className="mt-2 text-xs text-slate-400 bg-slate-800/50 p-2 rounded">
                  <strong>Fix:</strong> Add ALPHA_VANTAGE_API_KEY to your Vercel environment variables
                </div>
              )}

              {health.status === 'rate_limited' && (
                <div className="mt-2 text-xs text-slate-400 bg-slate-800/50 p-2 rounded">
                  <strong>Rate Limited:</strong> Free tier allows 25 calls/day. Data is cached for 24h to minimize calls.
                  {' '}Wait a few minutes or upgrade your plan.
                </div>
              )}

              {health.status === 'error' && health.configured && !health.connected && (
                <div className="mt-2 text-xs text-slate-400 bg-slate-800/50 p-2 rounded">
                  <strong>Connection Issue:</strong> Cannot reach Alpha Vantage API. Using simulated data as fallback.
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={checkHealth}
            disabled={testing}
            size="sm"
            variant="outline"
            className="border-slate-700 shrink-0"
          >
            {testing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
