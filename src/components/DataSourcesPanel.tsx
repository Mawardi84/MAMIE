import { Database, Cloud, Layers, TrendingUp, BarChart3, FileText, Globe, Download, CheckCircle2, AlertCircle, Clock, ExternalLink, Shield, Zap, Target, ArrowRight } from 'lucide-react';

export default function DataSourcesPanel() {
  const tierStrategy = [
    {
      tier: 'Tier 1',
      label: 'Free & Public Data',
      policy: 'Prioritas utama',
      description: 'Data gratis dan publik yang dapat diakses langsung tanpa biaya. Digunakan sebagai fondasi penelitian.',
      color: 'emerald',
      sources: ['CME Group (delayed)', 'Historical Futures Data', 'FinzData (free tier)', 'CFTC COT Reports', 'LBMA'],
      icon: Globe,
    },
    {
      tier: 'Tier 2',
      label: 'Free Trial / Sample',
      policy: 'Uji kualitas data',
      description: 'Data dari penyedia berbayar yang menawarkan free trial, sample data, atau kredit gratis untuk validasi.',
      color: 'amber',
      sources: ['Databento trial', 'Polygon.io sample', 'Kaiko free tier', 'Tardis.dev sample'],
      icon: Cloud,
    },
    {
      tier: 'Tier 3',
      label: 'Paid Data',
      policy: 'Hanya jika kebutuhan belum terpenuhi',
      description: 'Data berbayar hanya dibeli setelah Tier 1 dan Tier 2 tidak mencukupi untuk requirement penelitian.',
      color: 'purple',
      sources: ['CME MDP 3.0 full', 'Bloomberg Terminal', 'Refinitiv Eikon', 'dxFeed'],
      icon: Shield,
    },
  ];

  const dataSources = [
    {
      name: 'CME Group',
      category: 'Exchange Data',
      tier: 1,
      access: 'Gratis terbatas',
      icon: Layers,
      color: 'cyan',
      url: 'https://www.cmegroup.com/markets/metals.html',
      coverage: {
        available: ['Delayed market data', 'Settlement prices', 'Volume data', 'Open Interest', 'Analytics tools'],
        limited: ['Full-depth historical data', 'Tick-by-tick data', 'Order book reconstruction'],
      },
      format: ['CSV', 'API (limited)'],
      frequency: 'Real-time (delayed 10min)',
      history: 'Limited free history',
      useCases: ['Price formation research', 'Volume analysis', 'OI change tracking', 'Settlement benchmarking'],
      notes: 'Bukan pengganti MBO historis. Cocok untuk validasi harga dan volume agregat.',
      quality: 75,
      completeness: 60,
    },
    {
      name: 'Historical Futures Data',
      category: 'Historical Data Provider',
      tier: 1,
      icon: Database,
      color: 'blue',
      url: 'https://historical-futures-data.com/',
      coverage: {
        available: ['GC Gold Futures', '10-second bars (current month)', 'Daily historical data', 'Parquet format'],
        limited: ['Tick data (paid tier)', 'Full historical depth', 'Multi-contract continuous series'],
      },
      format: ['Parquet', 'CSV'],
      frequency: '10-second bars / Daily',
      history: 'Daily: extensive; 10s: current month only',
      useCases: ['Volatility research', 'Session analysis', 'Intraday pattern study', 'Bar-based backtesting'],
      notes: 'Cocok untuk penelitian awal harga, volume, volatilitas, dan sesi pasar. Tick data tidak termasuk paket gratis.',
      quality: 85,
      completeness: 70,
    },
    {
      name: 'FinzData',
      category: 'Futures API Provider',
      tier: 1,
      icon: TrendingUp,
      color: 'emerald',
      url: 'https://finzdata.com/',
      coverage: {
        available: ['Daily OHLCV', 'Open Interest data', '12-month free history', 'Futures coverage'],
        limited: ['Tick-by-tick data', 'Order book depth', 'Extended history (>12 months)'],
      },
      format: ['JSON API', 'CSV download'],
      frequency: 'Daily',
      history: '12 months (free tier)',
      useCases: ['Daily price research', 'OI analysis', 'Trend identification', 'Macro correlation study'],
      notes: 'Tidak menyediakan tick-by-tick dan order book depth. Ideal untuk analisis harian dan positioning.',
      quality: 80,
      completeness: 65,
    },
    {
      name: 'CFTC',
      category: 'Regulatory Data',
      tier: 1,
      icon: FileText,
      color: 'amber',
      url: 'https://www.cftc.gov/MarketReports/CommitteesofTraders/index.htm',
      coverage: {
        available: ['COT Reports (weekly)', 'Disaggregated COT', 'Managed Money positions', 'Producer/Merchant', 'Swap Dealers', 'Full historical archive'],
        limited: ['Daily granularity', 'Real-time positioning', 'Individual trader identification'],
      },
      format: ['CSV', 'Excel', 'HTML'],
      frequency: 'Weekly (Friday release)',
      history: 'Full archive available (20+ years)',
      useCases: ['Positioning research', 'Speculative net positioning', 'Regime detection', 'Sentiment analysis', 'Contrarian signals'],
      notes: 'Berguna untuk penelitian positioning mingguan. Data paling lengkap untuk COT analysis.',
      quality: 95,
      completeness: 90,
    },
    {
      name: 'LBMA',
      category: 'Wholesale Market',
      tier: 1,
      icon: BarChart3,
      color: 'purple',
      url: 'https://www.lbma.org.uk/prices-and-data',
      coverage: {
        available: ['Gold price benchmark (LBMA Gold Price)', 'Clearing statistics', 'Market statistics', 'Wholesale market info'],
        limited: ['Full OTC order book', 'Real-time quotes', 'Individual transaction data'],
      },
      format: ['CSV', 'PDF reports'],
      frequency: 'Daily benchmark / Monthly stats',
      history: 'Extensive historical archive',
      useCases: ['Benchmark comparison', 'OTC market analysis', 'Clearing volume study', 'Physical market research'],
      notes: 'Tidak menyediakan full OTC order book. Sumber utama untuk benchmark harga emas fisik.',
      quality: 90,
      completeness: 55,
    },
  ];

  const integrationMap = [
    { module: 'Dashboard', sources: ['CME', 'FinzData', 'LBMA'], priority: 'High' },
    { module: 'Liquidity Analysis', sources: ['Historical Futures (10s)'], priority: 'Medium' },
    { module: 'Order Flow', sources: ['Historical Futures (10s)', 'CME (delayed)'], priority: 'Medium' },
    { module: 'COMEX ↔ Spot', sources: ['CME', 'FinzData', 'LBMA'], priority: 'High' },
    { module: 'Probability Models', sources: ['Historical Futures', 'FinzData', 'CME'], priority: 'High' },
    { module: 'Backtesting', sources: ['Historical Futures', 'FinzData'], priority: 'High' },
    { module: 'Positioning Research', sources: ['CFTC'], priority: 'Critical' },
    { module: 'AI Engine', sources: ['All Tier 1 sources'], priority: 'Phase 2' },
  ];

  const acquisitionStatus = [
    { source: 'CME Group', status: 'ready', action: 'Register for delayed data access', progress: 90 },
    { source: 'Historical Futures Data', status: 'ready', action: 'Download free parquet files', progress: 85 },
    { source: 'FinzData', status: 'ready', action: 'Sign up for free tier API key', progress: 80 },
    { source: 'CFTC COT Reports', status: 'ready', action: 'Download historical CSV archive', progress: 95 },
    { source: 'LBMA', status: 'ready', action: 'Access public benchmark data', progress: 88 },
  ];

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'emerald';
      case 2: return 'amber';
      case 3: return 'purple';
      default: return 'gray';
    }
  };

  const colorClasses: Record<string, { bg: string; border: string; text: string; bgSoft: string }> = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', bgSoft: 'bg-emerald-500/5' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', bgSoft: 'bg-amber-500/5' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', bgSoft: 'bg-purple-500/5' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', bgSoft: 'bg-cyan-500/5' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', bgSoft: 'bg-blue-500/5' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Data Acquisition Strategy</h1>
          <p className="text-gray-400 text-sm mt-1">Free-first approach for XAU/USD quantitative research</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs">
            <Download className="w-3 h-3 inline mr-1" />
            Tier 1 Active
          </span>
        </div>
      </div>

      {/* Strategy Overview */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Free-First Data Strategy</h2>
        </div>
        <p className="text-gray-300 text-sm mb-6">
          Kebutuhan data dibagi menjadi tiga tingkatan berdasarkan kebijakan akses dan biaya. 
          Prioritas utama adalah memanfaatkan data gratis dan publik sebelum mempertimbangkan sumber berbayar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tierStrategy.map((tier, i) => {
            const colors = colorClasses[tier.color];
            return (
              <div key={i} className={`p-4 rounded-lg border bg-gray-900/50 ${colors.border}`}>
                <div className="flex items-center gap-2 mb-3">
                  <tier.icon className={`w-5 h-5 ${colors.text}`} />
                  <div>
                    <div className={`${colors.text} text-xs font-bold uppercase tracking-wide`}>{tier.tier}</div>
                    <div className="text-white text-sm font-semibold">{tier.label}</div>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-3">{tier.description}</p>
                <div className="pt-3 border-t border-gray-700/30">
                  <div className="text-gray-500 text-xs mb-2 font-medium">Policy:</div>
                  <div className={`${colors.text} text-xs font-semibold`}>{tier.policy}</div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700/30">
                  <div className="text-gray-500 text-xs mb-2 font-medium">Sources:</div>
                  <div className="flex flex-wrap gap-1">
                    {tier.sources.map((source, j) => (
                      <span key={j} className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-300">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Sources Detail */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          Tier 1: Free Data Sources
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {dataSources.map((source, i) => {
            const colors = colorClasses[source.color];
            return (
              <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                      <source.icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{source.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-gray-400 text-xs">{source.category}</span>
                        <span className="text-xs px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Tier 1</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Visit
                  </a>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-gray-500 text-xs mb-1 font-medium">Format</div>
                  <div className="flex flex-wrap gap-1">
                    {source.format.map((f, j) => (
                      <span key={j} className="text-xs px-2 py-0.5 bg-gray-700/50 rounded text-gray-300">{f}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1 font-medium">Frequency</div>
                  <div className="text-gray-300 text-xs">{source.frequency}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1 font-medium">History</div>
                  <div className="text-gray-300 text-xs">{source.history}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-medium">Available (Free)</span>
                  </div>
                  <ul className="space-y-1">
                    {source.coverage.available.map((item, j) => (
                      <li key={j} className="text-gray-300 text-xs flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-400 text-xs font-medium">Limited / Not Available</span>
                  </div>
                  <ul className="space-y-1">
                    {source.coverage.limited.map((item, j) => (
                      <li key={j} className="text-gray-400 text-xs flex items-start gap-1.5">
                        <span className="text-amber-400 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-gray-500 text-xs mb-2 font-medium">Use Cases for Research</div>
                <div className="flex flex-wrap gap-1.5">
                  {source.useCases.map((uc, j) => (
                    <span key={j} className="text-xs px-2 py-1 bg-gray-700/30 border border-gray-700/50 rounded text-gray-300">
                      {uc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-700/30">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-400 text-xs">{source.notes}</p>
                </div>
              </div>

              {/* Quality Metrics */}
              <div className="mt-4 pt-3 border-t border-gray-700/30 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400 text-xs">Data Quality</span>
                    <span className="text-white text-xs font-mono">{source.quality}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${source.quality}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400 text-xs">Research Completeness</span>
                    <span className="text-white text-xs font-mono">{source.completeness}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${source.completeness}%` }} />
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Integration Map */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Module Integration Map
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Pemetaan sumber data ke modul riset yang ada untuk memastikan coverage yang optimal.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 p-3 text-xs font-medium">Research Module</th>
                <th className="text-left text-gray-400 p-3 text-xs font-medium">Required Data Sources</th>
                <th className="text-left text-gray-400 p-3 text-xs font-medium">Priority</th>
                <th className="text-left text-gray-400 p-3 text-xs font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {integrationMap.map((item, i) => (
                <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                  <td className="p-3 text-white text-xs font-medium">{item.module}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {item.sources.map((src, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-300">
                          {src}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      item.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                      item.priority === 'High' ? 'bg-amber-500/20 text-amber-400' :
                      item.priority === 'Medium' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-700/50 text-gray-400'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Tier 1 Ready
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acquisition Status */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Data Acquisition Status
        </h2>
        <div className="space-y-3">
          {acquisitionStatus.map((item, i) => (
            <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-white text-sm font-medium">{item.source}</span>
                  <span className="text-xs px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Ready</span>
                </div>
                <span className="text-gray-400 text-xs font-mono">{item.progress}%</span>
              </div>
              <p className="text-gray-400 text-xs mb-2">{item.action}</p>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-amber-500/5 to-purple-500/5 border border-amber-500/20 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-amber-400" />
          Next Steps & Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-400 text-xs font-bold">1</span>
              </div>
              <div>
                <h4 className="text-white text-sm font-medium">Setup Data Pipeline</h4>
                <p className="text-gray-400 text-xs mt-0.5">Implement automated ingestion dari 5 sumber Tier 1 dengan scheduler harian/mingguan.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-400 text-xs font-bold">2</span>
              </div>
              <div>
                <h4 className="text-white text-sm font-medium">Data Quality Validation</h4>
                <p className="text-gray-400 text-xs mt-0.5">Validasi completeness, accuracy, dan consistency sebelum digunakan untuk research.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-400 text-xs font-bold">3</span>
              </div>
              <div>
                <h4 className="text-white text-sm font-medium">Gap Analysis</h4>
                <p className="text-gray-400 text-xs mt-0.5">Identifikasi kebutuhan data yang belum terpenuhi oleh Tier 1 untuk evaluasi Tier 2/3.</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-400 text-xs font-bold">4</span>
              </div>
              <div>
                <h4 className="text-white text-sm font-medium">Prioritize CFTC Data</h4>
                <p className="text-gray-400 text-xs mt-0.5">COT reports adalah sumber positioning paling lengkap. Prioritaskan untuk positioning research.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-400 text-xs font-bold">5</span>
              </div>
              <div>
                <h4 className="text-white text-sm font-medium">Combine Multiple Sources</h4>
                <p className="text-gray-400 text-xs mt-0.5">Integrasikan CME + FinzData + LBMA untuk cross-validation dan coverage yang lebih lengkap.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-400 text-xs font-bold">6</span>
              </div>
              <div>
                <h4 className="text-white text-sm font-medium">Document Limitations</h4>
                <p className="text-gray-400 text-xs mt-0.5">Catat batasan setiap sumber data untuk transparansi dalam hasil penelitian.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-blue-400 font-semibold text-sm">Research Integrity Note</h3>
            <p className="text-gray-300 text-xs mt-1">
              Semua data yang digunakan dalam penelitian ini bersumber dari penyedia publik yang sah dan diakses sesuai dengan terms of service masing-masing. 
              Tidak ada klaim kepemilikan data. Hasil analisis bersifat untuk tujuan penelitian dan tidak merupakan rekomendasi investasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
