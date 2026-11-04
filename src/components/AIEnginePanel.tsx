import { Brain, Cpu, Network, Database, Zap, Shield, GitBranch, Layers, ArrowRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function AIEnginePanel() {
  const pipelineStages = [
    {
      stage: 'Data Ingestion',
      status: 'active',
      icon: Database,
      color: 'text-cyan-400',
      components: ['XAU/USD tick data', 'COMEX futures (CME)', 'Order book L2/L3', 'COT positioning', 'Macro indicators'],
      latency: '<50ms',
    },
    {
      stage: 'Feature Engineering',
      status: 'active',
      icon: Cpu,
      color: 'text-blue-400',
      components: ['Order flow imbalance', 'Liquidity depth metrics', 'Volatility surface', 'Basis z-score', 'Regime features'],
      latency: '<100ms',
    },
    {
      stage: 'Signal Generation',
      status: 'active',
      icon: Zap,
      color: 'text-amber-400',
      components: ['GARCH volatility model', 'HMM regime detection', 'Bayesian probability', 'Flow toxicity (VPIN)', 'Microstructure alpha'],
      latency: '<200ms',
    },
    {
      stage: 'AI Intelligence Layer',
      status: 'phase2',
      icon: Brain,
      color: 'text-purple-400',
      components: ['Ensemble ML models', 'Attention-based patterns', 'Causal inference', 'Anomaly detection', 'Adaptive parameters'],
      latency: '<500ms',
    },
    {
      stage: 'Risk & Execution',
      status: 'phase2',
      icon: Shield,
      color: 'text-emerald-400',
      components: ['Kelly criterion sizing', 'Drawdown control', 'Correlation monitoring', 'Slippage estimation', 'Smart order routing'],
      latency: '<100ms',
    },
  ];

  const researchPhases = [
    {
      phase: 'Phase 1: Foundation',
      status: 'complete',
      progress: 100,
      description: 'Establish observable data pipeline and statistical methodology',
      deliverables: [
        'Observable data taxonomy (price, volume, order book, OI)',
        'Statistical framework for hypothesis testing',
        'Liquidity & order flow measurement protocols',
        'COMEX-Spot integration methodology',
      ],
    },
    {
      phase: 'Phase 2: Model Development',
      status: 'active',
      progress: 65,
      description: 'Develop and validate quantitative models',
      deliverables: [
        'Price formation model (Kyle/ Glosten-Milgrom)',
        'Probability distribution fitting (GARCH + jumps)',
        'Regime detection (HMM with 4 states)',
        'Backtesting framework with walk-forward validation',
      ],
    },
    {
      phase: 'Phase 3: AI Integration',
      status: 'planned',
      progress: 15,
      description: 'Integrate machine learning after methodology approval',
      deliverables: [
        'Ensemble model architecture design',
        'Feature importance analysis',
        'Out-of-sample validation protocol',
        'Explainability framework (SHAP/LIME)',
      ],
    },
    {
      phase: 'Phase 4: Production',
      status: 'planned',
      progress: 0,
      description: 'Deploy validated system with risk controls',
      deliverables: [
        'Real-time signal generation',
        'Automated risk management',
        'Performance monitoring dashboard',
        'Continuous model retraining pipeline',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Market Intelligence Engine</h1>
          <p className="text-gray-400 text-sm mt-1">Systematic research pipeline → validated models → AI augmentation</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-purple-400 text-xs">Phase 2 Active</span>
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-amber-400 font-semibold text-sm">Research-First Philosophy</h3>
            <p className="text-gray-300 text-xs mt-1">
              AI integration follows strict methodology approval. We do NOT automate trading before statistical validation. 
              Every model must pass out-of-sample testing, walk-forward analysis, and regime robustness checks. 
              This system identifies patterns — it does not claim to predict the future with certainty.
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Architecture */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Processing Pipeline Architecture</h3>
        <div className="flex flex-col lg:flex-row gap-2">
          {pipelineStages.map((stage, i) => (
            <div key={i} className="flex-1">
              <div className={`p-3 rounded-lg border ${
                stage.status === 'active' ? 'bg-gray-900/70 border-gray-600/50' :
                stage.status === 'phase2' ? 'bg-gray-900/40 border-gray-700/30' :
                'bg-gray-900/20 border-gray-700/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <stage.icon className={`w-4 h-4 ${stage.color}`} />
                  <span className="text-white text-xs font-semibold">{stage.stage}</span>
                </div>
                <div className="space-y-1">
                  {stage.components.map((comp, j) => (
                    <div key={j} className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        stage.status === 'active' ? 'bg-emerald-400' : 'bg-gray-600'
                      }`}></div>
                      <span className="text-gray-400 text-xs">{comp}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-700/30">
                  <span className="text-gray-500 text-xs">Latency: {stage.latency}</span>
                </div>
              </div>
              {i < pipelineStages.length - 1 && (
                <div className="hidden lg:flex items-center justify-center py-1">
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Research Phases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {researchPhases.map((phase, i) => (
          <div key={i} className={`bg-gray-800/50 border rounded-xl p-4 ${
            phase.status === 'complete' ? 'border-emerald-500/30' :
            phase.status === 'active' ? 'border-amber-500/30' :
            'border-gray-700/30'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {phase.status === 'complete' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {phase.status === 'active' && <Clock className="w-4 h-4 text-amber-400 animate-pulse" />}
                {phase.status === 'planned' && <Clock className="w-4 h-4 text-gray-500" />}
                <h4 className="text-white font-semibold text-sm">{phase.phase}</h4>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${
                phase.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400' :
                phase.status === 'active' ? 'bg-amber-500/20 text-amber-400' :
                'bg-gray-700/50 text-gray-400'
              }`}>{phase.progress}%</span>
            </div>
            <p className="text-gray-400 text-xs mb-3">{phase.description}</p>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full ${
                  phase.status === 'complete' ? 'bg-emerald-500' :
                  phase.status === 'active' ? 'bg-amber-500' :
                  'bg-gray-600'
                }`}
                style={{ width: `${phase.progress}%` }}
              />
            </div>
            <div className="space-y-1">
              {phase.deliverables.map((d, j) => (
                <div key={j} className="flex items-start gap-2">
                  <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                    phase.status === 'complete' ? 'bg-emerald-400' :
                    phase.status === 'active' ? 'bg-amber-400' :
                    'bg-gray-600'
                  }`}></div>
                  <span className="text-gray-300 text-xs">{d}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Non-Objectives / Boundaries */}
      <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3">System Boundaries & Limitations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Cannot Know All Positions', desc: 'We estimate positioning from observable data (COT, volume, OI). We cannot see all institutional positions.', icon: '🔍' },
            { title: 'Cannot See Hidden Orders', desc: 'Iceberg orders and dark pool activity are inferred statistically, not directly observed.', icon: '👁️' },
            { title: 'Not Every Sweep = Manipulation', desc: 'Liquidity sweeps can be natural market mechanics, not always intentional manipulation.', icon: '⚖️' },
            { title: 'Volume ≠ Directional Intent', desc: 'Large volume can be hedging, rebalancing, or market-making — not always directional bets.', icon: '📊' },
            { title: 'No Signals Without Testing', desc: 'Every hypothesis must pass statistical validation before being used for decision-making.', icon: '🧪' },
            { title: 'No Auto-Trading Before Validation', desc: 'Automated execution only after complete out-of-sample validation and risk framework approval.', icon: '🛡️' },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{item.icon}</span>
                <h4 className="text-gray-200 text-xs font-semibold">{item.title}</h4>
              </div>
              <p className="text-gray-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Stack */}
      <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3">Technical Architecture</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { layer: 'Data Layer', tech: ['TimescaleDB', 'Redis Streams', 'WebSocket feeds', 'CME MDP 3.0'] },
            { layer: 'Analytics', tech: ['Python/NumPy', 'pandas', 'statsmodels', 'arch (GARCH)'] },
            { layer: 'ML/AI', tech: ['scikit-learn', 'XGBoost', 'PyTorch', 'hmmlearn'] },
            { layer: 'Infrastructure', tech: ['Docker/K8s', 'Grafana', 'Apache Kafka', 'AWS/GCP'] },
          ].map((layer, i) => (
            <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
              <h4 className="text-amber-400 text-xs font-semibold mb-2">{layer.layer}</h4>
              <div className="space-y-1">
                {layer.tech.map((t, j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-400 text-xs font-mono">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
