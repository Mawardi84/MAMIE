import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useGoldSpotPrice, useGoldPriceHistory, useDXYData, useVIXData, useSilverData, useVolatility, useCorrelation, useCOTData } from '../hooks/useDataHooks';
import { TrendingUp, TrendingDown, Activity, BarChart3, DollarSign, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { data: spotPrice, loading: spotLoading, error: spotError, lastUpdated, refetch: refetchSpot } = useGoldSpotPrice();
  const { data: priceHistory, loading: historyLoading, error: historyError } = useGoldPriceHistory('1mo', '1d');
  const { data: dxyData } = useDXYData('1mo');
  const { data: vixData } = useVIXData('1mo');
  const { data: silverData } = useSilverData('1mo');
  const { data: cotData } = useCOTData(10);
  const { volatility } = useVolatility(priceHistory, 20);
  const { correlation: dxyCorrelation } = useCorrelation(priceHistory, dxyData);
  const { correlation: silverCorrelation } = useCorrelation(priceHistory, silverData);

  const currentPrice = spotPrice?.price || 0;
  const change = spotPrice?.change || 0;
  const changePercent = spotPrice?.changePercent || 0;

  // Prepare chart data
  const chartData = priceHistory?.map(d => ({
    date: d.date,
    price: d.close,
    volume: d.volume,
  })) || [];

  // Prepare volatility chart data
  const volChartData = priceHistory?.map((d, i) => ({
    date: d.date,
    realized: volatility?.[i] || 0,
  })).filter(d => d.realized > 0) || [];

  // Latest volatility
  const latestVol = volatility?.filter(v => v > 0).slice(-1)[0] || 0;

  // COT positioning data
  const latestCOT = cotData?.[0];
  const prevCOT = cotData?.[1];
  const netSpecChange = latestCOT && prevCOT 
    ? (latestCOT.nonCommercialLong - latestCOT.nonCommercialShort) - (prevCOT.nonCommercialLong - prevCOT.nonCommercialShort)
    : 0;

  const stats = [
    { 
      label: 'Gold Spot Price', 
      value: currentPrice ? `$${currentPrice.toFixed(2)}` : '---', 
      change: changePercent ? `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%` : '---',
      icon: DollarSign, 
      positive: change >= 0,
      loading: spotLoading,
    },
    { 
      label: 'Realized Vol (20d)', 
      value: latestVol ? `${latestVol.toFixed(1)}%` : '---',
      change: 'Annualized',
      icon: Activity, 
      positive: false,
      loading: historyLoading,
    },
    { 
      label: 'DXY Correlation', 
      value: dxyCorrelation !== null ? dxyCorrelation.toFixed(2) : '---',
      change: dxyCorrelation !== null ? (dxyCorrelation < -0.5 ? 'Strong Inverse' : 'Weak') : '---',
      icon: TrendingDown, 
      positive: dxyCorrelation !== null && dxyCorrelation < 0,
      loading: false,
    },
    { 
      label: 'Silver Correlation', 
      value: silverCorrelation !== null ? silverCorrelation.toFixed(2) : '---',
      change: silverCorrelation !== null ? (silverCorrelation > 0.7 ? 'Strong' : 'Moderate') : '---',
      icon: BarChart3, 
      positive: silverCorrelation !== null && silverCorrelation > 0,
      loading: false,
    },
  ];

  const isLoading = spotLoading || historyLoading;

  if (spotError || historyError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">XAU/USD Research Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Real-time Quantitative Market Analysis</p>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-red-400 font-semibold">Data Fetch Error</h3>
              <p className="text-gray-300 text-sm mt-1">{spotError || historyError}</p>
              <p className="text-gray-400 text-xs mt-2">
                Note: Some APIs may have CORS restrictions. In production, use a backend proxy.
              </p>
              <button 
                onClick={refetchSpot}
                className="mt-3 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">XAU/USD Research Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time Quantitative Market Analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-xs font-medium">LIVE DATA</span>
          </div>
          {lastUpdated && (
            <span className="text-gray-400 text-sm">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={refetchSpot}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${spotLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">{stat.label}</span>
              {stat.loading ? (
                <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
              ) : (
                <stat.icon className="w-4 h-4 text-gray-500" />
              )}
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
            <h3 className="text-white font-semibold text-sm">XAU/USD Price History (1 Month)</h3>
            {historyLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={Math.floor(chartData.length / 6)} />
                <YAxis stroke="#6b7280" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Area type="monotone" dataKey="price" stroke="#f59e0b" fill="url(#priceGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-500">
              {historyLoading ? 'Loading...' : 'No data available'}
            </div>
          )}
        </div>

        {/* COT Positioning */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">COT Positioning (Latest)</h3>
          {latestCOT ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-700/30">
                <div>
                  <span className="text-gray-300 text-xs">Managed Money Net</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-white text-sm font-medium">
                      {((latestCOT.nonCommercialLong - latestCOT.nonCommercialShort) / 1000).toFixed(0)}K
                    </span>
                    <span className={`text-xs ${netSpecChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {netSpecChange > 0 ? '▲' : '▼'} {Math.abs(netSpecChange / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
                {netSpecChange > 0 ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-700/30">
                <div>
                  <span className="text-gray-300 text-xs">Non-Comm Long</span>
                  <div className="text-white text-sm font-medium mt-0.5">
                    {(latestCOT.nonCommercialLong / 1000).toFixed(0)}K contracts
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-700/30">
                <div>
                  <span className="text-gray-300 text-xs">Non-Comm Short</span>
                  <div className="text-white text-sm font-medium mt-0.5">
                    {(latestCOT.nonCommercialShort / 1000).toFixed(0)}K contracts
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-700/30">
                <div>
                  <span className="text-gray-300 text-xs">Commercial Long</span>
                  <div className="text-white text-sm font-medium mt-0.5">
                    {(latestCOT.commercialLong / 1000).toFixed(0)}K contracts
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-gray-300 text-xs">Commercial Short</span>
                  <div className="text-white text-sm font-medium mt-0.5">
                    {(latestCOT.commercialShort / 1000).toFixed(0)}K contracts
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-700/30">
                <span className="text-gray-500 text-xs">Report Date: {latestCOT.date}</span>
              </div>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              Loading COT data...
            </div>
          )}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Volatility */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Realized Volatility (20-day rolling, Annualized %)</h3>
          {volChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={volChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={Math.floor(volChartData.length / 5)} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Area type="monotone" dataKey="realized" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} name="Realized Vol" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              {historyLoading ? 'Calculating...' : 'No data available'}
            </div>
          )}
        </div>

        {/* Macro Correlation */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Macro Factor Correlation (1-Month)</h3>
          <div className="space-y-3">
            {[
              { factor: 'DXY (US Dollar Index)', correlation: dxyCorrelation, loading: !dxyData },
              { factor: 'Silver', correlation: silverCorrelation, loading: !silverData },
              { factor: 'VIX', correlation: null, loading: !vixData },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-700/30 last:border-0">
                <span className="text-gray-300 text-xs w-40">{item.factor}</span>
                <div className="flex-1 mx-3">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    {item.correlation !== null && !item.loading ? (
                      <div
                        className={`h-full rounded-full ${item.correlation > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ 
                          width: `${Math.abs(item.correlation) * 100}%`,
                          marginLeft: item.correlation < 0 ? `${(1 + item.correlation) * 100}%` : '0'
                        }}
                      />
                    ) : (
                      <div className="h-full bg-gray-600 animate-pulse rounded-full" style={{ width: '50%' }} />
                    )}
                  </div>
                </div>
                <span className={`text-xs font-mono w-12 text-right ${
                  item.correlation === null ? 'text-gray-500' :
                  item.correlation > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {item.loading ? '---' : item.correlation !== null ? `${item.correlation > 0 ? '+' : ''}${item.correlation.toFixed(2)}` : '---'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700/30">
            <p className="text-gray-500 text-xs">
              * Correlations calculated from daily log returns over 1-month period
            </p>
          </div>
        </div>
      </div>

      {/* Data Source Info */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-blue-400 font-semibold text-sm">Live Data Sources</h3>
            <p className="text-gray-300 text-xs mt-1">
              This dashboard fetches real-time data from Yahoo Finance (Gold, DXY, VIX, Silver) and CFTC (COT Reports). 
              Data is cached for 1-5 minutes to reduce API calls. Some data may have delays depending on the source.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
