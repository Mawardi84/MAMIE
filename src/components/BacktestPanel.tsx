import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart } from 'recharts';
import { backtestResults } from '../data/mockData';
import { CheckCircle, XCircle, TrendingUp, Shield, Award, BarChart2 } from 'lucide-react';

export default function BacktestPanel() {
  const equityCurve = backtestResults.monthlyReturns.map((m, i) => ({
    month: m.month,
    equity: Math.round((10000 * (1 + m.cumulative / 100)) * 100) / 100,
    drawdown: m.cumulative < 0 ? m.cumulative : 0,
  }));

  const monthlyReturnsChart = backtestResults.monthlyReturns.map(m => ({
    month: m.month,
    return: m.return,
  }));

  const rollingMetrics = Array.from({ length: 24 }, (_, i) => ({
    month: `M${i + 1}`,
    sharpe: Math.round((0.8 + Math.sin(i / 4) * 0.5 + Math.random() * 0.3) * 100) / 100,
    winRate: Math.round((52 + Math.sin(i / 3) * 8 + Math.random() * 5) * 10) / 10,
    profitFactor: Math.round((1.3 + Math.cos(i / 5) * 0.4 + Math.random() * 0.3) * 100) / 100,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Backtesting & Validation</h1>
          <p className="text-gray-400 text-sm mt-1">Strategy performance, statistical significance & out-of-sample testing</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs">Walk-Forward Validated</span>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Trades', value: backtestResults.totalTrades, icon: BarChart2, color: 'text-blue-400' },
          { label: 'Win Rate', value: `${backtestResults.winRate}%`, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Profit Factor', value: backtestResults.profitFactor, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Sharpe Ratio', value: backtestResults.sharpeRatio, icon: Award, color: 'text-purple-400' },
          { label: 'Max Drawdown', value: `${backtestResults.maxDrawdown}%`, icon: XCircle, color: 'text-red-400' },
          { label: 'Expectancy', value: `$${backtestResults.expectancy}R`, icon: Shield, color: 'text-cyan-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
              <span className="text-gray-400 text-xs">{stat.label}</span>
            </div>
            <span className="text-lg font-bold text-white">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Equity Curve & Monthly Returns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Equity Curve ($10,000 Initial)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={equityCurve}>
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={10} interval={3} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="equity" stroke="#10b981" fill="url(#equityGrad)" strokeWidth={2} name="Equity ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Monthly Returns Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyReturnsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={10} interval={3} />
              <YAxis stroke="#6b7280" fontSize={10} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="return" name="Monthly Return (%)">
                {monthlyReturnsChart.map((entry, index) => (
                  <rect key={index} fill={entry.return >= 0 ? '#10b981' : '#ef4444'} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rolling Metrics */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Rolling Performance Metrics (12-month window)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={rollingMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={10} interval={3} />
            <YAxis yAxisId="left" stroke="#6b7280" fontSize={10} />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={10} domain={[40, 70]} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
            <Line yAxisId="left" type="monotone" dataKey="sharpe" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Sharpe Ratio" />
            <Line yAxisId="left" type="monotone" dataKey="profitFactor" stroke="#06b6d4" strokeWidth={2} dot={false} name="Profit Factor" />
            <Line yAxisId="right" type="monotone" dataKey="winRate" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Win Rate %" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Validation Framework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Statistical Validation Tests</h3>
          <div className="space-y-2">
            {[
              { test: 'Monte Carlo Significance (p<0.01)', result: 'PASS', detail: 'Strategy returns exceed random walk at 99% confidence' },
              { test: 'White\'s Reality Check', result: 'PASS', detail: 'No data-snooping bias detected (p=0.003)' },
              { test: 'Hansen\'s SPA Test', result: 'PASS', detail: 'Superior predictive ability confirmed (p=0.008)' },
              { test: 'Out-of-Sample (30%)', result: 'PASS', detail: 'OOS Sharpe: 1.21 vs IS: 1.45 (decay: 16.5%)' },
              { test: 'Walk-Forward Analysis', result: 'PASS', detail: 'Consistent performance across 8 rolling windows' },
              { test: 'Regime Robustness', result: 'PARTIAL', detail: 'Underperforms in low-vol range-bound regimes' },
              { test: 'Transaction Cost Sensitivity', result: 'PASS', detail: 'Profitable up to 3x current spread assumptions' },
              { test: 'Parameter Stability', result: 'PASS', detail: '±20% parameter variation maintains PF > 1.3' },
            ].map((item, i) => (
              <div key={i} className={`p-2 rounded-lg border ${
                item.result === 'PASS' ? 'bg-emerald-500/5 border-emerald-500/20' :
                item.result === 'PARTIAL' ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-red-500/5 border-red-500/20'
              }`}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-gray-300 text-xs font-medium">{item.test}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    item.result === 'PASS' ? 'bg-emerald-500/20 text-emerald-400' :
                    item.result === 'PARTIAL' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{item.result}</span>
                </div>
                <p className="text-gray-400 text-xs">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Configuration */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Strategy Specifications</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
              <h4 className="text-amber-400 text-xs font-semibold mb-2">Entry Logic</h4>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Liquidity absorption at key support/resistance</li>
                <li>• Order flow imbalance &gt; 2:1 ratio (5min)</li>
                <li>• COMEX basis confirmation (z-score &gt; 1.5)</li>
                <li>• Volume profile POC confluence</li>
              </ul>
            </div>
            <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
              <h4 className="text-cyan-400 text-xs font-semibold mb-2">Exit Logic</h4>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Target: Next liquidity zone / VPIN reversal</li>
                <li>• Stop: Beyond absorption level + 1.5 ATR</li>
                <li>• Time stop: 4 hours max hold period</li>
                <li>• Trailing: Delta divergence exit signal</li>
              </ul>
            </div>
            <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
              <h4 className="text-purple-400 text-xs font-semibold mb-2">Risk Management</h4>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Position size: 1% risk per trade</li>
                <li>• Max daily loss: 3% (circuit breaker)</li>
                <li>• Correlation filter: No concurrent positions</li>
                <li>• Volatility scaling: Reduce size when HV &gt; 15%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
