import { useState, useEffect } from 'react';
import { TrendingUp, Activity } from 'lucide-react';
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

interface BondData {
  maturity: string;
  symbol: string;
  yield: number | null;
  change: number | null;
}

export default function FixedIncomePanel() {
  const [bonds, setBonds] = useState<BondData[]>([]);
  const [yieldCurve, setYieldCurve] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const treasuryBonds = [
    { maturity: '3 Month', symbol: '^IRX' },
    { maturity: '2 Year', symbol: '^2YY' },
    { maturity: '5 Year', symbol: '^FVX' },
    { maturity: '10 Year', symbol: '^TNX' },
    { maturity: '30 Year', symbol: '^TYX' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const pricePromises = treasuryBonds.map((bond) =>
          fetchAssetPriceData(bond.symbol, '5d', '1d').catch(() => null)
        );

        const results = await Promise.all(pricePromises);

        const bondsData: BondData[] = treasuryBonds.map((bond, idx) => {
          const data = results[idx];

          if (!data || data.length < 2) {
            return {
              ...bond,
              yield: null,
              change: null,
            };
          }

          const latest = data[data.length - 1];
          const previous = data[data.length - 2];
          const change = latest.close - previous.close;

          return {
            ...bond,
            yield: latest.close,
            change,
          };
        });

        setBonds(bondsData);

        // Prepare yield curve data
        const curveData = bondsData
          .filter((b) => b.yield !== null)
          .map((b) => ({
            maturity: b.maturity,
            yield: b.yield,
          }));

        setYieldCurve(curveData);
      } catch (err) {
        setError('Failed to fetch bond data');
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
            <p className="text-gray-400">Loading fixed income data...</p>
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
          <TrendingUp className="w-6 h-6" />
          Fixed Income & Interest Rates
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          US Treasury yields and yield curve analysis
        </p>
      </div>

      {/* Treasury Yields */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">US Treasury Yields</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {bonds.map((bond, idx) => (
            <div
              key={idx}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
            >
              <div className="text-gray-400 text-xs mb-2">{bond.maturity}</div>
              {bond.yield !== null ? (
                <>
                  <div className="text-2xl font-bold text-white font-mono mb-1">
                    {bond.yield.toFixed(2)}%
                  </div>
                  <div
                    className={`text-sm font-mono ${
                      bond.change! >= 0 ? 'text-red-400' : 'text-green-400'
                    }`}
                  >
                    {bond.change! >= 0 ? '+' : ''}
                    {bond.change!.toFixed(2)} bps
                  </div>
                </>
              ) : (
                <div className="text-gray-500 text-sm">Data unavailable</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Yield Curve */}
      {yieldCurve.length > 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Yield Curve</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yieldCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="maturity"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                domain={['auto', 'auto']}
                label={{
                  value: 'Yield (%)',
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
                dataKey="yield"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                name="Yield"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-400">
            <p>
              <strong>Yield Curve Shape:</strong>{' '}
              {yieldCurve.length >= 2 &&
              yieldCurve[yieldCurve.length - 1].yield > yieldCurve[0].yield
                ? 'Normal (Upward Sloping)'
                : yieldCurve.length >= 2 &&
                  yieldCurve[yieldCurve.length - 1].yield < yieldCurve[0].yield
                ? 'Inverted (Downward Sloping) - Recession Signal'
                : 'Flat'}
            </p>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-xs mb-2">2s10s Spread</div>
          {bonds.length >= 4 && bonds[1].yield && bonds[3].yield ? (
            <div
              className={`text-2xl font-bold font-mono ${
                bonds[3].yield - bonds[1].yield >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {((bonds[3].yield - bonds[1].yield) * 100).toFixed(0)} bps
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Data unavailable</div>
          )}
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-xs mb-2">Real Yield (10Y)</div>
          <div className="text-gray-500 text-sm">
            Requires CPI data (NOT_CONFIGURED)
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-xs mb-2">Fed Funds Rate</div>
          <div className="text-gray-500 text-sm">
            Requires FRED API (NOT_CONFIGURED)
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          <strong>Note:</strong> Treasury yield data sourced from Yahoo Finance.
          Real yield and Fed Funds rate require FRED API integration (NOT_CONFIGURED).
          Yield curve shape is a key indicator of economic expectations.
        </p>
      </div>
    </div>
  );
}
