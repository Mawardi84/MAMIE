import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity, Database, Brain, TrendingUp } from 'lucide-react';
import { getDataSources, runDataQualityCheck } from '../domain/dataSource/service';
import type { DataSource, DataQualityReport } from '../domain/dataSource/types';

export default function RiskGovernancePanel() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [qualityReport, setQualityReport] = useState<DataQualityReport | null>(null);
  const [activeTab, setActiveTab] = useState<'data' | 'model' | 'risk'>('data');

  useEffect(() => {
    const sources = getDataSources();
    setDataSources(sources);
  }, []);

  const handleRunQualityCheck = (source: DataSource) => {
    setSelectedSource(source);
    const report = runDataQualityCheck(source.source_id);
    setQualityReport(report);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  // Simulated model governance data
  const models = [
    {
      id: 'vol-model-001',
      name: 'Volatility Regime Detection',
      version: '2.1.0',
      status: 'VALIDATED',
      lastValidation: '2026-01-15',
      accuracy: 78.5,
      drift: 2.3,
    },
    {
      id: 'corr-model-002',
      name: 'Cross-Asset Correlation',
      version: '1.5.2',
      status: 'VALIDATED',
      lastValidation: '2026-01-10',
      accuracy: 82.1,
      drift: 1.8,
    },
    {
      id: 'prob-model-003',
      name: 'Probability Estimation',
      version: '3.0.1',
      status: 'APPROVED_WITH_LIMITATIONS',
      lastValidation: '2026-01-05',
      accuracy: 71.2,
      drift: 4.5,
    },
  ];

  // Simulated risk metrics
  const riskMetrics = {
    portfolioVar: -4.2,
    maxDrawdown: -12.5,
    sharpeRatio: 1.45,
    beta: 1.12,
    volatility: 18.3,
    correlation: 0.68,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-[var(--color-accent-primary)]" />
          Risk & Governance
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Data quality, model validation, evidence status, and risk monitoring
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-[var(--color-border-default)]">
        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'data'
              ? 'text-[var(--color-accent-primary)] border-b-2 border-[var(--color-accent-primary)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Database className="w-4 h-4 inline mr-2" />
          Data Governance
        </button>
        <button
          onClick={() => setActiveTab('model')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'model'
              ? 'text-[var(--color-accent-primary)] border-b-2 border-[var(--color-accent-primary)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Brain className="w-4 h-4 inline mr-2" />
          Model Governance
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'risk'
              ? 'text-[var(--color-accent-primary)] border-b-2 border-[var(--color-accent-primary)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Activity className="w-4 h-4 inline mr-2" />
          Risk Monitor
        </button>
      </div>

      {/* Data Governance Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          {/* Data Sources Overview */}
          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Data Sources Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataSources.map((source) => (
                <div
                  key={source.source_id}
                  className="bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-default)] p-4 hover:border-[var(--color-accent-primary)] transition-colors cursor-pointer"
                  onClick={() => handleRunQualityCheck(source)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{source.source_name}</h3>
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{source.source_type}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${
                      source.status === 'ACTIVE' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : source.status === 'DEGRADED'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      {source.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[var(--color-text-tertiary)]">Quality Score</span>
                        <span className={`font-mono font-semibold ${getScoreColor(source.data_quality_score)}`}>
                          {source.data_quality_score}/100
                        </span>
                      </div>
                      <div className="h-1.5 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            source.data_quality_score >= 80 ? 'bg-green-500' :
                            source.data_quality_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${source.data_quality_score}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[var(--color-text-tertiary)]">Reliability</span>
                        <span className={`font-mono font-semibold ${getScoreColor(source.reliability_score)}`}>
                          {source.reliability_score}/100
                        </span>
                      </div>
                      <div className="h-1.5 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            source.reliability_score >= 80 ? 'bg-green-500' :
                            source.reliability_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${source.reliability_score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--color-border-default)]">
                    <div className="text-xs text-[var(--color-text-tertiary)]">
                      Last Verified: {new Date(source.last_verified).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Report */}
          {qualityReport && selectedSource && (
            <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Quality Report: {selectedSource.source_name}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className={`rounded-lg border p-4 ${getScoreBg(qualityReport.overall_score)}`}>
                  <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Overall Score</div>
                  <div className={`text-2xl font-bold font-mono ${getScoreColor(qualityReport.overall_score)}`}>
                    {qualityReport.overall_score.toFixed(0)}
                  </div>
                </div>
                <div className={`rounded-lg border p-4 ${getScoreBg(qualityReport.completeness_score)}`}>
                  <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Completeness</div>
                  <div className={`text-2xl font-bold font-mono ${getScoreColor(qualityReport.completeness_score)}`}>
                    {qualityReport.completeness_score.toFixed(0)}
                  </div>
                </div>
                <div className={`rounded-lg border p-4 ${getScoreBg(qualityReport.accuracy_score)}`}>
                  <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Accuracy</div>
                  <div className={`text-2xl font-bold font-mono ${getScoreColor(qualityReport.accuracy_score)}`}>
                    {qualityReport.accuracy_score.toFixed(0)}
                  </div>
                </div>
                <div className={`rounded-lg border p-4 ${getScoreBg(qualityReport.timeliness_score)}`}>
                  <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Timeliness</div>
                  <div className={`text-2xl font-bold font-mono ${getScoreColor(qualityReport.timeliness_score)}`}>
                    {qualityReport.timeliness_score.toFixed(0)}
                  </div>
                </div>
              </div>

              {qualityReport.issues.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    Issues Detected
                  </h3>
                  <ul className="space-y-1">
                    {qualityReport.issues.map((issue: string, i: number) => (
                      <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {qualityReport.recommendations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Recommendations
                  </h3>
                  <ul className="space-y-1">
                    {qualityReport.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Model Governance Tab */}
      {activeTab === 'model' && (
        <div className="space-y-6">
          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Model Registry</h2>
            <div className="space-y-4">
              {models.map((model) => (
                <div
                  key={model.id}
                  className="bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-default)] p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{model.name}</h3>
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                        Version {model.version} • ID: {model.id}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${
                      model.status === 'VALIDATED'
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : model.status === 'APPROVED_WITH_LIMITATIONS'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      {model.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Accuracy</div>
                      <div className={`text-lg font-bold font-mono ${getScoreColor(model.accuracy)}`}>
                        {model.accuracy}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Drift</div>
                      <div className={`text-lg font-bold font-mono ${
                        model.drift > 3 ? 'text-red-400' : model.drift > 2 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {model.drift}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Last Validation</div>
                      <div className="text-lg font-bold text-white font-mono">
                        {new Date(model.lastValidation).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Risk Monitor Tab */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          {/* Risk Metrics */}
          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Portfolio Risk Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-default)] p-4">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Value at Risk (95%)</div>
                <div className="text-2xl font-bold text-red-400 font-mono">
                  {riskMetrics.portfolioVar}%
                </div>
                <div className="text-xs text-[var(--color-text-tertiary)] mt-1">Daily</div>
              </div>

              <div className="bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-default)] p-4">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Max Drawdown</div>
                <div className="text-2xl font-bold text-red-400 font-mono">
                  {riskMetrics.maxDrawdown}%
                </div>
                <div className="text-xs text-[var(--color-text-tertiary)] mt-1">Historical</div>
              </div>

              <div className="bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-default)] p-4">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Sharpe Ratio</div>
                <div className="text-2xl font-bold text-green-400 font-mono">
                  {riskMetrics.sharpeRatio}
                </div>
                <div className="text-xs text-[var(--color-text-tertiary)] mt-1">Risk-adjusted</div>
              </div>

              <div className="bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-default)] p-4">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Beta</div>
                <div className="text-2xl font-bold text-white font-mono">
                  {riskMetrics.beta}
                </div>
                <div className="text-xs text-[var(--color-text-tertiary)] mt-1">vs Benchmark</div>
              </div>

              <div className="bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-default)] p-4">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Volatility</div>
                <div className="text-2xl font-bold text-yellow-400 font-mono">
                  {riskMetrics.volatility}%
                </div>
                <div className="text-xs text-[var(--color-text-tertiary)] mt-1">Annualized</div>
              </div>

              <div className="bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-default)] p-4">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">Correlation</div>
                <div className="text-2xl font-bold text-white font-mono">
                  {riskMetrics.correlation}
                </div>
                <div className="text-xs text-[var(--color-text-tertiary)] mt-1">vs Market</div>
              </div>
            </div>
          </div>

          {/* Risk Alerts */}
          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Active Risk Alerts</h2>
            <div className="space-y-3">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">Volatility Alert</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Portfolio volatility (18.3%) exceeds threshold (15%). Consider rebalancing.
                    </p>
                    <div className="text-xs text-[var(--color-text-tertiary)] mt-2">
                      Triggered: 2 hours ago
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">Correlation Increase</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Cross-asset correlation increased to 0.68. Diversification benefit reduced.
                    </p>
                    <div className="text-xs text-[var(--color-text-tertiary)] mt-2">
                      Triggered: 1 day ago
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">Liquidity Status: Normal</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Market depth and bid-ask spreads within normal ranges.
                    </p>
                    <div className="text-xs text-[var(--color-text-tertiary)] mt-2">
                      Last checked: 30 minutes ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
