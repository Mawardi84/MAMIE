import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  useGoldSpotPrice, 
  useGoldPriceHistory, 
  useDXYData, 
  useVIXData, 
  useSilverData, 
  useVolatility, 
  useCorrelation, 
  useCOTData 
} from '../hooks/useDataHooks';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  DollarSign, 
  AlertTriangle, 
  RefreshCw, 
  Loader2,
  CheckCircle2,
  XCircle,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { testConnection } from '../services/dataService';

export default function Dashboard() {
  const { data: spotPrice, loading: spotLoading, error: spotError, lastUpdated, refetch: refetchSpot } = useGoldSpotPrice();
  const { data: priceHistory, loading: historyLoading, error: historyError, refetch: refetchHistory } = useGoldPriceHistory('1mo', '1d');
  const { data: dxyData, loading: dxyLoading, error: dxyError } = useDXYData('1mo');
  const { data: vixData } = useVIXData('1mo');
  const { data: silverData, loading: silverLoading, error: silverError } = useSilverData('1mo');
  const { data: cotData, loading: cotLoading, error: cotError, refetch: refetchCOT } = useCOTData(10);
  const { volatility } = useVolatility(priceHistory, 20);
  const { correlation: dxyCorrelation, loading: dxyCorrLoading } = useCorrelation(priceHistory, dxyData);
  const { correlation: silverCorrelation, loading: silverCorrLoading } = useCorrelation(priceHistory, silverData);

  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [connectionMessage, setConnectionMessage] = useState('Testing connection...');

  const currentPrice = spotPrice?.price || 0;
  const change = spotPrice?.change || 0;
  const changePercent = spotPrice?.changePercent || 0;

  // Test connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      setConnectionStatus('checking');
      const result = await testConnection();
      if (result.success) {
        setConnectionStatus('connected');
        setConnectionMessage(result.message);
      } else {
        setConnectionStatus('error');
        setConnectionMessage(result.message);
      }
    };
    checkConnection();
  }, []);

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

  const refetchAll = () => {
    refetchSpot();
    refetchHistory();
    refetchCOT();
  };

  const hasError = spotError || historyError;
  const isLoading = spotLoading || historyLoading;

  // Data source status
  const dataSources = [
    { name: 'Gold Spot', status: spotError ? 'error' : spotLoading ? 'loading' : spotPrice ? 'ok' : 'loading', error: spotError },
    { name: 'Price History', status: historyError ? 'error' : historyLoading ? 'loading' : priceHistory ? 'ok' : 'loading', error: historyError },
    { name: 'COT Reports', status: cotError ? 'error' : cotLoading ? 'loading' : cotData ? 'ok' : 'loading', error: cotError },
    { name: 'DXY', status: dxyError ? 'error' : dxyLoading ? 'loading' : dxyData ? 'ok' : 'loading', error: dxyError },
    { name: 'Silver', status: silverError ? 'error' : silverLoading ? 'loading' : silverData ? 'ok' : 'loading', error: silverError },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">XAU/USD Research Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time Quantitative Market Analysis</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
            connectionStatus === 'connected' ? 'bg-emerald-500/10 border-emerald-500/30' :
            connectionStatus === 'error' ? 'bg-red-500/10 border-red-500/30' :
            'bg-gray-800/50 border-gray-700/50'
          }`}>
            {connectionStatus === 'connected' ? (
              <Wifi className="w-3 h-3 text-emerald-400" />
            ) : connectionStatus === 'error' ? (
              <WifiOff className="w-3 h-3 text-red-400" />
            ) : (
              <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
            )}
            <span className={`text-xs font-medium ${
              connectionStatus === 'connected' ? 'text-emerald-400' :
              connectionStatus === 'error' ? 'text-red-400' :
              'text-gray-400'
            }`}>
              {connectionStatus === 'connected' ? 'CONNECTED' : 
               connectionStatus === 'error' ? 'DISCONNECTED' : 'CHECKING...'}
            </span>
          </div>
          
          {lastUpdated && (
            <span className="text-gray-400 text-xs">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          
          <button 
            onClick={refetchAll}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 text-xs font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh All
          </button>
        </div>
      </div>

      {/* Data Sources Status Bar */}
      <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-400 text-xs font-medium">Data Sources Status</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {dataSources.map((source, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-gray-900/50 rounded border border-gray-700/30">
              {source.status === 'ok' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              {source.status === 'loading' && <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />}
              {source.status === 'error' && <XCircle className="w-3 h-3 text-red-400" />}
              <span className="text-xs text-gray-300">{source.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {hasError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-red-400 font-semibold text-sm">Data Fetch Error</h3>
              <p className="text-gray-300 text-xs mt-1">{spotError || historyError}</p>
              <div className="mt-3 space-y-2">
                <p className="text-gray-400 text-xs">
                  <strong>Troubleshooting:</strong>
                </p>
                <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
                  <li>Check your internet connection</li>
                  <li>CORS proxies may be temporarily unavailable - try refreshing</li>
                  <li>Some APIs have rate limits - wait a few minutes and retry</li>
                  <li>If using ad-blocker, try disabling it for this site</li>
                </ul>
                <button 
                  onClick={refetchAll}
                  className="mt-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium transition-colors"
                >
                  Retry All Data Sources
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gold Price */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Gold Spot Price</span>
            {spotLoading ? (
              <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
            ) : (
              <DollarSign className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-white">
              {currentPrice ? `$${currentPrice.toFixed(2)}` : '---'}
            </span>
            {changePercent !== 0 && (
              <span className={`text-xs font-medium ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        {/* Realized Volatility */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Realized Vol (20d)</span>
            {historyLoading ? (
              <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
            ) : (
              <Activity className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-white">
              {latestVol ? `${latestVol.toFixed(1)}%` : '---'}
            </span>
            <span className="text-xs text-gray-500">Annualized</span>
          </div>
        </div>

        {/* DXY Correlation */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">DXY Correlation</span>
            {dxyCorrLoading ? (
              <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
            ) : (
              <TrendingDown className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-white">
              {dxyCorrelation !== null ? dxyCorrelation.toFixed(2) : '---'}
            </span>
            {dxyCorrelation !== null && (
              <span className={`text-xs font-medium ${dxyCorrelation < -0.5 ? 'text-red-400' : 'text-gray-400'}`}>
                {dxyCorrelation < -0.5 ? 'Strong Inverse' : dxyCorrelation < 0 ? 'Weak Inverse' : 'Positive'}
              </span>
            )}
          </div>
        </div>

        {/* Silver Correlation */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Silver Correlation</span>
            {silverCorrLoading ? (
              <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
            ) : (
              <BarChart3 className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-white">
              {silverCorrelation !== null ? silverCorrelation.toFixed(2) : '---'}
            </span>
            {silverCorrelation !== null && (
              <span className={`text-xs font-medium ${silverCorrelation > 0.7 ? 'text-emerald-400' : 'text-gray-400'}`}>
                {silverCorrelation > 0.7 ? 'Strong' : silverCorrelation > 0.3 ? 'Moderate' : 'Weak'}
              </span>
            )}
          </div>
        </div>
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
            <div className="h-[280px] flex flex-col items-center justify-center text-gray-500 gap-2">
              {historyLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xs">Loading price data...</span>
                </>
              ) : historyError ? (
                <>
                  <XCircle className="w-6 h-6 text-red-400" />
                  <span className="text-xs text-red-400">Failed to load data</span>
                </>
              ) : (
                <span className="text-xs">No data available</span>
              )}
            </div>
          )}
        </div>

        {/* COT Positioning */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">COT Positioning (Latest)</h3>
            {cotLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
          </div>
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
          ) : cotError ? (
            <div className="h-[200px] flex flex-col items-center justify-center text-gray-500 gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-xs text-red-400">Failed to load COT data</span>
              <button 
                onClick={refetchCOT}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
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
              {historyLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-xs">Calculating...</span>
                </div>
              ) : (
                'No data available'
              )}
            </div>
          )}
        </div>

        {/* Macro Correlation */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Macro Factor Correlation (1-Month)</h3>
          <div className="space-y-3">
            {[
              { factor: 'DXY (US Dollar Index)', correlation: dxyCorrelation, loading: dxyCorrLoading, error: dxyError },
              { factor: 'Silver', correlation: silverCorrelation, loading: silverCorrLoading, error: silverError },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-700/30 last:border-0">
                <span className="text-gray-300 text-xs w-40">{item.factor}</span>
                <div className="flex-1 mx-3">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    {item.loading ? (
                      <div className="h-full bg-gray-600 animate-pulse rounded-full" style={{ width: '50%' }} />
                    ) : item.correlation !== null ? (
                      <div
                        className={`h-full rounded-full ${item.correlation > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ 
                          width: `${Math.abs(item.correlation) * 100}%`,
                          marginLeft: item.correlation < 0 ? `${(1 + item.correlation) * 100}%` : '0'
                        }}
                      />
                    ) : (
                      <div className="h-full bg-gray-600 rounded-full" style={{ width: '0%' }} />
                    )}
                  </div>
                </div>
                <span className={`text-xs font-mono w-12 text-right ${
                  item.correlation === null ? 'text-gray-500' :
                  item.correlation > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {item.loading ? '...' : item.correlation !== null ? `${item.correlation > 0 ? '+' : ''}${item.correlation.toFixed(2)}` : 'N/A'}
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
          <div className="flex-1">
            <h3 className="text-blue-400 font-semibold text-sm">Live Data Sources</h3>
            <p className="text-gray-300 text-xs mt-1">
              This dashboard fetches real-time data from Yahoo Finance (Gold, DXY, VIX, Silver) and CFTC (COT Reports). 
              Data is fetched through CORS proxies to bypass browser restrictions. 
              If data fails to load, try refreshing or check your internet connection.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">Yahoo Finance API</span>
              <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">CFTC COT API</span>
              <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">CORS Proxy Fallback</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
