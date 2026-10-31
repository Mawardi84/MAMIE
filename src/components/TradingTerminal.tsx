import { useState } from 'react';
import { useAsset } from '../context/AssetContext';
import { ASSETS, ASSET_CATEGORIES, type AssetCategory } from '../data/assetRegistry';
import { Star, Search, X } from 'lucide-react';
import TickerTape from './TickerTape';
import MarketHeatmap from './MarketHeatmap';
import LivePriceDisplay from './LivePriceDisplay';

export default function TradingTerminal() {
  const { currentAsset, setCurrentAsset, watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useAsset();
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = ASSETS.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryColors: Record<AssetCategory, string> = {
    metals: 'text-amber-400',
    forex: 'text-blue-400',
    crypto: 'text-purple-400',
    commodities: 'text-orange-400',
    indices: 'text-emerald-400',
    stocks: 'text-cyan-400',
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Ticker Tape */}
      <TickerTape />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAssetPicker(!showAssetPicker)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
              >
                <span className="text-white font-bold">{currentAsset.shortName}</span>
                <span className="text-gray-400 text-sm">{currentAsset.symbol}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[currentAsset.category]} bg-gray-900`}>
                  {ASSET_CATEGORIES[currentAsset.category].icon}
                </span>
              </button>

              {/* Watchlist Quick Access */}
              <div className="hidden md:flex items-center gap-1">
                {watchlist
                  .filter((a) => a.symbol !== currentAsset.symbol)
                  .slice(0, 8)
                  .map((asset) => (
                    <button
                      key={asset.symbol}
                      onClick={() => setCurrentAsset(asset)}
                      className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-gray-300 transition-colors"
                    >
                      {asset.shortName}
                    </button>
                  ))}
              </div>
            </div>

            {/* Search */}
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
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 w-64"
              />
            </div>
          </div>
        </div>

        {/* Asset Picker Dropdown */}
        {showAssetPicker && (
          <div className="absolute top-32 right-4 z-50 w-96 max-h-[600px] bg-gray-900 border border-gray-800 rounded-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <h3 className="text-white font-semibold text-sm">Select Asset</h3>
              <button onClick={() => setShowAssetPicker(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[500px] p-3">
              {Object.entries(ASSET_CATEGORIES).map(([catKey, catInfo]) => {
                const categoryAssets = filteredAssets.filter((a) => a.category === catKey);
                if (categoryAssets.length === 0) return null;
                return (
                  <div key={catKey} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span>{catInfo.icon}</span>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {catInfo.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {categoryAssets.map((asset) => (
                        <div
                          key={asset.symbol}
                          className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                            asset.symbol === currentAsset.symbol
                              ? 'bg-amber-500/10 border-amber-500/30'
                              : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800'
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
                              className={`w-3.5 h-3.5 ${
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
          </div>
        )}

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-y-auto">
          {/* Left Column - Price Display */}
          <div className="lg:col-span-1 space-y-4">
            <LivePriceDisplay />
            
            {/* Market Status */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold text-sm mb-3">Market Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Exchange</span>
                  <span className="text-white text-xs font-medium">{currentAsset.exchange}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Trading Hours</span>
                  <span className="text-white text-xs font-medium">{currentAsset.tradingHours}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Currency</span>
                  <span className="text-white text-xs font-medium">{currentAsset.currency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Tick Size</span>
                  <span className="text-white text-xs font-mono">{currentAsset.tickSize}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle & Right Columns - Heatmap */}
          <div className="lg:col-span-2">
            <MarketHeatmap />
          </div>
        </div>
      </div>
    </div>
  );
}
