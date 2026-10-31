import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import { liquidityDepth, absorptionData, priceData } from '../data/mockData';
import { Droplets, Zap, Layers, ArrowUpDown } from 'lucide-react';

export default function LiquidityPanel() {
  const volumeProfile = Array.from({ length: 15 }, (_, i) => ({
    price: 2335 + i,
    buyVolume: Math.floor(100 + Math.random() * 500 + (i === 7 ? 400 : 0)),
    sellVolume: Math.floor(100 + Math.random() * 500 + (i === 5 ? 350 : 0)),
    poc: i === 7 ? true : false,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Liquidity Analysis</h1>
          <p className="text-gray-400 text-sm mt-1">Market depth, absorption patterns & liquidity vacuum detection</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-blue-400 text-xs">Real-time Depth</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Bid-Ask Spread', value: '0.12', unit: 'pts', icon: ArrowUpDown, color: 'text-cyan-400' },
          { label: 'Market Depth (10pts)', value: '2,840', unit: 'lots', icon: Layers, color: 'text-blue-400' },
          { label: 'Absorption Index', value: '67', unit: '/100', icon: Droplets, color: 'text-purple-400' },
          { label: 'Vacuum Zones', value: '3', unit: 'detected', icon: Zap, color: 'text-amber-400' },
        ].map((metric, i) => (
          <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span className="text-gray-400 text-xs">{metric.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white">{metric.value}</span>
              <span className="text-gray-500 text-xs">{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Liquidity Depth Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Market Depth Profile</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={liquidityDepth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="price" stroke="#6b7280" fontSize={10} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="bidDepth" fill="#10b981" fillOpacity={0.7} name="Bid Depth" />
              <Bar dataKey="askDepth" fill="#ef4444" fillOpacity={0.7} name="Ask Depth" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Profile */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Volume Profile (POC Analysis)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volumeProfile} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#6b7280" fontSize={10} />
              <YAxis dataKey="price" type="category" stroke="#6b7280" fontSize={10} width={40} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="buyVolume" fill="#10b981" fillOpacity={0.6} name="Buy Volume" stackId="a" />
              <Bar dataKey="sellVolume" fill="#ef4444" fillOpacity={0.6} name="Sell Volume" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Absorption & Vacuum Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Absorption & Imbalance Detection (24h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={absorptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#6b7280" fontSize={10} interval={3} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="absorption" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Absorption" />
              <Line type="monotone" dataKey="imbalance" stroke="#06b6d4" strokeWidth={1.5} dot={false} name="Imbalance" />
              <Line type="monotone" dataKey="vacuum" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Vacuum" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Liquidity Events Log */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Liquidity Events Log</h3>
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {[
              { time: '14:32:15', type: 'ABSORPTION', detail: 'Large bid absorption at 2338.50 — 450 lots consumed in 3s', severity: 'high' },
              { time: '14:28:42', type: 'VACUUM', detail: 'Liquidity vacuum detected 2348-2352 — thin book (< 50 lots)', severity: 'medium' },
              { time: '14:15:08', type: 'IMBALANCE', detail: 'Aggressive sell imbalance: 3.2:1 ratio over 5min window', severity: 'high' },
              { time: '13:58:33', type: 'ABSORPTION', detail: 'Passive buying absorbing sell pressure at 2336 support', severity: 'medium' },
              { time: '13:45:19', type: 'SWEEP', detail: 'Liquidity sweep below 2337 — stop run detected, quick reversal', severity: 'low' },
              { time: '13:32:01', type: 'VACUUM', detail: 'Ask-side vacuum at 2344-2346 — potential displacement zone', severity: 'medium' },
              { time: '13:15:44', type: 'IMBALANCE', detail: 'Buy imbalance 2.8:1 — institutional accumulation signal', severity: 'high' },
              { time: '12:58:22', type: 'ABSORPTION', detail: 'Iceberg order detected at 2339 — estimated 800 lots total', severity: 'medium' },
            ].map((event, i) => (
              <div key={i} className={`p-2 rounded-lg border ${
                event.severity === 'high' ? 'bg-red-500/5 border-red-500/20' :
                event.severity === 'medium' ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-blue-500/5 border-blue-500/20'
              }`}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-gray-400 text-xs font-mono">{event.time}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    event.type === 'ABSORPTION' ? 'bg-purple-500/20 text-purple-400' :
                    event.type === 'VACUUM' ? 'bg-amber-500/20 text-amber-400' :
                    event.type === 'IMBALANCE' ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>{event.type}</span>
                </div>
                <p className="text-gray-300 text-xs">{event.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Methodology Notes */}
      <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-2">Methodology Notes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
          <div>
            <span className="text-amber-400 font-medium">Absorption Detection:</span>
            <p className="mt-1">Identified when large volume transacts at a price level without significant price movement. Measured via volume/price-displacement ratio over rolling windows.</p>
          </div>
          <div>
            <span className="text-cyan-400 font-medium">Liquidity Vacuum:</span>
            <p className="mt-1">Zones where order book depth falls below statistical threshold (&lt;1σ). These zones are prone to price slippage and rapid displacement.</p>
          </div>
          <div>
            <span className="text-purple-400 font-medium">Imbalance Ratio:</span>
            <p className="mt-1">Ratio of aggressive buy vs sell volume at market. Values &gt;2:1 indicate directional pressure. Tracked at multiple timeframes (1m, 5m, 15m).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
