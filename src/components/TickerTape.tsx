import { useState, useEffect } from 'react';
import { getMultipleQuotes } from '../data/sampleData';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TickerTape() {
  const [quotes, setQuotes] = useState<Record<string, any>>({});
  const [prevQuotes, setPrevQuotes] = useState<Record<string, number>>({});

  // Sample assets for ticker
  const tickerAssets = [
    { symbol: 'GOLD', name: 'Gold', category: 'metals' },
    { symbol: 'BITCOIN', name: 'Bitcoin', category: 'crypto' },
    { symbol: 'OIL', name: 'Oil', category: 'commodities' },
    { symbol: 'SP500', name: 'S&P 500', category: 'indices' },
    { symbol: 'EURUSD', name: 'EUR/USD', category: 'forex' },
    { symbol: 'SILVER', name: 'Silver', category: 'metals' },
  ];

  useEffect(() => {
    const loadQuotes = () => {
      try {
        const symbols = tickerAssets.map(a => a.symbol);
        const newQuotes = getMultipleQuotes(symbols);
        
        const prev: Record<string, number> = {};
        Object.entries(quotes).forEach(([symbol, quote]) => {
          prev[symbol] = quote.price;
        });
        setPrevQuotes(prev);
        setQuotes(newQuotes);
      } catch (e) {
        console.error('Ticker load error:', e);
      }
    };

    loadQuotes();
    const interval = setInterval(loadQuotes, 30000);
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
    <div className="bg-gray-900/80 border-b border-gray-800/50 backdrop-blur-xl overflow-hidden">
      <div className="flex animate-scroll">
        {[...Array(2)].map((_, repeatIdx) => (
          <div key={repeatIdx} className="flex items-center gap-8 px-6 py-2.5 flex-shrink-0">
            {tickerAssets.map((asset: any) => {
              const quote = quotes[asset.symbol];
              if (!quote) return null;

              const flashClass = getFlashClass(asset.symbol, quote.price);

              return (
                <div
                  key={`${asset.symbol}-${repeatIdx}`}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all ${flashClass}`}
                >
                  <span className="text-gray-400 text-xs font-semibold">{asset.shortName}</span>
                  <span className="text-white text-sm font-bold font-mono">
                    {quote.price.toFixed(asset.category === 'forex' ? 4 : 2)}
                  </span>
                  <div className={`flex items-center gap-1 ${quote.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {quote.changePercent >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-xs font-mono font-semibold">
                      {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-700/50"></div>
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
          animation: scroll 80s linear infinite;
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
