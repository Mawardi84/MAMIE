import { useMemo } from 'react';
import { useAsset } from '../context/AssetContext';
import { useAssetPriceHistory } from '../hooks/useDataHooks';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart, Bar } from 'recharts';
import { Droplets, Zap, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

export default function LiquidityPanel() {
  const { currentAsset } = useAsset();
  const { data: priceHistory } = useAssetPriceHistory(currentAsset, '3mo', '1d');

  // Calculate liquidity metrics from price history
  const liquidityMetrics = useMemo(() => {
    if (!priceHistory || priceHistory.length < 5) return [];
    
    return priceHistory.slice(5).map((d: any, i: number) => {
      const window = priceHistory.slice(i, i + 5);
      const high = Math.max(...window.map((w: any) => w.high));
      const low = Math.min(...window.map((w: any) => w.low));
      const range = high - low;
      const avgVolume = window.reduce((sum: number, w: any) => sum + w.volume, 0) / window.length;
      
      // Absorption: high volume with small price range
      const absorption = avgVolume / (range + 0.001);
      
      // Sweep: price moves beyond range then reverses
      const sweep = Math.abs(d.close - d.open) / range;
      
      // Depletion: decreasing volume over time
      const recentVol = window.slice(-2).reduce((sum: number, w: any) => sum + w.volume, 0) / 2;
      const olderVol = window.slice(0, 2).reduce((sum: number, w: any) => sum + w.volume, 0) / 2;
      const depletion = olderVol > 0 ? (olderVol - recentVol) / olderVol : 0;
      
      // Replenishment: increasing volume
      const replenishment = depletion < 0 ? -depletion : 0;
      
      return {
        date: d.date,
        price: d.close,
        volume: d.volume,
        absorption: Math.min(absorption / 1000, 100), // Normalize
        sweep: sweep * 100,
        depletion: depletion * 100,
        replenishment: replenishment * 100,
        range,
      };
    });
  }, [priceHistory]);

  // Detect liquidity events
  const events = useMemo(() => {
    if (!liquidityMetrics.length) return [];
    
    return liquidityMetrics
      .filter((m: any) => m.absorption > 50 || m.sweep > 70 || m.depletion > 30)
      .slice(-10)
      .map((m: any) => ({
        date: m.date,
        type: m.absorption > 50 ? 'ABSORPTION' : m.sweep > 70 ? 'SWEEP' : 'DEPLETION',
        severity: m.absorption > 70 || m.sweep > 80 ? 'HIGH' : 'MEDIUM',
        value: m.absorption > 50 ? m.absorption : m.sweep > 70 ? m.sweep : m.depletion,
      }));
  }, [liquidityMetrics]);

  // Key stats
  const avgAbsorption = liquidityMetrics.reduce((sum: number, m: any) => sum + m.absorption, 0) / liquidityMetrics.length || 0;
  const maxSweep = Math.max(...liquidityMetrics.map((m: any) => m.sweep)) || 0;
  const avgDepletion = liquidityMetrics.reduce((sum: number, m: any) => sum + m.depletion, 0) / liquidityMetrics.length || 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">Liquidity Intelligence</h1>
        <p className="text-gray-400 text-sm mt-1">Absorption, Sweep, Depletion & Replenishment Detection</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-xs">Avg Absorption</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{avgAbsorption.toFixed(1)}</div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400 text-xs">Max Sweep</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{maxSweep.toFixed(1)}%</div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-red-400" />
            <span className="text-gray-400 text-xs">Avg Depletion</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{avgDepletion.toFixed(1)}%</div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-400 text-xs">Events Detected</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{events.length}</div>
        </div>
      </div>

      {/* Liquidity Metrics Chart */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Liquidity Metrics Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={liquidityMetrics.slice(-40)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={5} />
            <YAxis stroke="#6b7280" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="absorption" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Absorption" />
            <Line type="monotone" dataKey="sweep" stroke="#f59e0b" strokeWidth={2} dot={false} name="Sweep" />
            <Line type="monotone" dataKey="depletion" stroke="#ef4444" strokeWidth={2} dot={false} name="Depletion" />
            <Line type="monotone" dataKey="replenishment" stroke="#10b981" strokeWidth={2} dot={false} name="Replenishment" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Liquidity Events */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Detected Liquidity Events</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No significant liquidity events detected</p>
          ) : (
            events.map((event: any, i: number) => (
              <div key={i} className={`p-3 rounded-lg border ${
                event.severity === 'HIGH' ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-semibold">{event.type}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      event.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>{event.severity}</span>
                    <span className="text-gray-400 text-xs">{event.date}</span>
                  </div>
                </div>
                <div className="text-gray-400 text-xs">
                  Intensity: {event.value.toFixed(1)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Data Source Notice */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-blue-400 font-semibold text-sm">Data Source & Validation Notice</h3>
            <p className="text-gray-300 text-xs mt-1">
              <strong>Liquidity Metrics:</strong> Calculated from daily OHLCV data. For tick-level liquidity analysis, requires institutional L2/L3 market data feeds.
            </p>
            <p className="text-gray-300 text-xs mt-1">
              <strong>Event Detection:</strong> Thresholds are heuristic-based. Validate against verified data sources before trading decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
