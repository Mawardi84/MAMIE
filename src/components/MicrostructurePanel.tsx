import { useState, useEffect, useMemo } from 'react';
import { useAsset } from '../context/AssetContext';
import { useAssetQuote, useAssetPriceHistory, useVolatility } from '../hooks/useDataHooks';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ComposedChart, Line } from 'recharts';
import { Activity, TrendingUp, TrendingDown, Zap, Layers, AlertTriangle } from 'lucide-react';

export default function MicrostructurePanel() {
  const { currentAsset } = useAsset();
  const { data: quote } = useAssetQuote(currentAsset);
  const { data: priceHistory } = useAssetPriceHistory(currentAsset, '1mo', '1d');
  const { volatility } = useVolatility(priceHistory, 20);

  // Generate trade delta data from price history
  const tradeDeltaData = useMemo(() => {
    if (!priceHistory || priceHistory.length < 2) return [];
    return priceHistory.slice(1).map((d: any, i: number) => {
      const prev = priceHistory[i];
      const priceChange = d.close - prev.close;
      const volume = d.volume;
      // Estimate delta: positive price change = more buying
      const buyVolume = Math.floor(volume * (0.5 + (priceChange / prev.close) * 10));
      const sellVolume = volume - buyVolume;
      return {
        date: d.date,
        delta: buyVolume - sellVolume,
        buyVolume,
        sellVolume,
        price: d.close,
        volume,
      };
    });
  }, [priceHistory]);

  // Cumulative Volume Delta (CVD)
  const cvdData = useMemo(() => {
    let cumulative = 0;
    return tradeDeltaData.map((d: any) => {
      cumulative += d.delta;
      return { ...d, cvd: cumulative };
    });
  }, [tradeDeltaData]);

  // Order Flow Imbalance (OFI)
  const ofiData = useMemo(() => {
    return tradeDeltaData.map((d: any) => ({
      date: d.date,
      ofi: d.delta / d.volume,
      price: d.price,
    }));
  }, [tradeDeltaData]);

  // Order book depth (simulated from current price)
  const depthData = useMemo(() => {
    if (!quote) return [];
    const price = quote.price;
    const tick = currentAsset.tickSize;
    const decimals = currentAsset.category === 'forex' ? 5 : 2;
    
    return Array.from({ length: 20 }, (_, i) => {
      const offset = (i - 10) * tick * 3;
      const levelPrice = price + offset;
      const isBid = offset < 0;
      // Volume increases with distance (realistic depth)
      const baseVolume = 50 + Math.random() * 200;
      const distanceFactor = 1 + Math.abs(i - 10) * 0.3;
      const volume = Math.floor(baseVolume * distanceFactor);
      
      return {
        price: Number(levelPrice.toFixed(decimals)),
        bidDepth: isBid ? volume : 0,
        askDepth: !isBid ? volume : 0,
        totalDepth: volume,
      };
    });
  }, [quote, currentAsset]);

  // Key metrics
  const latestDelta = tradeDeltaData[tradeDeltaData.length - 1]?.delta || 0;
  const avgDelta = tradeDeltaData.reduce((a: number, b: any) => a + b.delta, 0) / tradeDeltaData.length || 0;
  const latestOFI = ofiData[ofiData.length - 1]?.ofi || 0;
  const totalBidDepth = depthData.reduce((a: number, b: any) => a + b.bidDepth, 0);
  const totalAskDepth = depthData.reduce((a: number, b: any) => a + b.askDepth, 0);
  const depthImbalance = totalBidDepth - totalAskDepth;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-gold">Microstructure Analysis</h1>
          <p className="text-gray-400 text-sm mt-1">Trade Delta, Order Flow Imbalance, Depth & Order Book</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-xs font-semibold">
            {currentAsset.shortName}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400 text-xs">Latest Delta</span>
          </div>
          <div className={`text-xl font-bold font-mono ${latestDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {latestDelta >= 0 ? '+' : ''}{(latestDelta / 1000).toFixed(1)}K
          </div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-400 text-xs">OFI (Latest)</span>
          </div>
          <div className={`text-xl font-bold font-mono ${latestOFI >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {latestOFI >= 0 ? '+' : ''}{(latestOFI * 100).toFixed(1)}%
          </div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-xs">Depth Imbalance</span>
          </div>
          <div className={`text-xl font-bold font-mono ${depthImbalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {depthImbalance >= 0 ? '+' : ''}{(depthImbalance / 1000).toFixed(1)}K
          </div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-400 text-xs">Avg Delta</span>
          </div>
          <div className={`text-xl font-bold font-mono ${avgDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {avgDelta >= 0 ? '+' : ''}{(avgDelta / 1000).toFixed(1)}K
          </div>
        </div>
      </div>

      {/* Trade Delta Chart */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Trade Delta (Buy vs Sell Volume)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={tradeDeltaData.slice(-30)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={4} />
            <YAxis stroke="#6b7280" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
            <Bar dataKey="buyVolume" stackId="a" fill="#10b981" fillOpacity={0.7} name="Buy Volume" />
            <Bar dataKey="sellVolume" stackId="a" fill="#ef4444" fillOpacity={0.7} name="Sell Volume" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CVD & OFI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="premium-card p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Cumulative Volume Delta (CVD)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cvdData.slice(-30)}>
              <defs>
                <linearGradient id="cvdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={5} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="cvd" stroke="#f59e0b" fill="url(#cvdGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="premium-card p-4">
          <h3 className="text-white font-semibold text-sm mb-4">Order Flow Imbalance (OFI)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={ofiData.slice(-30)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={5} />
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={10} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar yAxisId="left" dataKey="ofi" name="OFI">
                {ofiData.slice(-30).map((entry: any, index: number) => (
                  <Cell key={index} fill={entry.ofi >= 0 ? '#10b981' : '#ef4444'} fillOpacity={0.7} />
                ))}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2} dot={false} name="Price" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Book Depth */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Order Book Depth Profile</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={depthData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
            <XAxis type="number" stroke="#6b7280" fontSize={10} />
            <YAxis dataKey="price" type="category" stroke="#6b7280" fontSize={10} width={80} />
            <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
            <Bar dataKey="bidDepth" stackId="a" fill="#10b981" fillOpacity={0.7} name="Bid Depth" />
            <Bar dataKey="askDepth" stackId="a" fill="#ef4444" fillOpacity={0.7} name="Ask Depth" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Source Notice */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-blue-400 font-semibold text-sm">Data Source & Validation Notice</h3>
            <p className="text-gray-300 text-xs mt-1">
              <strong>Trade Delta & OFI:</strong> Estimated from daily OHLCV data. For tick-level accuracy, requires institutional L2/L3 market data feeds.
            </p>
            <p className="text-gray-300 text-xs mt-1">
              <strong>Order Book Depth:</strong> Simulated depth profile based on current price. Real order book requires direct exchange feed.
            </p>
            <p className="text-gray-300 text-xs mt-1">
              <strong>For Trading Decisions:</strong> Validate all metrics against verified data sources before use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
