import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Zap, BarChart3, Code2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AlgoTrade Pro
              </span>
            </div>
            <Link href="/platform">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Launch Platform
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-400">Next-Generation Trading Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
            Algorithmic Trading
            <br />
            Made Simple
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Design, backtest, and deploy sophisticated trading strategies with our modern platform.
            No complex setup required.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/platform">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                Start Trading
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-700 text-lg px-8">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Powerful Features</h2>
          <p className="text-slate-400 text-lg">Everything you need to build winning strategies</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-colors">
            <CardHeader>
              <Code2 className="h-12 w-12 text-blue-500 mb-4" />
              <CardTitle className="text-white">Strategy Editor</CardTitle>
              <CardDescription className="text-slate-400">
                Write trading strategies in JavaScript with Monaco Editor. IntelliSense and syntax highlighting included.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-colors">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-cyan-500 mb-4" />
              <CardTitle className="text-white">Advanced Backtesting</CardTitle>
              <CardDescription className="text-slate-400">
                Test your strategies against historical data. Get detailed metrics including Sharpe ratio and drawdown.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-purple-500 mb-4" />
              <CardTitle className="text-white">Real-time Analytics</CardTitle>
              <CardDescription className="text-slate-400">
                Visualize performance with interactive charts. Track equity curves, trades, and portfolio metrics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 hover:border-green-500/50 transition-colors">
            <CardHeader>
              <Zap className="h-12 w-12 text-green-500 mb-4" />
              <CardTitle className="text-white">Lightning Fast</CardTitle>
              <CardDescription className="text-slate-400">
                Built with Next.js and Neon for blazing fast performance. Run backtests in seconds, not minutes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 hover:border-orange-500/50 transition-colors">
            <CardHeader>
              <CheckCircle2 className="h-12 w-12 text-orange-500 mb-4" />
              <CardTitle className="text-white">Pre-built Strategies</CardTitle>
              <CardDescription className="text-slate-400">
                Start with proven strategies including trend following, moving average crossovers, and more.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 hover:border-pink-500/50 transition-colors">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-pink-500 mb-4" />
              <CardTitle className="text-white">Portfolio Management</CardTitle>
              <CardDescription className="text-slate-400">
                Track positions, cash, and overall portfolio value. Manage multiple strategies simultaneously.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">How It Works</h2>
          <p className="text-slate-400 text-lg">Get started in three simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-500">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Write Strategy</h3>
            <p className="text-slate-400">
              Define your trading rules using simple JavaScript. Use technical indicators like moving averages.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-cyan-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-cyan-500">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Backtest</h3>
            <p className="text-slate-400">
              Test against historical market data. Analyze performance metrics and optimize parameters.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 border-2 border-purple-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-500">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Deploy</h3>
            <p className="text-slate-400">
              Save successful strategies and track their performance over time with detailed analytics.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Start Trading Smarter?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join the future of algorithmic trading. Build, test, and deploy strategies with confidence.
            </p>
            <Link href="/platform">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
                Launch Platform Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>© 2025 AlgoTrade Pro. Built with Next.js and Neon.</p>
        </div>
      </footer>
    </div>
  );
}
