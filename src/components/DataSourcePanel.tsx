/**
 * MAMIE Data Source Management Panel
 * PHASE 02: Data Source & Data Integrity
 */

import { useState } from 'react';
import { useDataSources, useIngestionJobs, useQualityReports, useInitializeDataSourceRegistry } from '../domain/dataSource/hooks';
import * as service from '../domain/dataSource/service';
import { Database, RefreshCw, Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function DataSourcePanel() {
  const { data: dataSources, loading, error, refetch } = useDataSources();
  const { initialized } = useInitializeDataSourceRegistry();
  const [selectedSourceId, setSelectedSourceId] = useState<string | undefined>(undefined);
  const [runningQualityCheck, setRunningQualityCheck] = useState(false);

  const selectedSource = dataSources.find((s: any) => s.source_id === selectedSourceId);
  const { data: ingestionJobs } = useIngestionJobs(selectedSourceId);
  const { data: qualityReports } = useQualityReports(selectedSourceId);

  const handleRunQualityCheck = () => {
    if (!selectedSourceId) return;
    
    setRunningQualityCheck(true);
    try {
      service.runDataQualityCheck(selectedSourceId);
      refetch();
    } catch (error) {
      console.error('Quality check failed:', error);
    } finally {
      setRunningQualityCheck(false);
    }
  };

  const getLicenseBadge = (status: string) => {
    const colors: Record<string, string> = {
      'PUBLIC_DOMAIN': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'FREE_COMMERCIAL': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'FREE_NON_COMMERCIAL': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'ATTRIBUTION_REQUIRED': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'RESTRICTED': 'bg-red-500/20 text-red-400 border-red-500/30',
      'NOT_VERIFIED': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[status] || colors['NOT_VERIFIED'];
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'ACTIVE': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'DEGRADED': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'INACTIVE': 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || colors['INACTIVE'];
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-gold flex items-center gap-2">
            <Database className="w-6 h-6" />
            Data Source Registry
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage data sources, monitor quality, and track data lineage
          </p>
        </div>
        <button
          onClick={refetch}
          className="btn-premium flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Data Sources List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="premium-card overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">Registered Data Sources</h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading data sources...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-400">Error: {error}</div>
            ) : dataSources.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No data sources registered. Initialize the registry to add default sources.
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {dataSources.map((source: any) => (
                  <div
                    key={source.source_id}
                    onClick={() => setSelectedSourceId(source.source_id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedSourceId === source.source_id
                        ? 'bg-amber-500/10 border-l-2 border-amber-500'
                        : 'hover:bg-gray-800/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white font-semibold">{source.source_name}</h4>
                        <p className="text-gray-400 text-xs mt-1">{source.source_type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded border ${getStatusBadge(source.status)}`}>
                          {source.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                      <span>{source.instruments_covered.toLocaleString()} instruments</span>
                      <span>•</span>
                      <span>{source.geographic_coverage.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-400 text-xs">Quality Score</span>
                          <span className={`text-xs font-mono font-semibold ${getQualityScoreColor(source.data_quality_score)}`}>
                            {source.data_quality_score}/100
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              source.data_quality_score >= 80 ? 'bg-emerald-500' :
                              source.data_quality_score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${source.data_quality_score}%` }}
                          />
                        </div>
                      </div>
                      
                      <span className={`text-xs px-2 py-1 rounded border ${getLicenseBadge(source.license_status)}`}>
                        {source.license_status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Source Details */}
        <div>
          {selectedSource ? (
            <div className="premium-card p-4 space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">{selectedSource.source_name}</h3>
                <p className="text-gray-400 text-xs">{selectedSource.source_url}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-gray-400 text-xs mb-1">Access Method</div>
                  <div className="text-white text-sm">{selectedSource.access_method.replace('_', ' ')}</div>
                </div>

                <div>
                  <div className="text-gray-400 text-xs mb-1">Update Frequency</div>
                  <div className="text-white text-sm">{selectedSource.update_frequency.replace('_', ' ')}</div>
                </div>

                <div>
                  <div className="text-gray-400 text-xs mb-1">Last Verified</div>
                  <div className="text-white text-sm">
                    {new Date(selectedSource.last_verified).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <div className="text-gray-400 text-xs mb-1">Asset Classes</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedSource.asset_classes.map((ac: any) => (
                      <span key={ac} className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-300">
                        {ac}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedSource.known_limitations.length > 0 && (
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Known Limitations</div>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {selectedSource.known_limitations.map((limitation: any, i: any) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-amber-400">•</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={handleRunQualityCheck}
                  disabled={runningQualityCheck}
                  className="w-full btn-premium flex items-center justify-center gap-2"
                >
                  <Activity className={`w-4 h-4 ${runningQualityCheck ? 'animate-spin' : ''}`} />
                  {runningQualityCheck ? 'Running Check...' : 'Run Quality Check'}
                </button>
              </div>
            </div>
          ) : (
            <div className="premium-card p-8 text-center text-gray-500">
              Select a data source to view details
            </div>
          )}
        </div>
      </div>

      {/* Quality Reports */}
      {selectedSource && qualityReports.length > 0 && (
        <div className="premium-card p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            Latest Quality Report
          </h3>
          
          {qualityReports.slice(0, 1).map((report: any) => (
            <div key={report.report_id} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-gray-400 text-xs mb-1">Overall</div>
                  <div className={`text-2xl font-bold ${getQualityScoreColor(report.overall_score)}`}>
                    {report.overall_score.toFixed(0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs mb-1">Completeness</div>
                  <div className={`text-2xl font-bold ${getQualityScoreColor(report.completeness_score)}`}>
                    {report.completeness_score.toFixed(0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs mb-1">Accuracy</div>
                  <div className={`text-2xl font-bold ${getQualityScoreColor(report.accuracy_score)}`}>
                    {report.accuracy_score.toFixed(0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs mb-1">Consistency</div>
                  <div className={`text-2xl font-bold ${getQualityScoreColor(report.consistency_score)}`}>
                    {report.consistency_score.toFixed(0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs mb-1">Timeliness</div>
                  <div className={`text-2xl font-bold ${getQualityScoreColor(report.timeliness_score)}`}>
                    {report.timeliness_score.toFixed(0)}
                  </div>
                </div>
              </div>

              {report.issues.length > 0 && (
                <div>
                  <div className="text-gray-400 text-xs mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    Issues
                  </div>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {report.issues.map((issue: any, i: any) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-red-400">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.recommendations.length > 0 && (
                <div>
                  <div className="text-gray-400 text-xs mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    Recommendations
                  </div>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {report.recommendations.map((rec: any, i: any) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-amber-400">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-300 text-xs">
          <strong>PHASE 02 Implementation:</strong> This data source registry tracks all data providers with their licenses, 
          quality metrics, and limitations. Quality checks are run on-demand. In production, this would integrate with 
          automated data quality monitoring and alerting systems.
        </p>
      </div>
    </div>
  );
}
