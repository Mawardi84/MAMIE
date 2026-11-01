import NotConfiguredMessage from './NotConfiguredMessage';

export default function ProbabilityPanel() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">Probability Models</h1>
        <p className="text-gray-400 text-sm mt-1">
          Statistical distribution fitting, regime transitions & scenario analysis
        </p>
      </div>

      <NotConfiguredMessage 
        feature="Probability Models"
        reason="Probability models require validated statistical models with proper out-of-sample testing, walk-forward validation, and calibration. Current implementation uses simulated data."
        alternative="This feature can be enabled by implementing proper statistical models (GARCH, HMM, Monte Carlo) with validated historical data."
      />

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">What This Feature Would Provide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-emerald-400 text-sm font-semibold mb-2">Distribution Analysis</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Return distribution fitting</li>
              <li>• Fat tail analysis (kurtosis)</li>
              <li>• Skewness measurement</li>
              <li>• Normality tests (Jarque-Bera)</li>
              <li>• Value at Risk (VaR) calculation</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-blue-400 text-sm font-semibold mb-2">Regime Detection</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Hidden Markov Models (HMM)</li>
              <li>• Markov switching models</li>
              <li>• Change point detection</li>
              <li>• Regime transition probabilities</li>
              <li>• Regime-dependent parameters</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-amber-400 text-sm font-semibold mb-2">Volatility Models</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• GARCH(1,1) modeling</li>
              <li>• EGARCH for asymmetry</li>
              <li>• Volatility forecasting</li>
              <li>• Volatility surface</li>
              <li>• Realized volatility</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-purple-400 text-sm font-semibold mb-2">Scenario Analysis</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Monte Carlo simulation</li>
              <li>• Historical simulation</li>
              <li>• Stress testing</li>
              <li>• Scenario probabilities</li>
              <li>• Tail risk assessment</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-300 text-sm">
          <strong>Warning:</strong> Probability models must be properly validated with out-of-sample testing 
          and walk-forward analysis. Models that are not properly validated can give false confidence and 
          lead to poor decision-making. Always check model assumptions and limitations.
        </p>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Validation Requirements</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-emerald-400 text-xs font-bold">1</span>
            </div>
            <div>
              <h3 className="text-white text-sm font-medium">Out-of-Sample Testing</h3>
              <p className="text-gray-400 text-xs mt-1">
                Models must be tested on data not used in training to verify predictive power.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-emerald-400 text-xs font-bold">2</span>
            </div>
            <div>
              <h3 className="text-white text-sm font-medium">Walk-Forward Validation</h3>
              <p className="text-gray-400 text-xs mt-1">
                Rolling window validation to ensure model stability across different market conditions.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-emerald-400 text-xs font-bold">3</span>
            </div>
            <div>
              <h3 className="text-white text-sm font-medium">Calibration Checks</h3>
              <p className="text-gray-400 text-xs mt-1">
                Probability calibration to ensure predicted probabilities match actual frequencies.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-emerald-400 text-xs font-bold">4</span>
            </div>
            <div>
              <h3 className="text-white text-sm font-medium">Statistical Significance</h3>
              <p className="text-gray-400 text-xs mt-1">
                All model outputs must have confidence intervals and p-values to assess reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
