import NotConfiguredMessage from './NotConfiguredMessage';

export default function ComexSpotPanel() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">COMEX Futures ↔ Spot Integration</h1>
        <p className="text-gray-400 text-sm mt-1">
          Basis analysis, arbitrage detection & cross-market flow mapping
        </p>
      </div>

      <NotConfiguredMessage 
        feature="COMEX Futures vs Spot Analysis"
        reason="COMEX futures and spot price data requires specialized market data feeds (CME Group, LBMA) that are not available through free APIs."
        alternative="This feature can be enabled by integrating with paid data providers like CME Direct, Bloomberg, or Refinitiv."
      />

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">What This Feature Would Provide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-cyan-400 text-sm font-semibold mb-2">1. Basis Modeling</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Fair value = Spot + Cost of Carry</li>
              <li>• Z-score normalization for signal</li>
              <li>• Calendar spread decomposition</li>
              <li>• Delivery month roll analysis</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-amber-400 text-sm font-semibold mb-2">2. Flow Mapping</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• COMEX volume → spot impact</li>
              <li>• Open interest change signals</li>
              <li>• EFP (Exchange for Physical) tracking</li>
              <li>• Delivery notice monitoring</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-purple-400 text-sm font-semibold mb-2">3. Arbitrage Detection</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Cash-and-carry arb signals</li>
              <li>• Reverse arb identification</li>
              <li>• Cross-exchange spread analysis</li>
              <li>• Statistical arb (mean-reversion)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          <strong>Note:</strong> This analysis requires real-time COMEX futures data and XAU/USD spot prices 
          from institutional data providers. Free APIs do not provide the necessary granularity for basis 
          trading and arbitrage detection.
        </p>
      </div>
    </div>
  );
}
