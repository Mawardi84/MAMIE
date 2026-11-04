import { useState, useEffect } from 'react';
import { useAsset } from '../context/AssetContext';
import { useAssetQuote } from '../hooks/useDataHooks';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function LivePriceDisplay() {
  const { currentAsset } = useAsset();
  const { data: quote, loading } = useAssetQuote(currentAsset);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [flashClass, setFlashClass] = useState('');

  useEffect(() => {
    if (quote && prevPrice !== null) {
      if (quote.price > prevPrice) {
        setFlashClass('flash-up');
      } else if (quote.price < prevPrice) {
        setFlashClass('flash-down');
      }
      
      setTimeout(() => setFlashClass(''), 500);
    }
    
    if (quote) {
      setPrevPrice(quote.price);
    }
  }, [quote?.price]);

  if (loading || !quote) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-800 rounded w-1/3"></div>
          <div className="h-12 bg-gray-800 rounded w-2/3"></div>
          <div className="h-6 bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const decimals = currentAsset.category === 'forex' ? 4 : 2;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-white text-lg font-bold">{currentAsset.shortName}</h2>
            <span className="text-gray-500 text-xs">{currentAsset.symbol}</span>
          </div>
          <div className="text-gray-400 text-xs">{currentAsset.name}</div>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400">LIVE</span>
        </div>
      </div>

      <div className={`transition-all duration-300 ${flashClass}`}>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl font-bold text-white font-mono">
            {quote.price.toFixed(decimals)}
          </span>
          <span className="text-gray-500 text-sm">{currentAsset.currency}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1 ${quote.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {quote.change >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-lg font-bold font-mono">
              {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(decimals)}
            </span>
          </div>
          <div className={`px-2 py-1 rounded ${
            quote.changePercent >= 0 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            <span className="text-sm font-bold font-mono">
              {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-800">
        <div>
          <div className="text-gray-500 text-xs mb-1">High</div>
          <div className="text-white font-mono text-sm">{quote.high.toFixed(decimals)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs mb-1">Low</div>
          <div className="text-white font-mono text-sm">{quote.low.toFixed(decimals)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs mb-1">Volume</div>
          <div className="text-white font-mono text-sm">
            {quote.volume >= 1000000 
              ? `${(quote.volume / 1000000).toFixed(2)}M`
              : quote.volume >= 1000
              ? `${(quote.volume / 1000).toFixed(1)}K`
              : quote.volume.toLocaleString()}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flash-up {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(16, 185, 129, 0.15); }
        }
        @keyframes flash-down {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(239, 68, 68, 0.15); }
        }
        .flash-up {
          animation: flash-up 0.5s ease-out;
        }
        .flash-down {
          animation: flash-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
