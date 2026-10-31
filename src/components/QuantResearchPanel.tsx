import { useMemo } from 'react';
import { useAsset } from '../context/AssetContext';
import { useAssetPriceHistory, useVolatility } from '../hooks/useDataHooks';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { Brain, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

export default function QuantResearchPanel() {
  const { currentAsset } = useAsset();
  const { data: priceHistory } = useAssetPriceHistory(currentAsset, '6mo', '1d');
  const { volatility } = useVolatility(priceHistory, 20);

  // Regime detection (simple: trending up/down/range based on returns)
  const regimeData = useMemo(() => {
    if (!priceHistory || priceHistory.length < 20) return [];
    
    return priceHistory.slice(20).map((d: any, i: number) => {
      const window = priceHistory.slice(i, i + 20);
      const returns = window.slice(1).map((w: any, j: number) => (w.close - window[j].close) / window[j].close);
      const meanReturn = returns.reduce((a: number, b: number) => a + b, 0) / returns.length;
      const volatility = Math.sqrt(returns.reduce((a: number, b: number) => a + Math.pow(b - meanReturn, 2), 0) / returns.length);
      
      let regime = 'RANGE';
      if (meanReturn > 0.005 && volatility < 0.02) regime = 'TRENDING_UP';
      else if (meanReturn < -0.005 && volatility < 0.02) regime = 'TRENDING_DOWN';
      else if (volatility > 0.03) regime = 'HIGH_VOLATILITY';
      
      return {
        date: d.date,
        price: d.close,
        regime,
        volatility: volatility * 100,
        meanReturn: meanReturn * 100,
      };
    });
  }, [priceHistory]);

  // Probability distribution (returns histogram)
  const distributionData = useMemo(() => {
    if (!priceHistory || priceHistory.length < 2) return [];
    
    const returns = priceHistory.slice(1).map((d: any, i: number) => 
      ((d.close - priceHistory[i].close) / priceHistory[i].close) * 100
    );
    
    // Create bins
    const bins = Array.from({ length: 20 }, (_, i) => {
      const binStart = -5 + (i * 0.5);
      const binEnd = binStart + 0.5;
      const count = returns.filter((r: number) => r >= binStart && r < binEnd).length;
      return {
        range: `${binStart.toFixed(1)}%`,
        count,
        percentage: (count / returns.length) * 100,
      };
    });
    
    return bins;
  }, [priceHistory]);

  // Current regime
  const currentRegime = regimeData[regimeData.length - 1]?.regime || 'UNKNOWN';
  const currentVol = volatility?.filter(v => v > 0).slice(-1)[0] || 0;

  // Hypothesis test: is current vol significantly different from historical?
  const historicalVol = volatility?.filter(v => v > 0) || [];
  const avgVol = historicalVol.reduce((a: number, b: number) => a + b, 0) / historicalVol.length || 0;
  const volStdDev = Math.sqrt(historicalVol.reduce((a: number, b: number) => a + Math.pow(b - avgVol, 2), 0) / historicalVol.length) || 1;
  const volZScore = (currentVol - avgVol) / volStdDev;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">Quantitative Research</h1>
        <p className="text-gray-400 text-sm mt-1">Regime Detection, Probability Distribution & Hypothesis Testing</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-xs">Current Regime</span>
          </div>
          <div className={`text-lg font-bold ${
            currentRegime === 'TRENDING_UP' ? 'text-emerald-400' :
            currentRegime === 'TRENDING_DOWN' ? 'text-red-400' :
            currentRegime === 'HIGH_VOLATILITY' ? 'text-amber-400' :
            'text-blue-400'
          }`}>
            {currentRegime.replace('_', ' ')}
          </div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400 text-xs">Current Volatility</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{currentVol.toFixed(1)}%</div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-400 text-xs">Vol Z-Score</span>
          </div>
          <div className={`text-xl font-bold font-mono ${
            Math.abs(volZScore) > 2 ? 'text-red-400' : Math.abs(volZScore) > 1 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {volZScore.toFixed(2)}
          </div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-400 text-xs">Avg Volatility</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{avgVol.toFixed(1)}%</div>
        </div>
      </div>

      {/* Regime Chart */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Market Regime Detection (6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={regimeData.slice(-60)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={10} />
            <YAxis stroke="#6b7280" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2} dot={false} name="Price" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Return Distribution */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Daily Return Distribution (6 Months)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
            <XAxis dataKey="range" stroke="#6b7280" fontSize={9} angle={-45} textAnchor="end" height={60} />
            <YAxis stroke="#6b7280" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
            <Bar dataKey="count" fill="#8b5cf6" fillOpacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Volatility Analysis */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Volatility Time Series</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={priceHistory?.slice(-60).map((d: any, i: number) => ({
            date: d.date,
            volatility: volatility?.[priceHistory.length - 60 + i] || 0,
          })).filter((d: any) => d.volatility > 0)}>
            <defs>
              <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={10} />
            <YAxis stroke="#6b7280" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="volatility" stroke="#06b6d4" fill="url(#volGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hypothesis Test Results */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Hypothesis Test: Volatility Regime Change</h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm font-medium">H₀: Current volatility = Historical average</span>
              <span className={`text-xs px-2 py-1 rounded ${
                Math.abs(volZScore) > 2 ? 'bg-red-500/20 text-red-400' :
                Math.abs(volZScore) > 1 ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {Math.abs(volZScore) > 2 ? 'REJECT H₀' : Math.abs(volZScore) > 1 ? 'WEAK EVIDENCE' : 'FAIL TO REJECT'}
              </span>
            </div>
            <div className="text-gray-400 text-xs">
              Z-Score: {volZScore.toFixed(2)} | Current: {currentVol.toFixed(1)}% | Historical Avg: {avgVol.toFixed(1)}%
            </div>
          </div>
          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <p className="text-amber-300 text-xs">
              <strong>Interpretation:</strong> {
                Math.abs(volZScore) > 2 
                  ? 'Current volatility is significantly different from historical average (p < 0.05). Possible regime change.'
                  : Math.abs(volZScore) > 1
                  ? 'Some evidence of volatility change, but not statistically significant at 95% confidence.'
                  : 'No significant evidence of volatility regime change.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Data Source Notice */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-blue-400 font-semibold text-sm">Data Source & Validation Notice</h3>
            <p className="text-gray-300 text-xs mt-1">
              <strong>Regime Detection:</strong> Simple heuristic-based classification. For production, use HMM or ML-based regime detection.
            </p>
            <p className="text-gray-300 text-xs mt-1">
              <strong>Statistical Tests:</strong> Based on daily returns. For intraday analysis, requires tick-level data.
            </p>
            <p className="text-gray-300 text-xs mt-1">
              <strong>For Trading Decisions:</strong> Validate all models with out-of-sample testing before deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
