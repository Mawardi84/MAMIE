import NotConfiguredMessage from './NotConfiguredMessage';

export default function OrderFlowPanel() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">Order Flow Analysis</h1>
        <p className="text-gray-400 text-sm mt-1">
          Trade delta, order flow imbalance, and market microstructure analysis
        </p>
      </div>

      <NotConfiguredMessage 
        feature="Order Flow Analysis"
        reason="Order flow analysis requires Level 2 (L2) or Level 3 (L3) market data with full order book depth, which is not available through free APIs."
        alternative="This feature can be enabled by integrating with institutional data providers like Databento, Polygon.io, or direct exchange feeds."
      />

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">What This Feature Would Provide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-emerald-400 text-sm font-semibold mb-2">Trade Flow Analysis</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Aggressive buy/sell volume</li>
              <li>• Passive buy/sell volume</li>
              <li>• Trade delta (buy - sell)</li>
              <li>• Cumulative volume delta (CVD)</li>
              <li>• Volume-weighted average price (VWAP)</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-blue-400 text-sm font-semibold mb-2">Order Book Analysis</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Bid/ask depth visualization</li>
              <li>• Order book imbalance</li>
              <li>• Liquidity zones detection</li>
              <li>• Iceberg order detection</li>
              <li>• Spoofing detection</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-amber-400 text-sm font-semibold mb-2">Market Microstructure</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Bid-ask spread analysis</li>
              <li>• Market impact estimation</li>
              <li>• Price discovery process</li>
              <li>• Liquidity provision metrics</li>
              <li>• Toxicity flow (VPIN)</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-purple-400 text-sm font-semibold mb-2">Institutional Activity</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Large order detection</li>
              <li>• Institutional footprint</li>
              <li>• Absorption patterns</li>
              <li>• Liquidity sweeps</li>
              <li>• Stop hunt detection</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          <strong>Note:</strong> Order flow analysis requires tick-level data with full order book depth (L2/L3). 
          This data is typically only available through institutional data providers and direct exchange feeds. 
          Free APIs provide only aggregated OHLCV data, which is insufficient for true order flow analysis.
        </p>
      </div>
    </div>
  );
}
