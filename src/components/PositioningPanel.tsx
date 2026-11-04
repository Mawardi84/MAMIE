import { useState, useEffect } from 'react';
import { useAsset } from '../context/AssetContext';
import { fetchCOTForAsset } from '../services/dataService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { AlertTriangle, TrendingUp, Users, BarChart3 } from 'lucide-react';

export default function PositioningPanel() {
  const { currentAsset } = useAsset();
  const [cotData, setCotData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentAsset.hasCOT) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchCOTForAsset(currentAsset, 52);
        setCotData(data || []);
      } catch (e) {
        console.error('COT data fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentAsset.symbol]);

  // Calculate net positioning
  const positioningData = cotData.map((d: any) => ({
    date: d.date,
    nonCommercialNet: d.nonCommercialLong - d.nonCommercialShort,
    commercialNet: d.commercialLong - d.commercialShort,
    totalNet: d.totalLong - d.totalShort,
    nonCommercialLong: d.nonCommercialLong,
    nonCommercialShort: d.nonCommercialShort,
  }));

  // Latest positioning
  const latest = positioningData[positioningData.length - 1];
  const prev = positioningData[positioningData.length - 2];
  const netChange = latest && prev ? latest.nonCommercialNet - prev.nonCommercialNet : 0;

  // Percentile rank (4-week)
  const recentNet = positioningData.slice(-4).map((d: any) => d.nonCommercialNet);
  const percentile = recentNet.length > 0 
    ? (recentNet.filter((v: number) => v <= (latest?.nonCommercialNet || 0)).length / recentNet.length) * 100 
    : 50;

  if (!currentAsset.hasCOT) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gradient-gold">Positioning Intelligence</h1>
        <div className="premium-card p-8 mt-6 text-center">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">COT Data Not Available</h3>
          <p className="text-gray-400 text-sm">
            CFTC Commitment of Traders data is not available for {currentAsset.shortName}.
            <br />
            This feature is available for futures and major forex pairs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">Positioning Intelligence</h1>
        <p className="text-gray-400 text-sm mt-1">CFTC COT, Open Interest & Net Positioning Analysis</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-xs">Spec Net Position</span>
          </div>
          <div className={`text-xl font-bold font-mono ${latest?.nonCommercialNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {latest ? (latest.nonCommercialNet / 1000).toFixed(0) : '---'}K
          </div>
          <div className={`text-xs font-mono ${netChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {netChange >= 0 ? '+' : ''}{(netChange / 1000).toFixed(1)}K
          </div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-400 text-xs">4-Week Percentile</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{percentile.toFixed(0)}%</div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400 text-xs">Spec Long</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {latest ? (latest.nonCommercialLong / 1000).toFixed(0) : '---'}K
          </div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-red-400" />
            <span className="text-gray-400 text-xs">Spec Short</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {latest ? (latest.nonCommercialShort / 1000).toFixed(0) : '---'}K
          </div>
        </div>
      </div>

      {/* Net Positioning Chart */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Non-Commercial Net Positioning (52 Weeks)</h3>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">Loading COT data...</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={positioningData}>
              <defs>
                <linearGradient id="netPosGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={8} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="nonCommercialNet" stroke="#8b5cf6" fill="url(#netPosGrad)" strokeWidth={2} name="Net Position" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Long vs Short */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Speculative Long vs Short</h3>
        {loading ? (
          <div className="h-[250px] flex items-center justify-center text-gray-500">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={positioningData.slice(-20)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={3} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="nonCommercialLong" fill="#10b981" fillOpacity={0.7} name="Long" />
              <Bar dataKey="nonCommercialShort" fill="#ef4444" fillOpacity={0.7} name="Short" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Data Source Notice */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-blue-400 font-semibold text-sm">Data Source & Validation Notice</h3>
            <p className="text-gray-300 text-xs mt-1">
              <strong>COT Data:</strong> Real-time from CFTC API (publicreporting.cftc.gov). Updated weekly on Fridays.
            </p>
            <p className="text-gray-300 text-xs mt-1">
              <strong>Positioning Analysis:</strong> Based on reported positions. May not reflect all market participants (e.g., non-reported positions).
            </p>
            <p className="text-gray-300 text-xs mt-1">
              <strong>For Trading Decisions:</strong> Combine with price action and other indicators. COT data is lagging (released Friday for Tuesday data).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
