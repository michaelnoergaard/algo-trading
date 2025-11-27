'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StrategyEditor from '@/components/StrategyEditor';
import BacktestResults from '@/components/BacktestResults';
import ApiStatus from '@/components/ApiStatus';
import SaveStrategyDialog from '@/components/SaveStrategyDialog';
import LoadStrategyDialog from '@/components/LoadStrategyDialog';
import { EXAMPLE_STRATEGIES, type StrategyKey } from '@/lib/strategies';
import { TrendingUp, ArrowLeft, Calendar, DollarSign } from 'lucide-react';

export default function PlatformPage() {
  const [backtestResults, setBacktestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [strategyCode, setStrategyCode] = useState<string | undefined>(undefined);
  const [currentCode, setCurrentCode] = useState<string>('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [config, setConfig] = useState({
    symbol: 'AAPL',
    startDate: '2024-08-01',
    endDate: '2024-11-27',
    initialCapital: 100000,
  });

  const loadExample = (key: StrategyKey) => {
    setStrategyCode(EXAMPLE_STRATEGIES[key].code);
    setBacktestResults(null); // Clear previous results
  };

  const handleLoadStrategy = (code: string) => {
    setStrategyCode(code);
    setBacktestResults(null);
  };

  const handleSave = () => {
    if (!currentCode.trim()) {
      alert('Please write some code before saving');
      return;
    }
    setShowSaveDialog(true);
  };

  const handleRunBacktest = async (code: string) => {
    setCurrentCode(code); // Track the current code for saving
    setIsRunning(true);
    setBacktestResults(null);

    try {
      const response = await fetch('/api/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategyCode: code,
          ...config,
        }),
      });

      if (!response.ok) {
        throw new Error('Backtest failed');
      }

      const results = await response.json();
      setBacktestResults(results);
    } catch (error) {
      console.error('Backtest error:', error);
      alert('Backtest failed. Please check your strategy code.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5 text-slate-400" />
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AlgoTrade Pro
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="border-slate-700"
                onClick={handleSave}
              >
                Save Strategy
              </Button>
              <Button
                variant="outline"
                className="border-slate-700"
                onClick={() => setShowLoadDialog(true)}
              >
                Load Strategy
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* API Status Indicator */}
        <div className="mb-6">
          <ApiStatus />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Backtest Configuration</CardTitle>
                <CardDescription className="text-slate-400">
                  Set up your backtest parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Symbol
                  </label>
                  <input
                    type="text"
                    value={config.symbol}
                    onChange={(e) => setConfig({ ...config, symbol: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="AAPL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={config.startDate}
                    onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={config.endDate}
                    onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Initial Capital
                  </label>
                  <input
                    type="number"
                    value={config.initialCapital}
                    onChange={(e) => setConfig({ ...config, initialCapital: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100000"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-sm font-semibold text-white mb-2">Quick Examples</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-700 text-slate-300 hover:text-white"
                      onClick={() => loadExample('maCrossover')}
                    >
                      MA Crossover
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-700 text-slate-300 hover:text-white"
                      onClick={() => loadExample('meanReversion')}
                    >
                      Mean Reversion
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-700 text-slate-300 hover:text-white"
                      onClick={() => loadExample('breakoutStrategy')}
                    >
                      Breakout Strategy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-700 text-slate-300 hover:text-white"
                      onClick={() => loadExample('momentumTrading')}
                    >
                      Momentum Trading
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-700 text-slate-300 hover:text-white"
                      onClick={() => loadExample('buyAndHold')}
                    >
                      Buy & Hold
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Editor and Results */}
          <div className="lg:col-span-2 space-y-6">
            <StrategyEditor
              value={strategyCode}
              onRunBacktest={handleRunBacktest}
              isRunning={isRunning}
            />

            <BacktestResults
              results={backtestResults}
              initialCapital={config.initialCapital}
            />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <SaveStrategyDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        strategyCode={currentCode}
        onSaveSuccess={() => {
          alert('Strategy saved successfully!');
        }}
      />

      <LoadStrategyDialog
        open={showLoadDialog}
        onOpenChange={setShowLoadDialog}
        onLoadStrategy={handleLoadStrategy}
      />
    </div>
  );
}
