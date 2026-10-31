/**
 * MAMIE Multi-Asset Intelligence Hub
 * PHASE 04-07: Asset Engines, Macro, Quantitative & Portfolio
 */

import { useState } from 'react';
import { useAsset } from '../context/AssetContext';
import { useAssetPriceHistory, useVolatility, useCorrelation } from '../hooks/useDataHooks';
import { ASSETS, AssetCategory } from '../data/assetRegistry';
import { fetchAssetPriceData } from '../services/dataService';
import { 
  BarChart3, TrendingUp, Activity, DollarSign, 
  PieChart, Target, AlertTriangle, Zap 
} from 'lucide-react';

export default function MultiAssetIntelligencePanel() {
  const {  currentAsset } = useAsset();
  const { data: priceHistory } = useAssetPriceHistory(currentAsset, '3mo', '1d');
  const { volatility } = useVolatility(priceHistory, 20);
  const [activeTab, setActiveTab] = useState<'commodity' | 'fx' | 'crypto' | 'macro' | 'quant' | 'portfolio'>('commodity');

  const latestVol = volatility?.filter((v: any) => v > 0).slice(-1)[0] || 0;

  // Simulated data for demonstration
  const commodityData = [
    { name: 'Gold', price: 2345.60, change: 0.85, trend: 'up' },
    { name: 'Silver', price: 28.45, change: -1.2, trend: 'down' },
    { name: 'Crude Oil', price: 78.30, change: 2.1, trend: 'up' },
    { name: 'Natural Gas', price: 2.85, change: -0.5, trend: 'down' },
  ];

  const fxData = [
    { pair: 'EUR/USD', rate: 1.0845, change: -0.12, carry: 2.5 },
    { pair: 'GBP/USD', rate: 1.2650, change: 0.08, carry: 3.2 },
    { pair: 'USD/JPY', rate: 154.20, change: 0.45, carry: -4.8 },
    { pair: 'USD/IDR', rate: 15850, change: 0.23, carry: 5.5 },
  ];

  const cryptoData = [
    { name: 'Bitcoin', price: 67432.50, change: 2.15, dominance: 52.3 },
    { name: 'Ethereum', price: 3542.80, change: 1.85, dominance: 17.8 },
    { name: 'Solana', price: 178.45, change: 5.32, dominance: 3.2 },
    { name: 'BNB', price: 612.30, change: -0.45, dominance: 2.8 },
  ];

  const macroIndicators = [
    { indicator: 'US CPI YoY', value: '3.2%', trend: 'down', impact: 'HIGH' },
    { indicator: 'Fed Funds Rate', value: '5.25-5.50%', trend: 'stable', impact: 'HIGH' },
    { indicator: 'US 10Y Yield', value: '4.25%', trend: 'up', impact: 'MEDIUM' },
    { indicator: 'BI Rate', value: '6.00%', trend: 'stable', impact: 'HIGH' },
    { indicator: 'ID CPI YoY', value: '2.8%', trend: 'down', impact: 'MEDIUM' },
  ];

  const regimeIndicators = [
    { asset: 'Gold', regime: 'TRENDING_UP', confidence: 78 },
    { asset: 'S&P 500', regime: 'RANGING', confidence: 65 },
    { asset: 'Bitcoin', regime: 'HIGH_VOLATILITY', confidence: 82 },
    { asset: 'USD/IDR', regime: 'TRENDING_UP', confidence: 71 },
  ];

  const portfolioMetrics = {
    totalValue: 1250000,
    dailyPnL: 12450,
    dailyPnLPercent: 1.0,
    sharpeRatio: 1.45,
    maxDrawdown: -8.5,
    var95: -45000,
    beta: 1.12,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Multi-Asset Intelligence Hub
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Cross-asset analysis, macro intelligence, quantitative models & portfolio risk
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-800">
        {[
          { id: 'commodity', label: 'Commodities', icon: DollarSign },
          { id: 'fx', label: 'Forex', icon: TrendingUp },
          { id: 'crypto', label: 'Crypto', icon: Zap },
          { id: 'macro', label: 'Macro', icon: Activity },
          { id: 'quant', label: 'Quantitative', icon: Target },
          { id: 'portfolio', label: 'Portfolio', icon: PieChart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Commodities Tab */}
      {activeTab === 'commodity' && (
        <div className="space-y-4">
          <div className="premium-card p-4">
            <h3 className="text-white font-semibold mb-4">Commodity Prices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commodityData.map((item, i) => (
                <div key={i} className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{item.name}</span>
                    <span className={`text-sm font-mono ${item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    ${item.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Trend: {item.trend === 'up' ? '↑ Bullish' : '↓ Bearish'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Forex Tab */}
      {activeTab === 'fx' && (
        <div className="space-y-4">
          <div className="premium-card p-4">
            <h3 className="text-white font-semibold mb-4">Major Currency Pairs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-400 font-semibold py-2 px-3">Pair</th>
                    <th className="text-right text-gray-400 font-semibold py-2 px-3">Rate</th>
                    <th className="text-right text-gray-400 font-semibold py-2 px-3">Change</th>
                    <th className="text-right text-gray-400 font-semibold py-2 px-3">Carry</th>
                  </tr>
                </thead>
                <tbody>
                  {fxData.map((item, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      <td className="py-2 px-3 text-white font-semibold">{item.pair}</td>
                      <td className="py-2 px-3 text-right text-white font-mono">{item.rate.toFixed(4)}</td>
                      <td className={`py-2 px-3 text-right font-mono ${item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </td>
                      <td className={`py-2 px-3 text-right font-mono ${item.carry >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.carry >= 0 ? '+' : ''}{item.carry}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Crypto Tab */}
      {activeTab === 'crypto' && (
        <div className="space-y-4">
          <div className="premium-card p-4">
            <h3 className="text-white font-semibold mb-4">Cryptocurrency Market</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cryptoData.map((item, i) => (
                <div key={i} className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{item.name}</span>
                    <span className={`text-sm font-mono ${item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    ${item.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Dominance: {item.dominance}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Macro Tab */}
      {activeTab === 'macro' && (
        <div className="space-y-4">
          <div className="premium-card p-4">
            <h3 className="text-white font-semibold mb-4">Key Macro Indicators</h3>
            <div className="space-y-3">
              {macroIndicators.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{item.indicator}</div>
                    <div className="text-xs text-gray-500">Impact: {item.impact}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-mono font-semibold">{item.value}</div>
                    <div className={`text-xs ${
                      item.trend === 'up' ? 'text-emerald-400' : 
                      item.trend === 'down' ? 'text-red-400' : 
                      'text-gray-400'
                    }`}>
                      {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'} {item.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quantitative Tab */}
      {activeTab === 'quant' && (
        <div className="space-y-4">
          <div className="premium-card p-4">
            <h3 className="text-white font-semibold mb-4">Market Regime Detection</h3>
            <div className="space-y-3">
              {regimeIndicators.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{item.asset}</div>
                    <div className="text-xs text-gray-500">Confidence: {item.confidence}%</div>
                  </div>
                  <div className={`text-sm font-mono font-semibold px-3 py-1 rounded ${
                    item.regime === 'TRENDING_UP' ? 'bg-emerald-500/20 text-emerald-400' :
                    item.regime === 'TRENDING_DOWN' ? 'bg-red-500/20 text-red-400' :
                    item.regime === 'HIGH_VOLATILITY' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {item.regime.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card p-4">
            <h3 className="text-white font-semibold mb-4">Current Asset Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">Realized Volatility</div>
                <div className="text-2xl font-bold text-white">{latestVol.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Vol Regime</div>
                <div className="text-2xl font-bold text-white">
                  {latestVol > 20 ? 'HIGH' : latestVol > 10 ? 'NORMAL' : 'LOW'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="premium-card p-4">
            <h3 className="text-white font-semibold mb-4">Portfolio Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">Total Value</div>
                <div className="text-xl font-bold text-white">
                  ${portfolioMetrics.totalValue.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Daily P&L</div>
                <div className={`text-xl font-bold ${portfolioMetrics.dailyPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {portfolioMetrics.dailyPnL >= 0 ? '+' : ''}${portfolioMetrics.dailyPnL.toLocaleString()}
                </div>
                <div className={`text-xs ${portfolioMetrics.dailyPnLPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ({portfolioMetrics.dailyPnLPercent}%)
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Sharpe Ratio</div>
                <div className="text-xl font-bold text-white">{portfolioMetrics.sharpeRatio}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Beta</div>
                <div className="text-xl font-bold text-white">{portfolioMetrics.beta}</div>
              </div>
            </div>
          </div>

          <div className="premium-card p-4">
            <h3 className="text-white font-semibold mb-4">Risk Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">Max Drawdown</div>
                <div className="text-xl font-bold text-red-400">{portfolioMetrics.maxDrawdown}%</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">VaR (95%)</div>
                <div className="text-xl font-bold text-red-400">
                  -${Math.abs(portfolioMetrics.var95).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-300 text-xs">
          <strong>PHASE 04-07 Implementation:</strong> This hub provides multi-asset intelligence across commodities, 
          forex, crypto, macro indicators, quantitative models, and portfolio risk. Data is simulated for demonstration. 
          In production, this would integrate with real-time market data feeds and quantitative models.
        </p>
      </div>
    </div>
  );
}
