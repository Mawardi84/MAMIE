import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity, DollarSign, PieChart, Target, AlertTriangle, Zap } from 'lucide-react';
import { fetchAssetQuote } from '../services/dataService';
import NotConfiguredMessage from './NotConfiguredMessage';

interface AssetData {
  symbol: string;
  name: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
}

export default function MultiAssetIntelligencePanel() {
  const [activeTab, setActiveTab] = useState<'commodity' | 'fx' | 'crypto' | 'macro' | 'quant' | 'portfolio'>('commodity');
  const [commodityData, setCommodityData] = useState<AssetData[]>([]);
  const [fxData, setFxData] = useState<AssetData[]>([]);
  const [cryptoData, setCryptoData] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch commodity data
        const commodities = await Promise.all([
          fetchAssetQuote('GC=F').catch(() => null),
          fetchAssetQuote('SI=F').catch(() => null),
          fetchAssetQuote('CL=F').catch(() => null),
          fetchAssetQuote('NG=F').catch(() => null),
        ]);

        setCommodityData([
          { symbol: 'GC=F', name: 'Gold', price: commodities[0]?.price || null, change: commodities[0]?.change || null, changePercent: commodities[0]?.changePercent || null },
          { symbol: 'SI=F', name: 'Silver', price: commodities[1]?.price || null, change: commodities[1]?.change || null, changePercent: commodities[1]?.changePercent || null },
          { symbol: 'CL=F', name: 'Crude Oil', price: commodities[2]?.price || null, change: commodities[2]?.change || null, changePercent: commodities[2]?.changePercent || null },
          { symbol: 'NG=F', name: 'Natural Gas', price: commodities[3]?.price || null, change: commodities[3]?.change || null, changePercent: commodities[3]?.changePercent || null },
        ]);

        // Fetch FX data
        const fx = await Promise.all([
          fetchAssetQuote('EURUSD=X').catch(() => null),
          fetchAssetQuote('GBPUSD=X').catch(() => null),
          fetchAssetQuote('USDJPY=X').catch(() => null),
        ]);

        setFxData([
          { symbol: 'EURUSD=X', name: 'EUR/USD', price: fx[0]?.price || null, change: fx[0]?.change || null, changePercent: fx[0]?.changePercent || null },
          { symbol: 'GBPUSD=X', name: 'GBP/USD', price: fx[1]?.price || null, change: fx[1]?.change || null, changePercent: fx[1]?.changePercent || null },
          { symbol: 'USDJPY=X', name: 'USD/JPY', price: fx[2]?.price || null, change: fx[2]?.change || null, changePercent: fx[2]?.changePercent || null },
        ]);

        // Fetch crypto data
        const crypto = await Promise.all([
          fetchAssetQuote('BTC-USD').catch(() => null),
          fetchAssetQuote('ETH-USD').catch(() => null),
        ]);

        setCryptoData([
          { symbol: 'BTC-USD', name: 'Bitcoin', price: crypto[0]?.price || null, change: crypto[0]?.change || null, changePercent: crypto[0]?.changePercent || null },
          { symbol: 'ETH-USD', name: 'Ethereum', price: crypto[1]?.price || null, change: crypto[1]?.change || null, changePercent: crypto[1]?.changePercent || null },
        ]);
      } catch (error) {
        console.error('Failed to fetch multi-asset data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const renderAssetCard = (asset: AssetData) => (
    <div key={asset.symbol} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-semibold">{asset.name}</span>
        {asset.changePercent !== null && (
          <span className={`text-xs font-mono ${asset.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
          </span>
        )}
      </div>
      {asset.price !== null ? (
        <div className="text-xl font-bold text-white font-mono">
          {asset.price < 10 ? asset.price.toFixed(4) : asset.price.toFixed(2)}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">Data unavailable</div>
      )}
    </div>
  );

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
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Commodity Prices</h3>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commodityData.map(renderAssetCard)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Forex Tab */}
      {activeTab === 'fx' && (
        <div className="space-y-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Major Currency Pairs</h3>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fxData.map(renderAssetCard)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Crypto Tab */}
      {activeTab === 'crypto' && (
        <div className="space-y-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Cryptocurrency Market</h3>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cryptoData.map(renderAssetCard)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Macro Tab */}
      {activeTab === 'macro' && (
        <NotConfiguredMessage 
          feature="Macro Intelligence"
          reason="Economic indicators require FRED API integration for real-time data."
          alternative="This feature can be enabled by integrating with FRED API or other economic data providers."
        />
      )}

      {/* Quantitative Tab */}
      {activeTab === 'quant' && (
        <NotConfiguredMessage 
          feature="Quantitative Models"
          reason="Advanced quantitative models require validated statistical implementations."
          alternative="This feature can be enabled by implementing regime detection, probability models, and statistical analysis."
        />
      )}

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <NotConfiguredMessage 
          feature="Portfolio Risk Analysis"
          reason="Portfolio analysis requires position data and risk modeling."
          alternative="This feature can be enabled by implementing portfolio management and risk analytics."
        />
      )}
    </div>
  );
}
