import { useState, useEffect } from 'react';
import { fetchAssetPriceData } from '../services/dataService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertTriangle, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface MacroEvent {
  date: string;
  event: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export default function MacroPanel() {
  const [dxyData, setDxyData] = useState<any[]>([]);
  const [us10yData, setUs10yData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dxy, us10y] = await Promise.all([
          fetchAssetPriceData('DX-Y.NYB', '6mo', '1d'),
          fetchAssetPriceData('^TNX', '6mo', '1d'),
        ]);
        setDxyData(dxy);
        setUs10yData(us10y);
      } catch (e) {
        console.error('Macro data fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Upcoming macro events (static for demo)
  const upcomingEvents: MacroEvent[] = [
    { date: '2026-01-15', event: 'US CPI (YoY)', impact: 'HIGH', forecast: '3.2%', previous: '3.1%' },
    { date: '2026-01-17', event: 'FOMC Meeting', impact: 'HIGH', forecast: '5.25-5.50%', previous: '5.25-5.50%' },
    { date: '2026-01-19', event: 'US NFP', impact: 'HIGH', forecast: '180K', previous: '216K' },
    { date: '2026-01-22', event: 'US PMI', impact: 'MEDIUM', forecast: '50.2', previous: '49.8' },
    { date: '2026-01-25', event: 'ECB Rate Decision', impact: 'HIGH', forecast: '4.50%', previous: '4.50%' },
  ];

  // Recent events with actual data
  const recentEvents: MacroEvent[] = [
    { date: '2025-12-15', event: 'US CPI (YoY)', impact: 'HIGH', actual: '3.1%', forecast: '3.2%', previous: '3.0%' },
    { date: '2025-12-13', event: 'FOMC Meeting', impact: 'HIGH', actual: '5.25-5.50%', forecast: '5.25-5.50%', previous: '5.25-5.50%' },
    { date: '2025-12-08', event: 'US NFP', impact: 'HIGH', actual: '216K', forecast: '200K', previous: '150K' },
  ];

  const latestDXY = dxyData[dxyData.length - 1]?.close || 0;
  const latestUS10Y = us10yData[us10yData.length - 1]?.close || 0;
  const dxyChange = dxyData.length > 1 ? ((latestDXY - dxyData[dxyData.length - 2].close) / dxyData[dxyData.length - 2].close) * 100 : 0;
  const us10yChange = us10yData.length > 1 ? ((latestUS10Y - us10yData[us10yData.length - 2].close) / us10yData[us10yData.length - 2].close) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">Macro Intelligence</h1>
        <p className="text-gray-400 text-sm mt-1">CPI, NFP, FOMC, Yield Curves, DXY & Event Study</p>
      </div>

      {/* Key Macro Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-xs">DXY (USD Index)</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{latestDXY.toFixed(2)}</div>
          <div className={`text-xs font-mono ${dxyChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {dxyChange >= 0 ? '+' : ''}{dxyChange.toFixed(2)}%
          </div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-400 text-xs">US 10Y Yield</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{latestUS10Y.toFixed(2)}%</div>
          <div className={`text-xs font-mono ${us10yChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {us10yChange >= 0 ? '+' : ''}{us10yChange.toFixed(2)}%
          </div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400 text-xs">Next FOMC</span>
          </div>
          <div className="text-lg font-bold text-white">Jan 17</div>
          <div className="text-xs text-gray-400">Rate: 5.25-5.50%</div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-gray-400 text-xs">High Impact Events</span>
          </div>
          <div className="text-xl font-bold text-white">{upcomingEvents.filter(e => e.impact === 'HIGH').length}</div>
          <div className="text-xs text-gray-400">Next 30 days</div>
        </div>
      </div>

      {/* DXY & US10Y Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="premium-card p-4">
          <h3 className="text-white font-semibold text-sm mb-4">US Dollar Index (DXY)</h3>
          {loading ? (
            <div className="h-[250px] flex items-center justify-center text-gray-500">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dxyData.slice(-60)}>
                <defs>
                  <linearGradient id="dxyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={10} />
                <YAxis stroke="#6b7280" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="close" stroke="#3b82f6" fill="url(#dxyGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="premium-card p-4">
          <h3 className="text-white font-semibold text-sm mb-4">US 10-Year Treasury Yield</h3>
          {loading ? (
            <div className="h-[250px] flex items-center justify-center text-gray-500">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={us10yData.slice(-60)}>
                <defs>
                  <linearGradient id="us10yGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={10} />
                <YAxis stroke="#6b7280" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="close" stroke="#10b981" fill="url(#us10yGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Upcoming Macro Events</h3>
        <div className="space-y-2">
          {upcomingEvents.map((event, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  event.impact === 'HIGH' ? 'bg-red-400' : event.impact === 'MEDIUM' ? 'bg-amber-400' : 'bg-blue-400'
                }`}></div>
                <div>
                  <div className="text-white text-sm font-medium">{event.event}</div>
                  <div className="text-gray-400 text-xs">{event.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                {event.forecast && (
                  <div>
                    <div className="text-gray-500">Forecast</div>
                    <div className="text-white font-mono">{event.forecast}</div>
                  </div>
                )}
                {event.previous && (
                  <div>
                    <div className="text-gray-500">Previous</div>
                    <div className="text-gray-400 font-mono">{event.previous}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="premium-card p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Recent Events (Actual vs Forecast)</h3>
        <div className="space-y-2">
          {recentEvents.map((event, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800/50">
              <div>
                <div className="text-white text-sm font-medium">{event.event}</div>
                <div className="text-gray-400 text-xs">{event.date}</div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <div className="text-gray-500">Actual</div>
                  <div className="text-emerald-400 font-mono font-semibold">{event.actual}</div>
                </div>
                <div>
                  <div className="text-gray-500">Forecast</div>
                  <div className="text-gray-400 font-mono">{event.forecast}</div>
                </div>
                <div>
                  <div className="text-gray-500">Previous</div>
                  <div className="text-gray-400 font-mono">{event.previous}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Notice */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-blue-400 font-semibold text-sm">Data Source & Validation Notice</h3>
            <p className="text-gray-300 text-xs mt-1">
              <strong>DXY & US 10Y:</strong> Real-time data from Yahoo Finance.
            </p>
            <p className="text-gray-300 text-xs mt-1">
              <strong>Macro Events:</strong> Static demo data. For production use, integrate with economic calendar APIs (e.g., Investing.com, Trading Economics, FRED).
            </p>
            <p className="text-gray-300 text-xs mt-1">
              <strong>Event Study:</strong> Historical impact analysis requires validated economic data releases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
