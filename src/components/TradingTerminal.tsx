import { useState, useEffect } from 'react';
import { useAsset } from '../context/AssetContext';
import { ASSETS, ASSET_CATEGORIES, type Asset, type AssetCategory } from '../data/assetRegistry';
import { fetchMultipleQuotes, type AssetQuote } from '../services/dataService';
import CandlestickChart from './CandlestickChart';
import OrderBook from './OrderBook';
import TradingPanel from './TradingPanel';
import MarketOverview from './MarketOverview';
import { Star, Search, X, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function TradingTerminal() {
  const { currentAsset, setCurrentAsset, watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useAsset();
  const [quotes, setQuotes] = useState<Record<string, AssetQuote>>({});
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const symbols = ASSETS.map(a => a.symbol);
        const newQuotes = await fetchMultipleQuotes(symbols);
        setQuotes(newQuotes);
      } catch (e) {
        console.error('Failed to fetch quotes:', e);
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredAssets = ASSETS.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentQuote = quotes[currentAsset.symbol];

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
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Asset Picker Modal */}
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

      {/* Top Bar - Asset Info */}
      <div className="bg-gray-900/50 border-b border-gray-800/50 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAssetPicker(true)}
              className="flex items-center gap-3 px-4 py-2 premium-card hover:bg-gray-800/50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-lg">{currentAsset.shortName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[currentAsset.category]} bg-gray-900/50`}>
                    {ASSET_CATEGORIES[currentAsset.category].icon}
                  </span>
                </div>
                <div className="text-gray-400 text-xs">{currentAsset.symbol}</div>
              </div>
            </button>

            {currentQuote && (
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-2xl font-bold text-white font-mono">
                    {currentQuote.price.toFixed(currentAsset.category === 'forex' ? 4 : 2)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 ${currentQuote.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {currentQuote.change >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span className="text-sm font-mono font-semibold">
                        {currentQuote.change >= 0 ? '+' : ''}{currentQuote.change.toFixed(2)}
                      </span>
                    </div>
                    <span className={`text-sm font-mono font-semibold ${currentQuote.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ({currentQuote.changePercent >= 0 ? '+' : ''}{currentQuote.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <div className="text-gray-500">High</div>
                    <div className="text-white font-mono">{currentQuote.high.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Low</div>
                    <div className="text-white font-mono">{currentQuote.low.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Volume</div>
                    <div className="text-white font-mono">
                      {currentQuote.volume >= 1000000 
                        ? `${(currentQuote.volume / 1000000).toFixed(2)}M`
                        : currentQuote.volume >= 1000
                        ? `${(currentQuote.volume / 1000).toFixed(1)}K`
                        : currentQuote.volume.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAssetPicker(true);
                }}
                onFocus={() => setShowAssetPicker(true)}
                className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Trading Layout */}
      <div className="flex-1 grid grid-cols-12 gap-2 p-2 overflow-hidden">
        {/* Left - Chart */}
        <div className="col-span-12 lg:col-span-7 flex flex-col">
          <CandlestickChart />
        </div>

        {/* Middle - Order Book */}
        <div className="col-span-12 lg:col-span-2">
          <OrderBook />
        </div>

        {/* Right - Trading Panel & Market Overview */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-2 overflow-y-auto">
          <TradingPanel />
          <div className="flex-1 min-h-0">
            <MarketOverview />
          </div>
        </div>
      </div>
    </div>
  );
}
