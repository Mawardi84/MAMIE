import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { priceData, volatilityData, macroCorrelation, positioningData } from '../data/mockData';
import { TrendingUp, TrendingDown, Activity, BarChart3, DollarSign, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const currentPrice = priceData[priceData.length - 1].price;
  const prevPrice = priceData[priceData.length - 2].price;
  const change = currentPrice - prevPrice;
  const changePercent = (change / prevPrice) * 100;

  const stats = [
    { label: 'Current Price', value: `$${currentPrice.toFixed(2)}`, change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`, icon: DollarSign, positive: change >= 0 },
    { label: 'Realized Vol (20d)', value: '11.2%', change: '-0.8%', icon: Activity, positive: false },
    { label: 'Order Flow Imbalance', value: '+2.4K', change: 'Bullish', icon: TrendingUp, positive: true },
    { label: 'Liquidity Score', value: '72/100', change: 'Normal', icon: BarChart3, positive: true },
  ];

  const regimeColor = (regime: string) => {
    if (regime.includes('Up')) return 'text-emerald-400';
    if (regime.includes('Down')) return 'text-red-400';
    if (regime.includes('Volatile')) return 'text-amber-400';
    return 'text-blue-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">XAU/USD Research Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Quantitative Market Microstructure Analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-xs font-medium">LIVE DATA</span>
          </div>
          <span className="text-gray-400 text-sm">Last update: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold text-white">{stat.value}</span>
              <span className={`text-xs font-medium ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Price Chart */}
        <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">XAU/USD Intraday Price Action</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">15min candles</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={10} interval={9} />
              <YAxis stroke="#6b7280" fontSize={10} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                itemStyle={{ color: '#f59e0b' }}
              />
              <Area type="monotone" dataKey="price" stroke="#f59e0b" fill="url(#priceGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Market Regime */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Market Regime Detection</h3>
          <div className="space-y-3">
            {positioningData.slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-0">
                <div>
                  <span className="text-gray-300 text-xs">{item.category}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-white text-sm font-medium">{(item.current / 1000).toFixed(0)}K</span>
                    <span className={`text-xs ${item.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.change > 0 ? '▲' : '▼'} {Math.abs(item.change / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
                {item.change > 0 ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Volatility */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Volatility Surface (Annualized %)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={volatilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={10} interval={9} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Area type="monotone" dataKey="realized" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={1.5} name="Realized" />
              <Area type="monotone" dataKey="implied" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} strokeWidth={1.5} name="Implied" />
              <Area type="monotone" dataKey="parkinson" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={1.5} name="Parkinson" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Macro Correlation */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Macro Factor Correlation Matrix</h3>
          <div className="space-y-2">
            {macroCorrelation.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-700/30 last:border-0">
                <span className="text-gray-300 text-xs w-32">{item.factor}</span>
                <div className="flex-1 mx-3">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.correlation > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.abs(item.correlation) * 100}%`, marginLeft: item.correlation < 0 ? `${(1 + item.correlation) * 100}%` : '0' }}
                    />
                  </div>
                </div>
                <span className={`text-xs font-mono w-12 text-right ${item.correlation > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.correlation > 0 ? '+' : ''}{item.correlation.toFixed(2)}
                </span>
                <span className="text-xs text-amber-400 w-8 text-right">{item.significance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts & Research Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-white font-semibold text-sm">Research Alerts</h3>
          </div>
          <div className="space-y-2">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-amber-300 text-xs">Liquidity vacuum detected at 2348-2352 zone</p>
            </div>
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-xs">COMEX basis widening — monitor for arb opportunity</p>
            </div>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-emerald-300 text-xs">Absorption pattern confirmed at 2335 support</p>
            </div>
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-purple-300 text-xs">Vol regime shift: Low → Normal (parkinson HV breakout)</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-3">Research Framework Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { module: 'Price Formation', status: 'Active', progress: 92 },
              { module: 'Order Flow Model', status: 'Active', progress: 85 },
              { module: 'Liquidity Mapping', status: 'Active', progress: 78 },
              { module: 'COMEX Integration', status: 'Testing', progress: 65 },
              { module: 'Probability Engine', status: 'Active', progress: 88 },
              { module: 'Backtest Framework', status: 'Active', progress: 95 },
              { module: 'AI Intelligence', status: 'Phase 2', progress: 35 },
              { module: 'Risk Management', status: 'Active', progress: 72 },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-xs">{item.module}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    item.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                    item.status === 'Testing' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>{item.status}</span>
                  <span className="text-gray-400 text-xs">{item.progress}%</span>
                </div>
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
