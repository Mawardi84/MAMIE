import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
import { fetchAssetPriceData } from '../services/dataService';
import { ASSETS } from '../data/assetRegistry';
import ExportButton from './ExportButton';

interface AssetPriceData {
  symbol: string;
  name: string;
  category: string;
  prices: Array<{ date: string; close: number }>;
}

export default function CrossAssetAnalysis() {
  const [loading, setLoading] = useState(true);
  const [assetData, setAssetData] = useState<AssetPriceData[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([
    'GC=F',      // Gold
    'CL=F',      // Oil
    'BTC-USD',   // Bitcoin
    '^GSPC',     // S&P 500
    'EURUSD=X',  // EUR/USD
    'DX-Y.NYB',  // DXY
  ]);

  const keyAssets = [
    { symbol: 'GC=F', name: 'Gold', category: 'Commodity' },
    { symbol: 'CL=F', name: 'Crude Oil', category: 'Commodity' },
    { symbol: 'BTC-USD', name: 'Bitcoin', category: 'Crypto' },
    { symbol: '^GSPC', name: 'S&P 500', category: 'Index' },
    { symbol: '^N225', name: 'Nikkei 225', category: 'Index' },
    { symbol: 'EURUSD=X', name: 'EUR/USD', category: 'Forex' },
    { symbol: 'USDJPY=X', name: 'USD/JPY', category: 'Forex' },
    { symbol: 'DX-Y.NYB', name: 'US Dollar Index', category: 'Index' },
    { symbol: '^TNX', name: 'US 10Y Yield', category: 'Bond' },
    { symbol: 'SI=F', name: 'Silver', category: 'Commodity' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data: AssetPriceData[] = [];
        
        for (const asset of keyAssets) {
          try {
            const priceData = await fetchAssetPriceData(asset.symbol, '6mo', '1d');
            data.push({
              symbol: asset.symbol,
              name: asset.name,
              category: asset.category,
              prices: priceData.map(d => ({ date: d.date, close: d.close })),
            });
          } catch (error) {
            console.error(`Failed to fetch ${asset.symbol}:`, error);
          }
        }
        
        setAssetData(data);
        
        // Calculate correlation matrix
        if (data.length > 0) {
          const matrix = calculateCorrelationMatrix(data);
          setCorrelationMatrix(matrix);
        }
      } catch (error) {
        console.error('Failed to fetch cross-asset data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateCorrelationMatrix = (data: AssetPriceData[]): number[][] => {
    const matrix: number[][] = [];
    
    for (let i = 0; i < data.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < data.length; j++) {
        if (i === j) {
          matrix[i][j] = 1.0;
        } else {
          const corr = calculateCorrelation(data[i].prices, data[j].prices);
          matrix[i][j] = corr;
        }
      }
    }
    
    return matrix;
  };

  const calculateCorrelation = (
    prices1: Array<{ date: string; close: number }>,
    prices2: Array<{ date: string; close: number }>
  ): number => {
    // Calculate returns
    const returns1 = prices1.slice(1).map((p, i) => 
      (p.close - prices1[i].close) / prices1[i].close
    );
    const returns2 = prices2.slice(1).map((p, i) => 
      (p.close - prices2[i].close) / prices2[i].close
    );

    const n = Math.min(returns1.length, returns2.length);
    const r1 = returns1.slice(0, n);
    const r2 = returns2.slice(0, n);

    const mean1 = r1.reduce((a, b) => a + b, 0) / n;
    const mean2 = r2.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denom1 = 0;
    let denom2 = 0;

    for (let i = 0; i < n; i++) {
      const diff1 = r1[i] - mean1;
      const diff2 = r2[i] - mean2;
      numerator += diff1 * diff2;
      denom1 += diff1 * diff1;
      denom2 += diff2 * diff2;
    }

    const denominator = Math.sqrt(denom1 * denom2);
    return denominator === 0 ? 0 : numerator / denominator;
  };

  const getCorrelationColor = (value: number): string => {
    if (value >= 0.7) return 'bg-green-500';
    if (value >= 0.3) return 'bg-green-400';
    if (value >= -0.3) return 'bg-gray-500';
    if (value >= -0.7) return 'bg-red-400';
    return 'bg-red-500';
  };

  const getCorrelationTextColor = (value: number): string => {
    if (Math.abs(value) >= 0.5) return 'text-white';
    return 'text-[var(--color-text-primary)]';
  };

  // Calculate relative performance (6 months)
  const relativePerformance = assetData.map(asset => {
    if (asset.prices.length < 2) return { ...asset, performance: 0 };
    const first = asset.prices[0].close;
    const last = asset.prices[asset.prices.length - 1].close;
    const performance = ((last - first) / first) * 100;
    return { ...asset, performance };
  });

  // Calculate volatility (annualized)
  const volatilityData = assetData.map(asset => {
    if (asset.prices.length < 2) return { ...asset, volatility: 0 };
    const returns = asset.prices.slice(1).map((p, i) => 
      (p.close - asset.prices[i].close) / asset.prices[i].close
    );
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    const dailyVol = Math.sqrt(variance);
    const annualizedVol = dailyVol * Math.sqrt(252) * 100;
    return { ...asset, volatility: annualizedVol };
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[var(--color-accent-primary)]" />
            Cross-Asset Analysis
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Correlation, relative performance, and cross-asset relationships
          </p>
        </div>
        {!loading && assetData.length > 0 && (
          <ExportButton
            data={assetData.map(asset => ({
              symbol: asset.symbol,
              name: asset.name,
              category: asset.category,
              latestPrice: asset.prices[asset.prices.length - 1]?.close || 0,
              dataPoints: asset.prices.length,
            }))}
            filename="cross-asset-analysis"
            label="Export Analysis"
          />
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-400">Analysis Methodology</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Correlation calculated using 6-month daily returns. Values range from -1 (perfect negative) to +1 (perfect positive).
              Correlation does not imply causation. Data sourced from Yahoo Finance API.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-12 text-center">
          <Activity className="w-8 h-8 text-[var(--color-accent-primary)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading cross-asset data...</p>
        </div>
      ) : (
        <>
          {/* Correlation Matrix */}
          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Correlation Matrix (6-Month)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-semibold text-[var(--color-text-tertiary)] p-2">Asset</th>
                    {assetData.map((asset, i) => (
                      <th key={i} className="text-center text-xs font-semibold text-[var(--color-text-tertiary)] p-2">
                        {asset.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assetData.map((asset, i) => (
                    <tr key={i}>
                      <td className="text-sm font-medium text-white p-2">{asset.name}</td>
                      {correlationMatrix[i]?.map((corr, j) => (
                        <td key={j} className="p-1">
                          <div
                            className={`w-full h-12 rounded flex items-center justify-center text-xs font-mono font-semibold ${getCorrelationColor(corr)} ${getCorrelationTextColor(corr)}`}
                            title={`${asset.name} vs ${assetData[j].name}: ${corr.toFixed(3)}`}
                          >
                            {corr.toFixed(2)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Strong Positive (0.7 to 1.0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span>Moderate Positive (0.3 to 0.7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span>Weak (-0.3 to 0.3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 rounded"></div>
                <span>Moderate Negative (-0.7 to -0.3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Strong Negative (-1.0 to -0.7)</span>
              </div>
            </div>
          </div>

          {/* Relative Performance */}
          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--color-accent-primary)]" />
              Relative Performance (6-Month)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relativePerformance
                .sort((a, b) => b.performance - a.performance)
                .map((asset, i) => (
                  <div
                    key={i}
                    className="bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-default)] p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{asset.name}</h3>
                        <p className="text-xs text-[var(--color-text-tertiary)]">{asset.category}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        asset.performance >= 0
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {asset.category}
                      </span>
                    </div>
                    <div className={`text-2xl font-bold font-mono ${
                      asset.performance >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {asset.performance >= 0 ? '+' : ''}{asset.performance.toFixed(2)}%
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Volatility Comparison */}
          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--color-accent-primary)]" />
              Volatility Comparison (Annualized)
            </h2>
            <div className="space-y-3">
              {volatilityData
                .sort((a, b) => b.volatility - a.volatility)
                .map((asset, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium text-white">{asset.name}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-[var(--color-bg-elevated)] rounded relative overflow-hidden">
                        <div
                          className={`h-full rounded ${
                            asset.volatility > 30 ? 'bg-red-500' :
                            asset.volatility > 20 ? 'bg-yellow-500' :
                            asset.volatility > 10 ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(asset.volatility * 2, 100)}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-xs font-mono font-semibold text-white">
                            {asset.volatility.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        asset.volatility > 30 ? 'bg-red-500/10 text-red-400' :
                        asset.volatility > 20 ? 'bg-yellow-500/10 text-yellow-400' :
                        asset.volatility > 10 ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
                      }`}>
                        {asset.volatility > 30 ? 'High' :
                         asset.volatility > 20 ? 'Elevated' :
                         asset.volatility > 10 ? 'Moderate' : 'Low'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Key Insights</h2>
            <div className="space-y-3">
              <div className="bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-default)] p-4">
                <h3 className="text-sm font-semibold text-white mb-2">Strongest Correlations</h3>
                <ul className="space-y-1 text-xs text-[var(--color-text-secondary)]">
                  <li>• Gold-Silver: Traditional precious metals correlation</li>
                  <li>• S&P 500-Nikkei: Global equity market linkage</li>
                  <li>• EUR/USD-DXY: Inverse currency relationship</li>
                </ul>
              </div>
              <div className="bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-default)] p-4">
                <h3 className="text-sm font-semibold text-white mb-2">Negative Correlations</h3>
                <ul className="space-y-1 text-xs text-[var(--color-text-secondary)]">
                  <li>• Gold-US Dollar: Traditional safe haven dynamics</li>
                  <li>• Bonds-Equities: Risk-on/risk-off rotation</li>
                </ul>
              </div>
              <div className="bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-default)] p-4">
                <h3 className="text-sm font-semibold text-white mb-2">Volatility Leaders</h3>
                <ul className="space-y-1 text-xs text-[var(--color-text-secondary)]">
                  <li>• Cryptocurrencies show highest volatility</li>
                  <li>• Commodities exhibit moderate-high volatility</li>
                  <li>• Major indices show moderate volatility</li>
                  <li>• Forex pairs show lowest volatility</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
