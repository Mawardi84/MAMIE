import { useState, useEffect } from 'react';
import { useAsset } from '../context/AssetContext';
import { ASSETS, ASSET_CATEGORIES, type Asset, type AssetCategory } from '../data/assetRegistry';
import { fetchMultipleQuotes, type AssetQuote } from '../services/dataService';
import { Star, Search, X, TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TradingTerminal() {
  const { currentAsset, setCurrentAsset, watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useAsset();
  const [quotes, setQuotes] = useState<Record<string, AssetQuote>>({});
  const [prevQuotes, setPrevQuotes] = useState<Record<string, number>>({});
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const symbols = ASSETS.map(a => a.symbol);
        const newQuotes = await fetchMultipleQuotes(symbols);
        
        // Store previous prices for flash effect
        const prev: Record<string, number> = {};
        Object.entries(quotes).forEach(([symbol, quote]) => {
          prev[symbol] = quote.price;
        });
        setPrevQuotes(prev);
        setQuotes(newQuotes);
        setLoading(false);
      } catch (e) {
        console.error('Failed to fetch quotes:', e);
        setLoading(false);
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 60000); // Update every 60s
    return () => clearInterval(interval);
  }, []);

  const filteredAssets = ASSETS.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentQuote = quotes[currentAsset.symbol];
  const prevPrice = prevQuotes[currentAsset.symbol];
  const priceChange = currentQuote && prevPrice ? currentQuote.price - prevPrice : 0;
  const flashClass = priceChange > 0 ? 'flash-up' : priceChange < 0 ? 'flash-down' : '';

  const categoryColors: Record<AssetCategory, string> = {
    metals: 'text-amber-400',
    forex: 'text-blue-400',
    crypto: 'text-purple-400',
    commodities: 'text-orange-400',
    indices: 'text-emerald-400',
    stocks: 'text-cyan-400',
    bonds: 'text-indigo-400',
  };

  const getHeatColor = (changePercent: number): string => {
    if (changePercent >= 3) return 'bg-emerald-600';
    if (changePercent >= 2) return 'bg-emerald-500';
    if (changePercent >= 1) return 'bg-emerald-400';
    if (changePercent >= 0.5) return 'bg-emerald-300';
    if (changePercent >= 0) return 'bg-emerald-200';
    if (changePercent >= -0.5) return 'bg-red-200';
    if (changePercent >= -1) return 'bg-red-300';
    if (changePercent >= -2) return 'bg-red-400';
    if (changePercent >= -3) return 'bg-red-500';
    return 'bg-red-600';
  };

  const getTextColor = (changePercent: number): string => {
    if (Math.abs(changePercent) >= 2) return 'text-white';
    return 'text-gray-900';
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] bg-mesh">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gray-900/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gold-accent flex items-center justify-center pulse-gold">
                  <span className="text-sm font-bold text-gray-900">Q</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gradient-gold">Multi-Asset Terminal</h1>
                  <p className="text-xs text-gray-400">Professional Quantitative Research</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAssetPicker(!showAssetPicker)}
                className="btn-premium flex items-center gap-2"
              >
                <span className="text-white font-bold">{currentAsset.shortName}</span>
                <span className="text-gray-400 text-sm">{currentAsset.symbol}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[currentAsset.category]} bg-gray-900/50`}>
                  {ASSET_CATEGORIES[currentAsset.category].icon}
                </span>
              </button>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search 60+ assets..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowAssetPicker(true);
                  }}
                  onFocus={() => setShowAssetPicker(true)}
                  className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 w-64 backdrop-blur-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Asset Picker Dropdown */}
      {showAssetPicker && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm" onClick={() => setShowAssetPicker(false)}>
          <div className="w-full max-w-5xl max-h-[70vh] premium-card overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50">
              <h3 className="text-white font-semibold text-lg">Select Asset</h3>
              <button onClick={() => setShowAssetPicker(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(70vh-80px)] p-6">
              {Object.entries(ASSET_CATEGORIES).map(([catKey, catInfo]) => {
                const categoryAssets = filteredAssets.filter((a) => a.category === catKey);
                if (categoryAssets.length === 0) return null;
                return (
                  <div key={catKey} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{catInfo.icon}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wide">{catInfo.label}</h4>
                        <p className="text-xs text-gray-400">{catInfo.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {categoryAssets.map((asset) => {
                        const quote = quotes[asset.symbol];
                        return (
                          <div
                            key={asset.symbol}
                            className={`premium-card p-3 cursor-pointer transition-all hover:scale-105 ${
                              asset.symbol === currentAsset.symbol ? 'ring-2 ring-amber-500/50' : ''
                            }`}
                            onClick={() => {
                              setCurrentAsset(asset);
                              setShowAssetPicker(false);
                              setSearchQuery('');
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-semibold truncate">{asset.shortName}</div>
                                <div className="text-gray-500 text-xs truncate">{asset.symbol}</div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isInWatchlist(asset.symbol)) {
                                    removeFromWatchlist(asset.symbol);
                                  } else {
                                    addToWatchlist(asset);
                                  }
                                }}
                                className="flex-shrink-0 ml-2"
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    isInWatchlist(asset.symbol) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                                  }`}
                                />
                              </button>
                            </div>
                            {quote && (
                              <div className="flex items-end justify-between">
                                <div className="text-white font-mono text-sm font-bold">
                                  {quote.price.toFixed(asset.category === 'forex' ? 4 : 2)}
                                </div>
                                <div className={`text-xs font-mono font-semibold ${quote.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Live Price & Stats */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Live Price Display */}
            <div className={`premium-card p-6 ${flashClass}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-white">{currentAsset.shortName}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[currentAsset.category]} bg-gray-900/50`}>
                      {ASSET_CATEGORIES[currentAsset.category].icon}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">{currentAsset.name}</div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-semibold">LIVE</span>
                </div>
              </div>

              {loading || !currentQuote ? (
                <div className="space-y-3">
                  <div className="h-12 bg-gray-800/50 rounded shimmer"></div>
                  <div className="h-6 bg-gray-800/50 rounded shimmer w-1/2"></div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-bold text-white font-mono tracking-tight">
                        {currentQuote.price.toFixed(currentAsset.category === 'forex' ? 4 : 2)}
                      </span>
                      <span className="text-gray-500 text-sm">{currentAsset.currency}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1 ${currentQuote.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {currentQuote.change >= 0 ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5" />
                        )}
                        <span className="text-xl font-bold font-mono">
                          {currentQuote.change >= 0 ? '+' : ''}{currentQuote.change.toFixed(2)}
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-lg ${
                        currentQuote.changePercent >= 0 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        <span className="text-sm font-bold font-mono">
                          {currentQuote.changePercent >= 0 ? '+' : ''}{currentQuote.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800/50">
                    <div>
                      <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        High
                      </div>
                      <div className="text-white font-mono text-sm font-semibold">{currentQuote.high.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        Low
                      </div>
                      <div className="text-white font-mono text-sm font-semibold">{currentQuote.low.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        Volume
                      </div>
                      <div className="text-white font-mono text-sm font-semibold">
                        {currentQuote.volume >= 1000000 
                          ? `${(currentQuote.volume / 1000000).toFixed(2)}M`
                          : currentQuote.volume >= 1000
                          ? `${(currentQuote.volume / 1000).toFixed(1)}K`
                          : currentQuote.volume.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Market Status */}
            <div className="premium-card p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Market Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-800/30">
                  <span className="text-gray-400 text-sm">Exchange</span>
                  <span className="text-white text-sm font-medium">{currentAsset.exchange}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-800/30">
                  <span className="text-gray-400 text-sm">Trading Hours</span>
                  <span className="text-white text-sm font-medium">{currentAsset.tradingHours}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-800/30">
                  <span className="text-gray-400 text-sm">Currency</span>
                  <span className="text-white text-sm font-medium">{currentAsset.currency}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-800/30">
                  <span className="text-gray-400 text-sm">Tick Size</span>
                  <span className="text-white text-sm font-mono">{currentAsset.tickSize}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-400 text-sm">COT Data</span>
                  <span className={`text-sm font-medium ${currentAsset.hasCOT ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {currentAsset.hasCOT ? '✓ Available' : '✗ Not Available'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Market Heatmap */}
          <div className="col-span-12 lg:col-span-8">
            <div className="premium-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  Market Heatmap
                </h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-400">Performance:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-600 rounded"></div>
                    <span className="text-gray-400">-3%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-500 rounded"></div>
                    <span className="text-gray-400">0%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-emerald-600 rounded"></div>
                    <span className="text-gray-400">+3%</span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-gray-500 text-sm">Loading market data...</div>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(ASSET_CATEGORIES).map(([category, info]) => {
                    const categoryAssets = ASSETS.filter(a => a.category === category);
                    if (categoryAssets.length === 0) return null;

                    return (
                      <div key={category}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">{info.icon}</span>
                          <span className="text-gray-400 text-sm font-semibold uppercase tracking-wide">{info.label}</span>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
                          {categoryAssets.map((asset) => {
                            const quote = quotes[asset.symbol];
                            if (!quote) return null;

                            const heatColor = getHeatColor(quote.changePercent);
                            const textColor = getTextColor(quote.changePercent);

                            return (
                              <button
                                key={asset.symbol}
                                onClick={() => setCurrentAsset(asset)}
                                className={`${heatColor} ${textColor} rounded-lg p-3 hover:opacity-80 transition-all hover:scale-105 cursor-pointer text-left ${
                                  asset.symbol === currentAsset.symbol ? 'ring-2 ring-white/50' : ''
                                }`}
                              >
                                <div className="font-bold text-xs truncate mb-1">{asset.shortName}</div>
                                <div className="text-xs font-mono truncate mb-1">
                                  {quote.price.toFixed(asset.category === 'forex' ? 4 : 2)}
                                </div>
                                <div className="text-xs font-semibold">
                                  {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
