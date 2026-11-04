import { useState, useEffect } from 'react';
import { Globe, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { fetchAssetPriceData } from '../services/dataService';

interface GlobalMarket {
  region: string;
  indices: {
    name: string;
    symbol: string;
    price: number | null;
    change: number | null;
    changePercent: number | null;
  }[];
}

export default function GlobalEquitiesPanel() {
  const [markets, setMarkets] = useState<GlobalMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const globalIndices = [
    {
      region: 'United States',
      indices: [
        { name: 'S&P 500', symbol: '^GSPC' },
        { name: 'Nasdaq', symbol: '^IXIC' },
        { name: 'Dow Jones', symbol: '^DJI' },
        { name: 'Russell 2000', symbol: '^RUT' },
      ],
    },
    {
      region: 'Europe',
      indices: [
        { name: 'FTSE 100', symbol: '^FTSE' },
        { name: 'DAX', symbol: '^GDAXI' },
        { name: 'CAC 40', symbol: '^FCHI' },
        { name: 'Euro Stoxx 50', symbol: '^STOXX50E' },
      ],
    },
    {
      region: 'Asia Pacific',
      indices: [
        { name: 'Nikkei 225', symbol: '^N225' },
        { name: 'Hang Seng', symbol: '^HSI' },
        { name: 'Shanghai', symbol: '000001.SS' },
        { name: 'ASX 200', symbol: '^AXJO' },
      ],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const allSymbols = globalIndices.flatMap((region) =>
          region.indices.map((idx) => idx.symbol)
        );

        const pricePromises = allSymbols.map((symbol) =>
          fetchAssetPriceData(symbol, '5d', '1d').catch(() => null)
        );

        const results = await Promise.all(pricePromises);

        const marketsData: GlobalMarket[] = globalIndices.map((region, regionIdx) => ({
          region: region.region,
          indices: region.indices.map((idx, idxIdx) => {
            const dataIdx = regionIdx * 4 + idxIdx;
            const data = results[dataIdx];

            if (!data || data.length < 2) {
              return {
                ...idx,
                price: null,
                change: null,
                changePercent: null,
              };
            }

            const latest = data[data.length - 1];
            const previous = data[data.length - 2];
            const change = latest.close - previous.close;
            const changePercent = (change / previous.close) * 100;

            return {
              ...idx,
              price: latest.close,
              change,
              changePercent,
            };
          }),
        }));

        setMarkets(marketsData);
      } catch (err) {
        setError('Failed to fetch global market data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Activity className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading global markets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold flex items-center gap-2">
          <Globe className="w-6 h-6" />
          Global Equities
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Major stock market indices from around the world
        </p>
      </div>

      {markets.map((market, idx) => (
        <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{market.region}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {market.indices.map((index, idx2) => (
              <div
                key={idx2}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-semibold text-sm">{index.name}</h3>
                    <p className="text-gray-500 text-xs">{index.symbol}</p>
                  </div>
                </div>

                {index.price !== null ? (
                  <>
                    <div className="text-2xl font-bold text-white font-mono mb-1">
                      {index.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-mono ${
                        index.change! >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {index.change! >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>
                        {index.change! >= 0 ? '+' : ''}
                        {index.change!.toFixed(2)} ({index.changePercent!.toFixed(2)}%)
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 text-sm">Data unavailable</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          <strong>Note:</strong> Data sourced from Yahoo Finance API. Updates every 60 seconds.
          Some indices may have delayed data depending on market hours.
        </p>
      </div>
    </div>
  );
}
