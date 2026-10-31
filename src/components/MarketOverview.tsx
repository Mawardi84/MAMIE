import { useState, useEffect } from 'react';
import { useAsset } from '../context/AssetContext';
import { ASSETS, ASSET_CATEGORIES, type AssetCategory } from '../data/assetRegistry';
import { fetchMultipleQuotes, type AssetQuote } from '../services/dataService';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

export default function MarketOverview() {
  const { setCurrentAsset } = useAsset();
  const [quotes, setQuotes] = useState<Record<string, AssetQuote>>({});
  const [sortBy, setSortBy] = useState<'name' | 'change' | 'volume'>('change');
  const [filterCategory, setFilterCategory] = useState<AssetCategory | 'all'>('all');

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const symbols = ASSETS.map(a => a.symbol);
        const newQuotes = await fetchMultipleQuotes(symbols);
        setQuotes(newQuotes);
      } catch (e) {
        console.error('Market overview fetch error:', e);
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredAssets = filterCategory === 'all' 
    ? ASSETS 
    : ASSETS.filter(a => a.category === filterCategory);

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const quoteA = quotes[a.symbol];
    const quoteB = quotes[b.symbol];
    
    if (!quoteA || !quoteB) return 0;

    switch (sortBy) {
      case 'change':
        return Math.abs(quoteB.changePercent) - Math.abs(quoteA.changePercent);
      case 'volume':
        return quoteB.volume - quoteA.volume;
      default:
        return a.shortName.localeCompare(b.shortName);
    }
  });

  // Top movers
  const topGainers = [...ASSETS]
    .filter(a => quotes[a.symbol])
    .sort((a, b) => quotes[b.symbol].changePercent - quotes[a.symbol].changePercent)
    .slice(0, 5);

  const topLosers = [...ASSETS]
    .filter(a => quotes[a.symbol])
    .sort((a, b) => quotes[a.symbol].changePercent - quotes[b.symbol].changePercent)
    .slice(0, 5);

  return (
    <div className="premium-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-semibold">Market Overview</h3>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-2 py-1 bg-gray-900/50 border border-gray-800 rounded text-xs text-white focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">All Assets</option>
            {Object.entries(ASSET_CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.icon} {cat.label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2 py-1 bg-gray-900/50 border border-gray-800 rounded text-xs text-white focus:outline-none focus:border-amber-500/50"
          >
            <option value="change">Sort: % Change</option>
            <option value="volume">Sort: Volume</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>

      {/* Top Movers */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
          <div className="flex items-center gap-1 mb-2">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-semibold">Top Gainers</span>
          </div>
          <div className="space-y-1">
            {topGainers.map(asset => {
              const quote = quotes[asset.symbol];
              if (!quote) return null;
              return (
                <button
                  key={asset.symbol}
                  onClick={() => setCurrentAsset(asset)}
                  className="w-full flex items-center justify-between text-xs hover:bg-gray-800/30 rounded px-1 py-0.5 transition-colors"
                >
                  <span className="text-white">{asset.shortName}</span>
                  <span className="text-emerald-400 font-mono font-semibold">+{quote.changePercent.toFixed(2)}%</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-1 mb-2">
            <TrendingDown className="w-3 h-3 text-red-400" />
            <span className="text-red-400 text-xs font-semibold">Top Losers</span>
          </div>
          <div className="space-y-1">
            {topLosers.map(asset => {
              const quote = quotes[asset.symbol];
              if (!quote) return null;
              return (
                <button
                  key={asset.symbol}
                  onClick={() => setCurrentAsset(asset)}
                  className="w-full flex items-center justify-between text-xs hover:bg-gray-800/30 rounded px-1 py-0.5 transition-colors"
                >
                  <span className="text-white">{asset.shortName}</span>
                  <span className="text-red-400 font-mono font-semibold">{quote.changePercent.toFixed(2)}%</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-gray-900/90 backdrop-blur-sm">
            <tr className="border-b border-gray-800/50">
              <th className="text-left text-gray-400 font-semibold py-2 px-2">Symbol</th>
              <th className="text-right text-gray-400 font-semibold py-2 px-2">Price</th>
              <th className="text-right text-gray-400 font-semibold py-2 px-2">Change</th>
              <th className="text-right text-gray-400 font-semibold py-2 px-2">Volume</th>
            </tr>
          </thead>
          <tbody>
            {sortedAssets.map(asset => {
              const quote = quotes[asset.symbol];
              if (!quote) return null;

              return (
                <tr
                  key={asset.symbol}
                  onClick={() => setCurrentAsset(asset)}
                  className="border-b border-gray-800/30 hover:bg-gray-800/30 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{asset.shortName}</span>
                      <span className="text-gray-500 text-[10px]">{ASSET_CATEGORIES[asset.category].icon}</span>
                    </div>
                  </td>
                  <td className="text-right py-2 px-2 text-white font-mono">
                    {quote.price.toFixed(asset.category === 'forex' ? 4 : 2)}
                  </td>
                  <td className={`text-right py-2 px-2 font-mono font-semibold ${
                    quote.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                  </td>
                  <td className="text-right py-2 px-2 text-gray-400 font-mono">
                    {quote.volume >= 1000000 
                      ? `${(quote.volume / 1000000).toFixed(1)}M`
                      : quote.volume >= 1000
                      ? `${(quote.volume / 1000).toFixed(0)}K`
                      : quote.volume.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
