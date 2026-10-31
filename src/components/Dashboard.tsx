import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useAsset } from '../context/AssetContext';
import { useAssetQuote, useAssetPriceHistory, useAssetCOT, useVolatility, useAssetPriceHistory as useHistory } from '../hooks/useDataHooks';
import { ASSETS, ASSET_CATEGORIES, getAssetsByCategory, type Asset, type AssetCategory } from '../data/assetRegistry';
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
  Star,
  Search,
} from 'lucide-react';
import { testConnection } from '../services/dataService';

export default function Dashboard() {
  const { currentAsset, setCurrentAsset, watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useAsset();
  const { data: quote, loading: quoteLoading, error: quoteError, lastUpdated, refetch: refetchQuote } = useAssetQuote(currentAsset);
  const { data: priceHistory, loading: historyLoading, error: historyError, refetch: refetchHistory } = useAssetPriceHistory(currentAsset, '3mo', '1d');
  const { data: cotData, loading: cotLoading, error: cotError, refetch: refetchCOT } = useAssetCOT(currentAsset, 10);
  const { volatility } = useVolatility(priceHistory, 20);

  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssetPicker, setShowAssetPicker] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      setConnectionStatus('checking');
      const result = await testConnection();
      setConnectionStatus(result.success ? 'connected' : 'error');
    };
    checkConnection();
  }, []);

  const currentPrice = quote?.price || 0;
  const change = quote?.change || 0;
  const changePercent = quote?.changePercent || 0;

  const chartData = priceHistory?.map((d) => ({
    date: d.date,
    price: d.close,
    volume: d.volume,
  })) || [];

  const volChartData =
    priceHistory
      ?.map((d, i) => ({
        date: d.date,
        realized: volatility?.[i] || 0,
      }))
      .filter((d) => d.realized > 0) || [];

  const latestVol = volatility?.filter((v) => v > 0).slice(-1)[0] || 0;

  const latestCOT = cotData?.[0];
  const prevCOT = cotData?.[1];
  const netSpecChange =
    latestCOT && prevCOT
      ? latestCOT.nonCommercialLong -
        latestCOT.nonCommercialShort -
        (prevCOT.nonCommercialLong - prevCOT.nonCommercialShort)
      : 0;

  const filteredAssets = ASSETS.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const refetchAll = () => {
    refetchQuote();
    refetchHistory();
    if (currentAsset.hasCOT) refetchCOT();
  };

  const isLoading = quoteLoading || historyLoading;

  // Category colors
  const categoryColors: Record<AssetCategory, string> = {
    metals: 'text-amber-400',
    forex: 'text-blue-400',
    crypto: 'text-purple-400',
    commodities: 'text-orange-400',
    indices: 'text-emerald-400',
    stocks: 'text-cyan-400',
    bonds: 'text-indigo-400',
  };

  return (
    <div className="space-y-6">
      {/* Header with Asset Selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Multi-Asset Dashboard</h1>
            <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[currentAsset.category]} bg-gray-800 border border-gray-700`}>
              {ASSET_CATEGORIES[currentAsset.category].icon} {ASSET_CATEGORIES[currentAsset.category].label}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">Quantitative Research Platform — Stocks, Crypto, Commodities, Forex, Metals</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              connectionStatus === 'connected'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : connectionStatus === 'error'
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-gray-800/50 border-gray-700/50'
            }`}
          >
            {connectionStatus === 'connected' ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : connectionStatus === 'error' ? (
              <XCircle className="w-3 h-3 text-red-400" />
            ) : (
              <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
            )}
            <span
              className={`text-xs font-medium ${
                connectionStatus === 'connected'
                  ? 'text-emerald-400'
                  : connectionStatus === 'error'
                  ? 'text-red-400'
                  : 'text-gray-400'
              }`}
            >
              {connectionStatus === 'connected' ? 'LIVE' : connectionStatus === 'error' ? 'OFFLINE' : '...'}
            </span>
          </div>
          <button
            onClick={refetchAll}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 text-xs font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Asset Selector Bar */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Current Asset */}
          <button
            onClick={() => setShowAssetPicker(!showAssetPicker)}
            className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors"
          >
            <span className="text-amber-400 font-bold text-sm">{currentAsset.shortName}</span>
            <span className="text-gray-400 text-xs">{currentAsset.symbol}</span>
            <span className={`text-xs font-medium ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${currentPrice.toFixed(2)}
            </span>
          </button>

          {/* Watchlist Quick Access */}
          <div className="flex items-center gap-1 flex-wrap">
            {watchlist
              .filter((a) => a.symbol !== currentAsset.symbol)
              .slice(0, 6)
              .map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setCurrentAsset(asset)}
                  className="px-2 py-1 text-xs bg-gray-900/50 hover:bg-gray-700/50 border border-gray-700/50 rounded text-gray-300 transition-colors"
                >
                  {asset.shortName}
                </button>
              ))}
          </div>

          {/* Search */}
          <div className="relative ml-auto">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowAssetPicker(true)}
              className="pl-7 pr-3 py-1.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 w-48"
            />
          </div>
        </div>

        {/* Asset Picker Dropdown */}
        {showAssetPicker && (
          <div className="mt-3 pt-3 border-t border-gray-700/50 max-h-96 overflow-y-auto">
            {Object.entries(ASSET_CATEGORIES).map(([catKey, catInfo]) => {
              const categoryAssets = filteredAssets.filter((a) => a.category === catKey);
              if (categoryAssets.length === 0) return null;
              return (
                <div key={catKey} className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{catInfo.icon}</span>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{catInfo.label}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
                    {categoryAssets.map((asset) => (
                      <div
                        key={asset.symbol}
                        className={`flex items-center gap-1.5 p-2 rounded border cursor-pointer transition-colors ${
                          asset.symbol === currentAsset.symbol
                            ? 'bg-amber-500/10 border-amber-500/30'
                            : 'bg-gray-900/30 border-gray-700/30 hover:bg-gray-800/50'
                        }`}
                        onClick={() => {
                          setCurrentAsset(asset);
                          setShowAssetPicker(false);
                          setSearchQuery('');
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isInWatchlist(asset.symbol)) {
                              removeFromWatchlist(asset.symbol);
                            } else {
                              addToWatchlist(asset);
                            }
                          }}
                          className="flex-shrink-0"
                        >
                          <Star
                            className={`w-3 h-3 ${
                              isInWatchlist(asset.symbol) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                            }`}
                          />
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="text-white text-xs font-medium truncate">{asset.shortName}</div>
                          <div className="text-gray-500 text-[10px] truncate">{asset.symbol}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Asset Info Card */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-white">{currentAsset.name}</h2>
              <span className="text-xs px-2 py-0.5 bg-gray-700/50 rounded text-gray-400">{currentAsset.exchange}</span>
              {currentAsset.hasCOT && (
                <span className="text-xs px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400">
                  COT Available
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs">{currentAsset.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>🕒 {currentAsset.tradingHours}</span>
              <span>💱 {currentAsset.currency}</span>
              <span>📏 Tick: {currentAsset.tickSize}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {quoteLoading ? '...' : `$${currentPrice.toFixed(2)}`}
            </div>
            <div className={`text-sm font-medium ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {change >= 0 ? '+' : ''}
              {change.toFixed(2)} ({changePercent.toFixed(2)}%)
            </div>
            {lastUpdated && (
              <div className="text-xs text-gray-500 mt-1">Updated: {lastUpdated.toLocaleTimeString()}</div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-xs">Day Range</span>
            <Activity className="w-3 h-3 text-gray-500" />
          </div>
          <div className="text-sm font-bold text-white">
            ${quote?.low.toFixed(2)} - ${quote?.high.toFixed(2)}
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-xs">Volume</span>
            <BarChart3 className="w-3 h-3 text-gray-500" />
          </div>
          <div className="text-sm font-bold text-white">
            {quote?.volume ? (quote.volume / 1000000).toFixed(2) + 'M' : '---'}
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-xs">Realized Vol (20d)</span>
            <TrendingUp className="w-3 h-3 text-gray-500" />
          </div>
          <div className="text-sm font-bold text-white">{latestVol ? `${latestVol.toFixed(1)}%` : '---'}</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-xs">Previous Close</span>
            <DollarSign className="w-3 h-3 text-gray-500" />
          </div>
          <div className="text-sm font-bold text-white">${quote?.previousClose.toFixed(2) || '---'}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Price Chart */}
        <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">
              {currentAsset.shortName} Price History (3 Months)
            </h3>
            {historyLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
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
                />
                <Area type="monotone" dataKey="price" stroke="#f59e0b" fill="url(#priceGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              {historyLoading ? 'Loading...' : historyError ? 'Failed to load' : 'No data'}
            </div>
          )}
        </div>

        {/* COT or Asset Info */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          {currentAsset.hasCOT ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">COT Positioning</h3>
                {cotLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
              </div>
              {latestCOT ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-gray-700/30">
                    <span className="text-gray-300 text-xs">Speculative Net</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium">
                        {((latestCOT.nonCommercialLong - latestCOT.nonCommercialShort) / 1000).toFixed(0)}K
                      </span>
                      <span className={`text-xs ${netSpecChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {netSpecChange > 0 ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-700/30">
                    <span className="text-gray-300 text-xs">Non-Comm Long</span>
                    <span className="text-white text-sm font-medium">
                      {(latestCOT.nonCommercialLong / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-700/30">
                    <span className="text-gray-300 text-xs">Non-Comm Short</span>
                    <span className="text-white text-sm font-medium">
                      {(latestCOT.nonCommercialShort / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-700/30">
                    <span className="text-gray-300 text-xs">Commercial Long</span>
                    <span className="text-white text-sm font-medium">
                      {(latestCOT.commercialLong / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-300 text-xs">Commercial Short</span>
                    <span className="text-white text-sm font-medium">
                      {(latestCOT.commercialShort / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-700/30">
                    <span className="text-gray-500 text-xs">Report: {latestCOT.date}</span>
                  </div>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-gray-500 text-xs">
                  {cotError ? 'Failed to load COT data' : 'Loading...'}
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="text-white font-semibold text-sm mb-4">Asset Details</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-900/50 rounded-lg">
                  <div className="text-gray-500 text-xs mb-1">Category</div>
                  <div className="text-white text-sm">{ASSET_CATEGORIES[currentAsset.category].label}</div>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-lg">
                  <div className="text-gray-500 text-xs mb-1">Exchange</div>
                  <div className="text-white text-sm">{currentAsset.exchange}</div>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-lg">
                  <div className="text-gray-500 text-xs mb-1">Trading Hours</div>
                  <div className="text-white text-sm">{currentAsset.tradingHours}</div>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-lg">
                  <div className="text-gray-500 text-xs mb-1">Quote Currency</div>
                  <div className="text-white text-sm">{currentAsset.currency}</div>
                </div>
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                  <p className="text-amber-300 text-xs">
                    💡 COT positioning data not available for this asset. Available for futures & major forex pairs.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Volatility Chart */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-4">
          Realized Volatility (20-day rolling, Annualized %)
        </h3>
        {volChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={volChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={Math.floor(volChartData.length / 5)} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="realized" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-gray-500">
            {historyLoading ? 'Calculating...' : 'No data'}
          </div>
        )}
      </div>

      {/* Multi-Asset Info */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-blue-400 font-semibold text-sm">Multi-Asset Research Platform</h3>
            <p className="text-gray-300 text-xs mt-1">
              This platform supports quantitative research across multiple asset classes: Precious Metals, Forex,
              Cryptocurrency, Commodities (Energy, Agriculture, Industrial), Market Indices, and Individual Stocks.
              All data is fetched in real-time from public APIs.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(ASSET_CATEGORIES).map(([key, cat]) => (
                <span key={key} className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">
                  {cat.icon} {cat.label}: {getAssetsByCategory(key as AssetCategory).length} assets
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
