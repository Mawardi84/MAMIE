import { useState, useEffect } from 'react';
import { Activity, BarChart3 } from 'lucide-react';
import { fetchAssetPriceData } from '../services/dataService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface IndexData {
  name: string;
  symbol: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  high52w: number | null;
  low52w: number | null;
}

export default function IndicesDerivativesPanel() {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [vixData, setVixData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const majorIndices = [
    { name: 'S&P 500', symbol: '^GSPC' },
    { name: 'VIX', symbol: '^VIX' },
    { name: 'Dow Jones', symbol: '^DJI' },
    { name: 'Nasdaq', symbol: '^IXIC' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch 1 year data for 52-week high/low
        const pricePromises = majorIndices.map((idx) =>
          fetchAssetPriceData(idx.symbol, '1y', '1d').catch(() => null)
        );

        const results = await Promise.all(pricePromises);

        const indicesData: IndexData[] = majorIndices.map((idx, idxIdx) => {
          const data = results[idxIdx];

          if (!data || data.length < 2) {
            return {
              ...idx,
              price: null,
              change: null,
              changePercent: null,
              high52w: null,
              low52w: null,
            };
          }

          const latest = data[data.length - 1];
          const previous = data[data.length - 2];
          const change = latest.close - previous.close;
          const changePercent = (change / previous.close) * 100;

          // Calculate 52-week high/low
          const high52w = Math.max(...data.map((d) => d.high));
          const low52w = Math.min(...data.map((d) => d.low));

          return {
            ...idx,
            price: latest.close,
            change,
            changePercent,
            high52w,
            low52w,
          };
        });

        setIndices(indicesData);

        // Fetch VIX data separately for chart
        const vixPriceData = await fetchAssetPriceData('^VIX', '3mo', '1d').catch(
          () => null
        );
        if (vixPriceData) {
          setVixData(
            vixPriceData.map((d) => ({
              date: d.date,
              vix: d.close,
            }))
          );
        }
      } catch (err) {
        setError('Failed to fetch index data');
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
            <p className="text-gray-400">Loading indices & derivatives data...</p>
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

  const vixIndex = indices.find((idx) => idx.symbol === '^VIX');
  const vixLevel = vixIndex?.price ?? null;
  const vixStatus =
    vixLevel === null
      ? 'UNKNOWN'
      : vixLevel < 15
      ? 'LOW'
      : vixLevel < 25
      ? 'NORMAL'
      : vixLevel < 35
      ? 'HIGH'
      : 'EXTREME';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Indices & Derivatives
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Major market indices and volatility analysis
        </p>
      </div>

      {/* Major Indices */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Major Indices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {indices.map((index, idx) => (
            <div
              key={idx}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
            >
              <div className="text-gray-400 text-xs mb-2">{index.name}</div>
              {index.price !== null ? (
                <>
                  <div className="text-2xl font-bold text-white font-mono mb-1">
                    {index.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div
                    className={`text-sm font-mono mb-2 ${
                      index.change! >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {index.change! >= 0 ? '+' : ''}
                    {index.change!.toFixed(2)} ({index.changePercent!.toFixed(2)}%)
                  </div>
                  {index.high52w && index.low52w && (
                    <div className="text-xs text-gray-500">
                      <div>
                        52W High: {index.high52w.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                      <div>
                        52W Low: {index.low52w.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 text-sm">Data unavailable</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* VIX Chart */}
      {vixData.length > 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            VIX Volatility Index (3 Months)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vixData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                interval={Math.floor(vixData.length / 6)}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                domain={['auto', 'auto']}
                label={{
                  value: 'VIX',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#9CA3AF' },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line
                type="monotone"
                dataKey="vix"
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
                name="VIX"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-gray-400 text-xs mb-1">Current VIX</div>
              <div className="text-lg font-bold text-white font-mono">
                {vixLevel?.toFixed(2) || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">Volatility Status</div>
              <div
                className={`text-lg font-bold ${
                  vixStatus === 'LOW'
                    ? 'text-green-400'
                    : vixStatus === 'NORMAL'
                    ? 'text-blue-400'
                    : vixStatus === 'HIGH'
                    ? 'text-yellow-400'
                    : vixStatus === 'EXTREME'
                    ? 'text-red-400'
                    : 'text-gray-400'
                }`}
              >
                {vixStatus}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">3M High</div>
              <div className="text-lg font-bold text-white font-mono">
                {Math.max(...vixData.map((d) => d.vix)).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">3M Low</div>
              <div className="text-lg font-bold text-white font-mono">
                {Math.min(...vixData.map((d) => d.vix)).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Derivatives Info */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Derivatives Market
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-2">Index Futures</div>
            <div className="text-gray-500 text-sm">
              NOT_CONFIGURED - Requires futures data feed
            </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-2">Options Chains</div>
            <div className="text-gray-500 text-sm">
              NOT_CONFIGURED - Requires options data feed
            </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-2">Put/Call Ratio</div>
            <div className="text-gray-500 text-sm">
              NOT_CONFIGURED - Requires options data feed
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          <strong>Note:</strong> Index data sourced from Yahoo Finance. VIX (CBOE Volatility Index)
          measures market expectations of near-term volatility. Derivatives data (futures, options)
          requires specialized data feeds and is currently NOT_CONFIGURED.
        </p>
      </div>
    </div>
  );
}
