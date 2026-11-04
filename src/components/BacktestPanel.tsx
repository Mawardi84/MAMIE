import NotConfiguredMessage from './NotConfiguredMessage';

export default function BacktestPanel() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">Backtesting & Validation</h1>
        <p className="text-gray-400 text-sm mt-1">
          Strategy performance, statistical significance & out-of-sample testing
        </p>
      </div>

      <NotConfiguredMessage 
        feature="Backtesting Engine"
        reason="Backtesting requires comprehensive historical data with proper corporate action adjustments, survivorship bias handling, and transaction cost modeling."
        alternative="This feature can be enabled by integrating with historical data providers and implementing a proper backtesting framework."
      />

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">What This Feature Would Provide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-emerald-400 text-sm font-semibold mb-2">Performance Metrics</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Total return & CAGR</li>
              <li>• Sharpe ratio & Sortino ratio</li>
              <li>• Maximum drawdown</li>
              <li>• Win rate & profit factor</li>
              <li>• Risk-adjusted returns</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-blue-400 text-sm font-semibold mb-2">Validation Methods</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Walk-forward analysis</li>
              <li>• Out-of-sample testing</li>
              <li>• Monte Carlo simulation</li>
              <li>• Statistical significance tests</li>
              <li>• Regime-dependent analysis</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-amber-400 text-sm font-semibold mb-2">Data Requirements</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Historical OHLCV data</li>
              <li>• Corporate action adjustments</li>
              <li>• Survivorship bias handling</li>
              <li>• Transaction cost modeling</li>
              <li>• Slippage estimation</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-purple-400 text-sm font-semibold mb-2">Risk Analysis</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Value at Risk (VaR)</li>
              <li>• Expected Shortfall (CVaR)</li>
              <li>• Stress testing</li>
              <li>• Scenario analysis</li>
              <li>• Tail risk assessment</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-300 text-sm">
          <strong>Important:</strong> Backtesting results are highly dependent on data quality and methodology. 
          Past performance does not guarantee future results. Always validate strategies with out-of-sample 
          testing and consider transaction costs, slippage, and market impact.
        </p>
      </div>
    </div>
  );
}
