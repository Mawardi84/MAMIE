import { useState, useEffect } from 'react';
import { ASSETS, ASSET_CATEGORIES, type Asset, type AssetCategory } from '../data/assetRegistry';
import { fetchMultipleQuotes, type AssetQuote } from '../services/dataService';
import { useAsset } from '../context/AssetContext';

export default function MarketHeatmap() {
  const { setCurrentAsset } = useAsset();
  const [quotes, setQuotes] = useState<Record<string, AssetQuote>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const symbols = ASSETS.map(a => a.symbol);
        const newQuotes = await fetchMultipleQuotes(symbols);
        setQuotes(newQuotes);
      } catch (e) {
        console.error('Heatmap fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 60000); // Update every 60s
    return () => clearInterval(interval);
  }, []);

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
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">Market Heatmap</h3>
        <div className="flex items-center gap-2 text-xs">
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
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading market data...</div>
        </div>
      ) : (
        <div className="space-y-3">
          {(Object.entries(ASSET_CATEGORIES) as [AssetCategory, typeof ASSET_CATEGORIES[AssetCategory]][]).map(([category, info]) => {
            const categoryAssets = ASSETS.filter(a => a.category === category);
            if (categoryAssets.length === 0) return null;

            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{info.icon}</span>
                  <span className="text-gray-400 text-xs font-medium uppercase">{info.label}</span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-1">
                  {categoryAssets.map((asset) => {
                    const quote = quotes[asset.symbol];
                    if (!quote) return null;

                    const heatColor = getHeatColor(quote.changePercent);
                    const textColor = getTextColor(quote.changePercent);

                    return (
                      <button
                        key={asset.symbol}
                        onClick={() => setCurrentAsset(asset)}
                        className={`${heatColor} ${textColor} rounded p-2 hover:opacity-80 transition-opacity cursor-pointer text-left`}
                      >
                        <div className="font-bold text-xs truncate">{asset.shortName}</div>
                        <div className="text-xs font-mono truncate">
                          {quote.price.toFixed(asset.category === 'forex' ? 4 : 2)}
                        </div>
                        <div className="text-xs font-medium">
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
  );
}
