import { useState, useMemo } from 'react';
import { Globe, Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { ASSETS, ASSET_CATEGORIES, type Asset, type AssetCategory } from '../data/assetRegistry';
import { fetchMultipleQuotes, type AssetQuote } from '../services/dataService';
import { useEffect } from 'react';
import { useAsset } from '../context/AssetContext';

export default function AssetUniverse() {
  const { setCurrentAsset } = useAsset();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [selectedExchange, setSelectedExchange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'change' | 'volume'>('name');
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
        console.error('Failed to fetch quotes:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get unique exchanges
  const exchanges = useMemo(() => {
    const exchangeSet = new Set(ASSETS.map(a => a.exchange));
    return Array.from(exchangeSet).sort();
  }, []);

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    let filtered = ASSETS;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.symbol.toLowerCase().includes(query) ||
        a.name.toLowerCase().includes(query) ||
        a.shortName.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    // Filter by exchange
    if (selectedExchange !== 'all') {
      filtered = filtered.filter(a => a.exchange === selectedExchange);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.shortName.localeCompare(b.shortName);
      } else if (sortBy === 'change') {
        const changeA = quotes[a.symbol]?.changePercent || 0;
        const changeB = quotes[b.symbol]?.changePercent || 0;
        return changeB - changeA;
      } else if (sortBy === 'volume') {
        const volA = quotes[a.symbol]?.volume || 0;
        const volB = quotes[b.symbol]?.volume || 0;
        return volB - volA;
      }
      return 0;
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedExchange, sortBy, quotes]);

  const handleAssetClick = (asset: Asset) => {
    setCurrentAsset(asset);
  };

  const getCategoryColor = (category: AssetCategory): string => {
    const colors: Record<AssetCategory, string> = {
      metals: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      forex: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      crypto: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      commodities: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      indices: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      stocks: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      bonds: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    };
    return colors[category];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-[var(--color-accent-primary)]" />
          Asset Universe
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Browse and search {ASSETS.length} instruments across {Object.keys(ASSET_CATEGORIES).length} asset classes
        </p>
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide mb-2 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by symbol, name..."
                className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-lg text-sm text-white placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent-primary)]"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide mb-2 block">
              Asset Class
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-4 py-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-accent-primary)]"
            >
              <option value="all">All Classes</option>
              {Object.entries(ASSET_CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Exchange Filter */}
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide mb-2 block">
              Exchange
            </label>
            <select
              value={selectedExchange}
              onChange={(e) => setSelectedExchange(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-accent-primary)]"
            >
              <option value="all">All Exchanges</option>
              {exchanges.map(ex => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide">
            Sort by:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                sortBy === 'name'
                  ? 'bg-[var(--color-accent-primary)] text-white'
                  : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              Name
            </button>
            <button
              onClick={() => setSortBy('change')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                sortBy === 'change'
                  ? 'bg-[var(--color-accent-primary)] text-white'
                  : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              Change %
            </button>
            <button
              onClick={() => setSortBy('volume')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                sortBy === 'volume'
                  ? 'bg-[var(--color-accent-primary)] text-white'
                  : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              Volume
            </button>
          </div>
          <div className="ml-auto text-sm text-[var(--color-text-secondary)]">
            Showing {filteredAssets.length} of {ASSETS.length} assets
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      {loading ? (
        <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[var(--color-accent-primary)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading asset data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => {
            const quote = quotes[asset.symbol];
            return (
              <div
                key={asset.symbol}
                onClick={() => handleAssetClick(asset)}
                className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-4 hover:border-[var(--color-accent-primary)] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white group-hover:text-[var(--color-accent-primary)] transition-colors">
                      {asset.shortName}
                    </h3>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                      {asset.symbol}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border ${getCategoryColor(asset.category)}`}>
                    {ASSET_CATEGORIES[asset.category].icon}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-text-tertiary)]">Price</span>
                    <span className="text-sm font-mono font-semibold text-white">
                      {quote ? (asset.category === 'forex' ? quote.price.toFixed(4) : quote.price.toFixed(2)) : 'N/A'}
                    </span>
                  </div>

                  {quote && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--color-text-tertiary)]">Change</span>
                      <span className={`text-sm font-mono font-semibold flex items-center gap-1 ${
                        quote.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {quote.changePercent >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  )}

                  {quote && quote.volume > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--color-text-tertiary)]">Volume</span>
                      <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                        {quote.volume >= 1000000 
                          ? `${(quote.volume / 1000000).toFixed(2)}M`
                          : quote.volume >= 1000
                          ? `${(quote.volume / 1000).toFixed(1)}K`
                          : quote.volume.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[var(--color-border-default)]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-text-tertiary)]">Exchange</span>
                      <span className="text-[var(--color-text-secondary)]">{asset.exchange}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredAssets.length === 0 && !loading && (
        <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-12 text-center">
          <Filter className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Assets Found</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
