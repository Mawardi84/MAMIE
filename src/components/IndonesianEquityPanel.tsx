import { useState, useEffect } from 'react';
import { Building2, TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { useAsset } from '../context/AssetContext';
import { useAssetPriceHistory, useVolatility } from '../hooks/useDataHooks';
import { ASSETS } from '../data/assetRegistry';
import NotConfiguredMessage from './NotConfiguredMessage';

export default function IndonesianEquityPanel() {
  const {  currentAsset } = useAsset();
  const {  priceHistory } = useAssetPriceHistory(currentAsset, '3mo', '1d');
  const { volatility } = useVolatility(priceHistory, 20);

  const latestVol = volatility?.filter((v: any) => v > 0).slice(-1)[0] || 0;

  // Market breadth indicators - NOT_CONFIGURED (requires IDX API)
  const [advancingStocks, setAdvancingStocks] = useState<number | null>(null);
  const [decliningStocks, setDecliningStocks] = useState<number | null>(null);
  const [unchangedStocks, setUnchangedStocks] = useState<number | null>(null);

  useEffect(() => {
    // Market breadth data requires IDX API integration
    // Marking as NOT_CONFIGURED
    setAdvancingStocks(null);
    setDecliningStocks(null);
    setUnchangedStocks(null);
  }, []);

  const totalStocks = (advancingStocks || 0) + (decliningStocks || 0) + (unchangedStocks || 0);
  const advanceDeclineRatio = decliningStocks && decliningStocks > 0 
    ? ((advancingStocks || 0) / decliningStocks).toFixed(2) 
    : 'N/A';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          Indonesian Equity Intelligence
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Bursa Efek Indonesia (IDX) market analysis and screening
        </p>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-400 text-xs">Advancing</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {advancingStocks !== null ? advancingStocks : 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            NOT_CONFIGURED - Requires IDX API
          </div>
        </div>

        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-gray-400 text-xs">Declining</span>
          </div>
          <div className="text-2xl font-bold text-red-400">
            {decliningStocks !== null ? decliningStocks : 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            NOT_CONFIGURED - Requires IDX API
          </div>
        </div>

        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400 text-xs">A/D Ratio</span>
          </div>
          <div className="text-2xl font-bold text-white">{advanceDeclineRatio}</div>
          <div className="text-xs text-gray-500 mt-1">
            {advanceDeclineRatio !== 'N/A' && parseFloat(advanceDeclineRatio) > 1 ? 'Bullish' : 'Bearish'} sentiment
          </div>
        </div>

        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-xs">Avg Volatility</span>
          </div>
          <div className="text-2xl font-bold text-white">{latestVol.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">20-day annualized</div>
        </div>
      </div>

      {/* IDX Characteristics */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold mb-4">IDX Market Characteristics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-amber-400 text-sm font-semibold mb-2">Trading Sessions</h4>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Session 1: 09:00 - 12:00 WIB</li>
              <li>• Session 2: 13:30 - 16:00 WIB</li>
              <li>• Trading days: Monday - Friday</li>
              <li>• Settlement: T+2</li>
            </ul>
          </div>
          <div>
            <h4 className="text-amber-400 text-sm font-semibold mb-2">Market Mechanisms</h4>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Auto Rejection Atas (ARA): +35% for regular stocks</li>
              <li>• Auto Rejection Bawah (ARB): -25% for regular stocks</li>
              <li>• Lot size: 100 shares minimum</li>
              <li>• Tick size varies by price range</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sector Performance - NOT_CONFIGURED */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold mb-4">IDX Sector Performance</h3>
        <NotConfiguredMessage 
          feature="Sector Performance"
          reason="Sector performance data requires IDX API integration for real-time sector indices."
          alternative="This feature can be enabled by integrating with IDX data feed or using sector ETFs as proxies."
        />
      </div>

      {/* Stock Screener Preview - NOT_CONFIGURED */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold mb-4">Stock Screener</h3>
        <NotConfiguredMessage 
          feature="Stock Screener"
          reason="IDX stock screener requires complete IDX universe data with fundamental metrics."
          alternative="This feature can be enabled by integrating with IDX data feed and fundamental data providers."
        />
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-300 text-xs">
          <strong>PHASE 03 Implementation:</strong> This panel provides Indonesian equity market intelligence. 
          Market breadth and sector performance require IDX API integration (NOT_CONFIGURED). 
          Volatility is calculated from real price data when available.
        </p>
      </div>
    </div>
  );
}
