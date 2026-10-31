import { useState, useEffect } from 'react';
import { ASSETS, type Asset } from '../data/assetRegistry';
import { fetchMultipleQuotes, type AssetQuote } from '../services/dataService';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TickerTape() {
  const [quotes, setQuotes] = useState<Record<string, AssetQuote>>({});
  const [prevQuotes, setPrevQuotes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchQuotes = async () => {
      const symbols = ASSETS.slice(0, 15).map(a => a.symbol); // Top 15 assets
      try {
        const newQuotes = await fetchMultipleQuotes(symbols);
        setPrevQuotes(Object.fromEntries(
          Object.entries(quotes).map(([k, v]) => [k, v.price])
        ));
        setQuotes(newQuotes);
      } catch (e) {
        console.error('Ticker fetch error:', e);
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const getFlashClass = (symbol: string, currentPrice: number) => {
    const prevPrice = prevQuotes[symbol];
    if (!prevPrice) return '';
    if (currentPrice > prevPrice) return 'flash-green';
    if (currentPrice < prevPrice) return 'flash-red';
    return '';
  };

  return (
    <div className="bg-gray-900 border-b border-gray-800 overflow-hidden">
      <div className="flex animate-scroll">
        {[...Array(2)].map((_, repeatIdx) => (
          <div key={repeatIdx} className="flex items-center gap-6 px-4 py-2 flex-shrink-0">
            {ASSETS.slice(0, 15).map((asset) => {
              const quote = quotes[asset.symbol];
              if (!quote) return null;

              const flashClass = getFlashClass(asset.symbol, quote.price);

              return (
                <div
                  key={`${asset.symbol}-${repeatIdx}`}
                  className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${flashClass}`}
                >
                  <span className="text-gray-400 text-xs font-medium">{asset.shortName}</span>
                  <span className="text-white text-sm font-bold font-mono">
                    {quote.price.toFixed(asset.category === 'forex' ? 4 : 2)}
                  </span>
                  <div className={`flex items-center gap-0.5 ${quote.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {quote.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">
                      {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        @keyframes flash-green {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(16, 185, 129, 0.2); }
        }
        @keyframes flash-red {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(239, 68, 68, 0.2); }
        }
        .flash-green {
          animation: flash-green 0.5s ease-out;
        }
        .flash-red {
          animation: flash-red 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
