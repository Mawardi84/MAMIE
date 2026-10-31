import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart, Area, Cell } from 'recharts';
import { orderFlowData, priceData } from '../data/mockData';
import { ArrowUpRight, GitBranch, Gauge } from 'lucide-react';

export default function OrderFlowPanel() {
  const cumulativeFlow = orderFlowData.reduce((acc, item, i) => {
    const prev = i > 0 ? acc[i - 1].cumulative : 0;
    acc.push({ ...item, cumulative: prev + item.netFlow });
    return acc;
  }, [] as (typeof orderFlowData[0] & { cumulative: number })[]);

  const deltaData = orderFlowData.map((item, i) => ({
    ...item,
    delta: item.aggressiveBuy - item.aggressiveSell,
    price: priceData[i]?.price || 2340,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Order Flow Analysis</h1>
          <p className="text-gray-400 text-sm mt-1">Aggressive vs passive activity, delta analysis & flow decomposition</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-purple-400 text-xs">Tick-level Analysis</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Cumulative Delta', value: '+4,280', sub: 'lots (session)', icon: ArrowUpRight, color: 'text-emerald-400' },
          { label: 'Aggressive Buy %', value: '56.2%', sub: 'of total flow', icon: ArrowUpRight, color: 'text-emerald-400' },
          { label: 'Flow Velocity', value: '842', sub: 'lots/min avg', icon: Gauge, color: 'text-cyan-400' },
          { label: 'Divergence', value: 'Bullish', sub: 'price vs delta', icon: GitBranch, color: 'text-amber-400' },
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Aggressive Flow */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Aggressive Buy vs Sell Volume</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={orderFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={10} interval={4} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="aggressiveBuy" fill="#10b981" fillOpacity={0.7} name="Aggressive Buy" />
              <Bar dataKey="aggressiveSell" fill="#ef4444" fillOpacity={0.7} name="Aggressive Sell" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cumulative Delta */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Cumulative Volume Delta (CVD)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={cumulativeFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={10} interval={4} />
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={10} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Area yAxisId="right" type="monotone" dataKey="cumulative" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} name="Cumulative Delta" />
              <Bar yAxisId="left" dataKey="netFlow" name="Net Flow" fillOpacity={0.6}>
                {cumulativeFlow.map((entry, index) => (
                  <Cell key={index} fill={entry.netFlow >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Delta-Price Divergence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Delta-Price Divergence Analysis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={deltaData.slice(0, 30)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={10} interval={4} />
              <YAxis yAxisId="left" stroke="#10b981" fontSize={10} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Line yAxisId="left" type="monotone" dataKey="delta" stroke="#10b981" strokeWidth={2} dot={false} name="Delta" />
              <Line yAxisId="right" type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2} dot={false} name="Price" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 p-2 bg-amber-500/5 border border-amber-500/20 rounded text-xs text-amber-300">
            ⚡ Divergence detected: Price making lower lows while delta remains positive — potential absorption by passive buyers
          </div>
        </div>

        {/* Flow Decomposition */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Flow Decomposition (Aggressive vs Passive)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={orderFlowData.slice(0, 20)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={10} interval={3} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="passiveBuy" stackId="a" fill="#06b6d4" fillOpacity={0.5} name="Passive Buy" />
              <Bar dataKey="passiveSell" stackId="b" fill="#f97316" fillOpacity={0.5} name="Passive Sell" />
              <Bar dataKey="aggressiveBuy" stackId="a" fill="#10b981" fillOpacity={0.8} name="Aggressive Buy" />
              <Bar dataKey="aggressiveSell" stackId="b" fill="#ef4444" fillOpacity={0.8} name="Aggressive Sell" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistical Summary */}
      <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3">Statistical Summary — Order Flow Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Buy/Sell Ratio', value: '1.28', note: 'Bullish bias' },
            { label: 'Large Trade %', value: '34.2%', note: '>100 lots' },
            { label: 'Avg Trade Size', value: '47 lots', note: 'Above median' },
            { label: 'Flow Persistence', value: '0.72', note: 'High autocorr' },
            { label: 'Kyle\'s Lambda', value: '0.0034', note: 'Price impact' },
            { label: 'VPIN (Toxicity)', value: '0.42', note: 'Moderate' },
          ].map((stat, i) => (
            <div key={i} className="p-3 bg-gray-900/50 rounded-lg">
              <span className="text-gray-400 text-xs">{stat.label}</span>
              <div className="text-white font-bold text-lg mt-1">{stat.value}</div>
              <span className="text-gray-500 text-xs">{stat.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
