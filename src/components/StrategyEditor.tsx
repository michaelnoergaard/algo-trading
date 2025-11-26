'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface StrategyEditorProps {
  initialCode?: string;
  onRunBacktest: (code: string) => void;
  isRunning?: boolean;
}

const DEFAULT_STRATEGY = `// Moving Average Crossover Strategy
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

const prevShortMA = calculatePrevSMA(prevData, shortPeriod);
const prevLongMA = calculatePrevSMA(prevData, longPeriod);

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
}

// Helper function
function calculatePrevSMA(prevData, period) {
  const idx = context.data.indexOf(prevData);
  if (idx < period - 1) return 0;

  let sum = 0;
  for (let i = idx - period + 1; i <= idx; i++) {
    sum += context.data[i].close;
  }
  return sum / period;
}`;

export default function StrategyEditor({ initialCode, onRunBacktest, isRunning }: StrategyEditorProps) {
  const [code, setCode] = useState(initialCode || DEFAULT_STRATEGY);

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Strategy Editor</span>
          <Button
            onClick={() => onRunBacktest(code)}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? 'Running...' : 'Run Backtest'}
          </Button>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Write your trading strategy using JavaScript
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border border-slate-800 rounded-lg overflow-hidden">
          <MonacoEditor
            height="500px"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        </div>

        <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-2">Available Context Methods:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
            <div>
              <code className="text-blue-400">context.buy(symbol, quantity)</code>
              <p className="text-xs mt-1">Execute a buy order</p>
            </div>
            <div>
              <code className="text-blue-400">context.sell(symbol, quantity)</code>
              <p className="text-xs mt-1">Execute a sell order</p>
            </div>
            <div>
              <code className="text-blue-400">context.getPrice(symbol)</code>
              <p className="text-xs mt-1">Get current price</p>
            </div>
            <div>
              <code className="text-blue-400">context.getPosition(symbol)</code>
              <p className="text-xs mt-1">Get current position size</p>
            </div>
            <div>
              <code className="text-blue-400">context.getSMA(symbol, period)</code>
              <p className="text-xs mt-1">Get simple moving average</p>
            </div>
            <div>
              <code className="text-blue-400">context.portfolio.cash</code>
              <p className="text-xs mt-1">Available cash balance</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
