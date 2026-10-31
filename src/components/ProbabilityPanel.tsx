import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis } from 'recharts';
import { probabilityData, marketRegimeData } from '../data/mockData';
import { Brain, Target, Percent, Sigma } from 'lucide-react';

export default function ProbabilityPanel() {
  const scenarioData = [
    { scenario: 'Bullish Breakout', probability: 32, conditions: 'Delta > +2σ, Absorption at support, Basis widening' },
    { scenario: 'Range Continuation', probability: 41, conditions: 'Low vol regime, Balanced flow, Tight basis' },
    { scenario: 'Bearish Reversal', probability: 18, conditions: 'Aggressive sell, Vacuum above, DXY strength' },
    { scenario: 'Volatility Expansion', probability: 9, conditions: 'Event risk, Liquidity withdrawal, VIX spike' },
  ];

  const distributionFit = Array.from({ length: 50 }, (_, i) => {
    const x = -4 + (i / 50) * 8;
    const normalPdf = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    const empirical = normalPdf * (1 + 0.3 * Math.cos(2 * x) + 0.1 * (x * x * x - 3 * x)); // fat tails
    return {
      x: x.toFixed(1),
      normal: Math.round(normalPdf * 1000) / 1000,
      empirical: Math.round(empirical * 1000) / 1000,
    };
  });

  const transitionMatrix = [
    { from: 'Trending Up', toUp: 0.62, toRange: 0.28, toDown: 0.07, toVolatile: 0.03 },
    { from: 'Range Bound', toUp: 0.25, toRange: 0.55, toDown: 0.15, toVolatile: 0.05 },
    { from: 'Trending Down', toUp: 0.08, toRange: 0.32, toDown: 0.52, toVolatile: 0.08 },
    { from: 'Volatile', toUp: 0.20, toRange: 0.30, toDown: 0.22, toVolatile: 0.28 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Probability Models</h1>
          <p className="text-gray-400 text-sm mt-1">Statistical distribution fitting, regime transitions & scenario analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs">Bayesian Framework</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Regime', value: 'Trending Up', sub: 'Confidence: 85%', icon: Target, color: 'text-emerald-400' },
          { label: 'Expected Move (1d)', value: '±$18.4', sub: '1σ daily range', icon: Sigma, color: 'text-cyan-400' },
          { label: 'Tail Risk (5%)', value: '-$38.2', sub: 'VaR 95% confidence', icon: Percent, color: 'text-red-400' },
          { label: 'Model Accuracy', value: '72.4%', sub: 'Out-of-sample', icon: Brain, color: 'text-purple-400' },
        ].map((metric, i) => (
          <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span className="text-gray-400 text-xs">{metric.label}</span>
            </div>
            <div className="text-xl font-bold text-white">{metric.value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{metric.sub}</div>
          </div>
        ))}
      </div>

      {/* Distribution Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Return Distribution — Normal vs Empirical (Fat Tails)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={distributionFit}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="x" stroke="#6b7280" fontSize={10} label={{ value: 'σ', position: 'insideBottom', offset: -5, style: { fill: '#6b7280' } }} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="normal" stroke="#6b7280" strokeWidth={1.5} dot={false} strokeDasharray="5 5" name="Normal Dist." />
              <Line type="monotone" dataKey="empirical" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Empirical (Gold)" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 p-2 bg-purple-500/5 border border-purple-500/20 rounded text-xs text-purple-300">
            📐 Excess kurtosis: 4.2 (leptokurtic) — Gold returns exhibit significant fat tails vs normal distribution
          </div>
        </div>

        {/* Probability Distribution */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Probability Distribution — Model vs Historical</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={probabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="range" stroke="#6b7280" fontSize={9} angle={-20} textAnchor="end" height={50} />
              <YAxis stroke="#6b7280" fontSize={10} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="probability" fill="#8b5cf6" fillOpacity={0.7} name="Model Probability" />
              <Bar dataKey="historical" fill="#f59e0b" fillOpacity={0.7} name="Historical Frequency" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario Analysis & Transition Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Scenario Probability Assessment</h3>
          <div className="space-y-3">
            {scenarioData.map((scenario, i) => (
              <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium">{scenario.scenario}</span>
                  <span className={`text-sm font-bold ${
                    i === 0 ? 'text-emerald-400' : i === 1 ? 'text-blue-400' : i === 2 ? 'text-red-400' : 'text-amber-400'
                  }`}>{scenario.probability}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${
                      i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${scenario.probability}%` }}
                  />
                </div>
                <p className="text-gray-400 text-xs">{scenario.conditions}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Regime Transition Matrix */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Markov Regime Transition Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 p-2">From ↓ / To →</th>
                  <th className="text-center text-emerald-400 p-2">Trend Up</th>
                  <th className="text-center text-blue-400 p-2">Range</th>
                  <th className="text-center text-red-400 p-2">Trend Down</th>
                  <th className="text-center text-amber-400 p-2">Volatile</th>
                </tr>
              </thead>
              <tbody>
                {transitionMatrix.map((row, i) => (
                  <tr key={i} className="border-b border-gray-700/50">
                    <td className="text-gray-300 p-2 font-medium">{row.from}</td>
                    <td className="text-center p-2">
                      <span className={`px-2 py-0.5 rounded ${row.toUp > 0.4 ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400'}`}>
                        {(row.toUp * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="text-center p-2">
                      <span className={`px-2 py-0.5 rounded ${row.toRange > 0.4 ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400'}`}>
                        {(row.toRange * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="text-center p-2">
                      <span className={`px-2 py-0.5 rounded ${row.toDown > 0.4 ? 'bg-red-500/20 text-red-400' : 'text-gray-400'}`}>
                        {(row.toDown * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="text-center p-2">
                      <span className={`px-2 py-0.5 rounded ${row.toVolatile > 0.2 ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400'}`}>
                        {(row.toVolatile * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 p-2 bg-blue-500/5 border border-blue-500/20 rounded text-xs text-blue-300">
            🔄 Current regime: "Trending Up" — 62% probability of continuation, 28% chance of range-bound transition
          </div>
        </div>
      </div>

      {/* Model Specifications */}
      <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3">Model Architecture & Validation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { title: 'GARCH(1,1)', desc: 'Volatility clustering model. Captures time-varying conditional variance.', metric: 'AIC: -4.2' },
            { title: 'HMM (4-state)', desc: 'Hidden Markov Model for regime detection. Baum-Welch estimation.', metric: 'BIC: 847' },
            { title: 'Monte Carlo', desc: '10,000 path simulations for tail risk. Geometric Brownian + jumps.', metric: '10K paths' },
            { title: 'Bayesian Update', desc: 'Prior → Posterior using order flow as signal. Conjugate normal model.', metric: 'BF: 3.2' },
          ].map((model, i) => (
            <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
              <h4 className="text-amber-400 text-xs font-semibold mb-1">{model.title}</h4>
              <p className="text-gray-400 text-xs mb-2">{model.desc}</p>
              <span className="text-gray-500 text-xs font-mono">{model.metric}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
