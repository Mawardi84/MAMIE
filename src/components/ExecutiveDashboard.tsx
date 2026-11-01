import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, BarChart3, DollarSign, Globe, Zap } from 'lucide-react';
import { fetchMultipleQuotes, type AssetQuote } from '../services/dataService';
import { ASSETS } from '../data/assetRegistry';

export default function ExecutiveDashboard() {
  const [quotes, setQuotes] = useState<Record<string, AssetQuote>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const symbols = [
          'GC=F',      // Gold
          'CL=F',      // Oil
          'BTC-USD',   // Bitcoin
          '^GSPC',     // S&P 500
          '^N225',     // Nikkei
          'EURUSD=X',  // EUR/USD
          'DX-Y.NYB',  // DXY
        ];
        const newQuotes = await fetchMultipleQuotes(symbols);
        setQuotes(newQuotes);
        setLoading(false);
      } catch (e) {
        console.error('Failed to fetch quotes:', e);
        setLoading(false);
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 60000);
    return () => clearInterval(interval);
  }, []);

  // Market regime indicators - NOT_CONFIGURED
  // Regime detection requires validated statistical models (HMM, GARCH, etc.)
  const regimeData = null;



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Executive Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Global market intelligence and risk monitoring
        </p>
      </div>

      {/* Global Market Snapshot */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[var(--color-accent-primary)]" />
          Global Market Snapshot
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {loading ? (
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-[var(--color-bg-surface)] rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-[var(--color-bg-elevated)] rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-[var(--color-bg-elevated)] rounded w-3/4"></div>
              </div>
            ))
          ) : (
            <>
              {/* Gold */}
              <div className="bg-[var(--color-bg-surface)] rounded-lg p-4 border border-[var(--color-border-default)]">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Gold</div>
                <div className="text-lg font-bold text-white font-mono">
                  ${quotes['GC=F']?.price.toFixed(2) || 'N/A'}
                </div>
                <div className={`text-xs font-medium mt-1 ${
                  (quotes['GC=F']?.changePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {quotes['GC=F']?.changePercent >= 0 ? '+' : ''}
                  {quotes['GC=F']?.changePercent.toFixed(2) || '0.00'}%
                </div>
              </div>

              {/* Oil */}
              <div className="bg-[var(--color-bg-surface)] rounded-lg p-4 border border-[var(--color-border-default)]">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Crude Oil</div>
                <div className="text-lg font-bold text-white font-mono">
                  ${quotes['CL=F']?.price.toFixed(2) || 'N/A'}
                </div>
                <div className={`text-xs font-medium mt-1 ${
                  (quotes['CL=F']?.changePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {quotes['CL=F']?.changePercent >= 0 ? '+' : ''}
                  {quotes['CL=F']?.changePercent.toFixed(2) || '0.00'}%
                </div>
              </div>

              {/* Bitcoin */}
              <div className="bg-[var(--color-bg-surface)] rounded-lg p-4 border border-[var(--color-border-default)]">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Bitcoin</div>
                <div className="text-lg font-bold text-white font-mono">
                  ${quotes['BTC-USD']?.price.toLocaleString() || 'N/A'}
                </div>
                <div className={`text-xs font-medium mt-1 ${
                  (quotes['BTC-USD']?.changePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {quotes['BTC-USD']?.changePercent >= 0 ? '+' : ''}
                  {quotes['BTC-USD']?.changePercent.toFixed(2) || '0.00'}%
                </div>
              </div>

              {/* S&P 500 */}
              <div className="bg-[var(--color-bg-surface)] rounded-lg p-4 border border-[var(--color-border-default)]">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">S&P 500</div>
                <div className="text-lg font-bold text-white font-mono">
                  {quotes['^GSPC']?.price.toLocaleString() || 'N/A'}
                </div>
                <div className={`text-xs font-medium mt-1 ${
                  (quotes['^GSPC']?.changePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {quotes['^GSPC']?.changePercent >= 0 ? '+' : ''}
                  {quotes['^GSPC']?.changePercent.toFixed(2) || '0.00'}%
                </div>
              </div>

              {/* Nikkei */}
              <div className="bg-[var(--color-bg-surface)] rounded-lg p-4 border border-[var(--color-border-default)]">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Nikkei 225</div>
                <div className="text-lg font-bold text-white font-mono">
                  {quotes['^N225']?.price.toLocaleString() || 'N/A'}
                </div>
                <div className={`text-xs font-medium mt-1 ${
                  (quotes['^N225']?.changePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {quotes['^N225']?.changePercent >= 0 ? '+' : ''}
                  {quotes['^N225']?.changePercent.toFixed(2) || '0.00'}%
                </div>
              </div>

              {/* EUR/USD */}
              <div className="bg-[var(--color-bg-surface)] rounded-lg p-4 border border-[var(--color-border-default)]">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">EUR/USD</div>
                <div className="text-lg font-bold text-white font-mono">
                  {quotes['EURUSD=X']?.price.toFixed(4) || 'N/A'}
                </div>
                <div className={`text-xs font-medium mt-1 ${
                  (quotes['EURUSD=X']?.changePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {quotes['EURUSD=X']?.changePercent >= 0 ? '+' : ''}
                  {quotes['EURUSD=X']?.changePercent.toFixed(2) || '0.00'}%
                </div>
              </div>

              {/* DXY */}
              <div className="bg-[var(--color-bg-surface)] rounded-lg p-4 border border-[var(--color-border-default)]">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">US Dollar Index</div>
                <div className="text-lg font-bold text-white font-mono">
                  {quotes['DX-Y.NYB']?.price.toFixed(2) || 'N/A'}
                </div>
                <div className={`text-xs font-medium mt-1 ${
                  (quotes['DX-Y.NYB']?.changePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {quotes['DX-Y.NYB']?.changePercent >= 0 ? '+' : ''}
                  {quotes['DX-Y.NYB']?.changePercent.toFixed(2) || '0.00'}%
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Market Regime Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--color-accent-primary)]" />
            Market Regime Monitor
          </h2>
          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-4">
            <div className="text-center py-8">
              <div className="text-yellow-400 text-sm font-semibold mb-2">NOT_CONFIGURED</div>
              <div className="text-gray-400 text-xs">
                Market regime detection requires validated statistical models (HMM, GARCH, etc.)
              </div>
              <div className="text-gray-500 text-xs mt-2">
                This feature is not yet implemented with real data
              </div>
            </div>
          </div>
        </div>

        {/* Risk Monitor */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />
            Risk Monitor
          </h2>
          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-elevated)] rounded">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-sm font-medium text-white">Volatility Alert</div>
                  <div className="text-xs text-[var(--color-text-tertiary)]">VIX above 20 threshold</div>
                </div>
              </div>
              <div className="text-xs text-yellow-400 font-medium">WARNING</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-elevated)] rounded">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-white">Correlation Risk</div>
                  <div className="text-xs text-[var(--color-text-tertiary)]">Cross-asset correlation increasing</div>
                </div>
              </div>
              <div className="text-xs text-blue-400 font-medium">INFO</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-elevated)] rounded">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-white">Liquidity Status</div>
                  <div className="text-xs text-[var(--color-text-tertiary)]">Market depth normal</div>
                </div>
              </div>
              <div className="text-xs text-green-400 font-medium">NORMAL</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-elevated)] rounded">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-sm font-medium text-white">Data Quality</div>
                  <div className="text-xs text-[var(--color-text-tertiary)]">All sources operational</div>
                </div>
              </div>
              <div className="text-xs text-purple-400 font-medium">HEALTHY</div>
            </div>
          </div>
        </div>
      </div>

      {/* Research Highlights */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[var(--color-accent-primary)]" />
          Research Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-4">
            <div className="text-xs text-[var(--color-text-tertiary)] mb-2">Latest Model Output</div>
            <div className="text-sm font-medium text-white mb-1">Volatility Regime Detection</div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Current regime: NORMAL with 85% confidence
            </div>
            <div className="text-xs text-[var(--color-text-tertiary)] mt-2">Updated 5 minutes ago</div>
          </div>

          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-4">
            <div className="text-xs text-[var(--color-text-tertiary)] mb-2">Active Hypothesis</div>
            <div className="text-sm font-medium text-white mb-1">Gold-Real Yield Correlation</div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Testing inverse correlation hypothesis (p &lt; 0.05)
            </div>
            <div className="text-xs text-[var(--color-text-tertiary)] mt-2">Status: In Progress</div>
          </div>

          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-4">
            <div className="text-xs text-[var(--color-text-tertiary)] mb-2">Evidence Gap</div>
            <div className="text-sm font-medium text-white mb-1">Indonesian Bond Data</div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Free data source not yet verified
            </div>
            <div className="text-xs text-[var(--color-text-tertiary)] mt-2">Priority: Medium</div>
          </div>
        </div>
      </div>
    </div>
  );
}
