'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

interface BacktestResultsProps {
  results: {
    trades: any[];
    equityCurve: Array<{ date: string; value: number }>;
    metrics: {
      finalValue: number;
      totalReturn: number;
      maxDrawdown: number;
      sharpeRatio: number;
      totalTrades: number;
      winningTrades: number;
      losingTrades: number;
    };
  } | null;
  initialCapital: number;
}

export default function BacktestResults({ results, initialCapital }: BacktestResultsProps) {
  if (!results) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-12 text-center">
          <Activity className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Run a backtest to see results</p>
        </CardContent>
      </Card>
    );
  }

  const { metrics, equityCurve, trades } = results;
  const winRate = metrics.totalTrades > 0
    ? ((metrics.winningTrades / metrics.totalTrades) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-400">Total Return</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {metrics.totalReturn >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-2xl font-bold ${metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metrics.totalReturn.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-400">Final Value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-white">
                ${metrics.finalValue.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Initial: ${initialCapital.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-400">Max Drawdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold text-orange-500">
                {metrics.maxDrawdown.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-400">Sharpe Ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold text-white">
                {metrics.sharpeRatio.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equity Curve */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Equity Curve</CardTitle>
          <CardDescription className="text-slate-400">
            Portfolio value over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={equityCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Trade Statistics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Trade Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Trades:</span>
                <span className="text-white font-semibold">{metrics.totalTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Winning Trades:</span>
                <span className="text-green-500 font-semibold">{metrics.winningTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Losing Trades:</span>
                <span className="text-red-500 font-semibold">{metrics.losingTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Win Rate:</span>
                <span className="text-white font-semibold">{winRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
              {trades.slice(-5).reverse().map((trade, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                  <div>
                    <span className={trade.action === 'BUY' ? 'text-green-500' : 'text-red-500'}>
                      {trade.action}
                    </span>
                    <span className="text-slate-400 ml-2">{trade.quantity} @ ${trade.price.toFixed(2)}</span>
                  </div>
                  <span className="text-slate-500 text-xs">{trade.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
