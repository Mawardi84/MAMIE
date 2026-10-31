/**
 * MAMIE Indonesian Equity Intelligence
 * PHASE 03: Indonesian Equity Intelligence
 */

import { useState, useEffect } from 'react';
import { useAsset } from '../context/AssetContext';
import { useAssetPriceHistory, useVolatility } from '../hooks/useDataHooks';
import { ASSETS } from '../data/assetRegistry';
import { Building2, TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

// Sample IDX stocks (in production, this would come from Instrument Registry)
const IDX_STOCKS = ASSETS.filter(a => a.exchange === 'IDX' || a.symbol.includes('.JK'));

export default function IndonesianEquityPanel() {
  const {  currentAsset } = useAsset();
  const { data: priceHistory } = useAssetPriceHistory(currentAsset, '3mo', '1d');
  const { volatility } = useVolatility(priceHistory, 20);

  // Market breadth indicators
  const [advancingStocks, setAdvancingStocks] = useState(0);
  const [decliningStocks, setDecliningStocks] = useState(0);
  const [unchangedStocks, setUnchangedStocks] = useState(0);

  useEffect(() => {
    // Simulate market breadth (in production, calculate from real data)
    setAdvancingStocks(Math.floor(Math.random() * 300) + 200);
    setDecliningStocks(Math.floor(Math.random() * 200) + 100);
    setUnchangedStocks(Math.floor(Math.random() * 50) + 20);
  }, []);

  const latestVol = volatility?.filter((v: any) => v > 0).slice(-1)[0] || 0;
  const totalStocks = advancingStocks + decliningStocks + unchangedStocks;
  const advanceDeclineRatio = decliningStocks > 0 ? (advancingStocks / decliningStocks).toFixed(2) : 'N/A';

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
          <div className="text-2xl font-bold text-emerald-400">{advancingStocks}</div>
          <div className="text-xs text-gray-500 mt-1">
            {((advancingStocks / totalStocks) * 100).toFixed(1)}% of market
          </div>
        </div>

        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-gray-400 text-xs">Declining</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{decliningStocks}</div>
          <div className="text-xs text-gray-500 mt-1">
            {((decliningStocks / totalStocks) * 100).toFixed(1)}% of market
          </div>
        </div>

        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400 text-xs">A/D Ratio</span>
          </div>
          <div className="text-2xl font-bold text-white">{advanceDeclineRatio}</div>
          <div className="text-xs text-gray-500 mt-1">
            {parseFloat(advanceDeclineRatio) > 1 ? 'Bullish' : 'Bearish'} sentiment
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

      {/* Sector Performance */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold mb-4">IDX Sector Performance (Simulated)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { sector: 'Finance', change: 1.2 },
            { sector: 'Consumer', change: -0.5 },
            { sector: 'Mining', change: 2.3 },
            { sector: 'Infrastructure', change: 0.8 },
            { sector: 'Healthcare', change: -1.1 },
            { sector: 'Technology', change: 3.2 },
            { sector: 'Property', change: -0.3 },
            { sector: 'Industrial', change: 0.6 },
          ].map((sector, i) => (
            <div key={i} className="p-3 bg-gray-900/50 rounded-lg">
              <div className="text-gray-400 text-xs mb-1">{sector.sector}</div>
              <div className={`text-lg font-bold ${sector.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {sector.change >= 0 ? '+' : ''}{sector.change}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Screener Preview */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold mb-4">Stock Screener (Top IDX Stocks)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 font-semibold py-2 px-3">Symbol</th>
                <th className="text-left text-gray-400 font-semibold py-2 px-3">Name</th>
                <th className="text-right text-gray-400 font-semibold py-2 px-3">Price</th>
                <th className="text-right text-gray-400 font-semibold py-2 px-3">Change</th>
                <th className="text-right text-gray-400 font-semibold py-2 px-3">Volume</th>
              </tr>
            </thead>
            <tbody>
              {IDX_STOCKS.slice(0, 10).map((stock, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-2 px-3 text-white font-mono">{stock.symbol}</td>
                  <td className="py-2 px-3 text-gray-300">{stock.shortName}</td>
                  <td className="py-2 px-3 text-right text-white font-mono">
                    {(Math.random() * 10000 + 1000).toFixed(0)}
                  </td>
                  <td className={`py-2 px-3 text-right font-mono ${Math.random() > 0.5 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {Math.random() > 0.5 ? '+' : ''}{(Math.random() * 5 - 2.5).toFixed(2)}%
                  </td>
                  <td className="py-2 px-3 text-right text-gray-400 font-mono">
                    {(Math.random() * 10000000).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-300 text-xs">
          <strong>PHASE 03 Implementation:</strong> This panel provides Indonesian equity market intelligence. 
          In production, this would integrate with real IDX data feeds, corporate action databases, 
          and fundamental data sources. Market breadth and sector performance are simulated for demonstration.
        </p>
      </div>
    </div>
  );
}
