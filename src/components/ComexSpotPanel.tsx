import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart } from 'recharts';
import { comexSpotData, positioningData } from '../data/mockData';
import { Repeat, ArrowRightLeft, TrendingUp, BarChart3 } from 'lucide-react';

export default function ComexSpotPanel() {
  const spreadData = comexSpotData.map(d => ({
    ...d,
    spread: Math.round((d.comex - d.spot) * 100) / 100,
    zScore: Math.round(((d.comex - d.spot - 1.5) / 0.8) * 100) / 100,
  }));

  const avgBasis = spreadData.reduce((a, b) => a + b.spread, 0) / spreadData.length;
  const basisStd = Math.sqrt(spreadData.reduce((a, b) => a + Math.pow(b.spread - avgBasis, 2), 0) / spreadData.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">COMEX Futures ↔ Spot Integration</h1>
          <p className="text-gray-400 text-sm mt-1">Basis analysis, arbitrage detection & cross-market flow mapping</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 text-xs">GC Front Month</span>
          <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 text-xs">XAU/USD Spot</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Basis', value: `$${spreadData[spreadData.length - 1].spread.toFixed(2)}`, sub: 'COMEX - Spot', icon: ArrowRightLeft, color: 'text-cyan-400' },
          { label: 'Avg Basis (40d)', value: `$${avgBasis.toFixed(2)}`, sub: `σ: $${basisStd.toFixed(2)}`, icon: BarChart3, color: 'text-blue-400' },
          { label: 'Basis Z-Score', value: spreadData[spreadData.length - 1].zScore.toFixed(2), sub: spreadData[spreadData.length - 1].zScore > 2 ? 'Extended' : 'Normal', icon: TrendingUp, color: spreadData[spreadData.length - 1].zScore > 2 ? 'text-amber-400' : 'text-emerald-400' },
          { label: 'Correlation (60d)', value: '0.9987', sub: 'Near-perfect sync', icon: Repeat, color: 'text-purple-400' },
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

      {/* Price Comparison */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-4">COMEX Futures vs XAU/USD Spot — Price Overlay</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={comexSpotData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={5} />
            <YAxis stroke="#6b7280" fontSize={10} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="comex" stroke="#06b6d4" strokeWidth={2} dot={false} name="COMEX Futures" />
            <Line type="monotone" dataKey="spot" stroke="#f59e0b" strokeWidth={2} dot={false} name="XAU/USD Spot" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Basis & Z-Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Basis Spread (COMEX - Spot)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={spreadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={5} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="spread" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} name="Basis ($)" />
              <Line type="monotone" dataKey="zScore" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Z-Score" strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-2 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-amber-500" style={{ borderTop: '1px dashed' }}></div>
              <span className="text-gray-400">Z-Score ±2 threshold</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-purple-500/30 rounded"></div>
              <span className="text-gray-400">Basis spread</span>
            </div>
          </div>
        </div>

        {/* COT Positioning */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">COT Positioning (COMEX Futures)</h3>
          <div className="space-y-3">
            {positioningData.map((item, i) => {
              const maxVal = Math.max(...positioningData.map(d => d.current));
              const pct = (item.current / maxVal) * 100;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-mono">{(item.current / 1000).toFixed(0)}K</span>
                      <span className={`text-xs ${item.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.change > 0 ? '▲' : '▼'}{Math.abs(item.change / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.category.includes('Long') ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 p-2 bg-blue-500/5 border border-blue-500/20 rounded text-xs text-blue-300">
            📊 Net speculative positioning: +243K contracts (Managed Money). 4-week trend: Increasing bullish bias.
          </div>
        </div>
      </div>

      {/* Integration Framework */}
      <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3">Cross-Market Integration Framework</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
            <h4 className="text-cyan-400 text-xs font-semibold mb-2">1. Basis Modeling</h4>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Fair value = Spot + Cost of Carry</li>
              <li>• Z-score normalization for signal</li>
              <li>• Calendar spread decomposition</li>
              <li>• Delivery month roll analysis</li>
            </ul>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
            <h4 className="text-amber-400 text-xs font-semibold mb-2">2. Flow Mapping</h4>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• COMEX volume → spot impact</li>
              <li>• Open interest change signals</li>
              <li>• EFP (Exchange for Physical) tracking</li>
              <li>• Delivery notice monitoring</li>
            </ul>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
            <h4 className="text-purple-400 text-xs font-semibold mb-2">3. Arbitrage Detection</h4>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Cash-and-carry arb signals</li>
              <li>• Reverse arb identification</li>
              <li>• Cross-exchange spread analysis</li>
              <li>• Statistical arb (mean-reversion)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
