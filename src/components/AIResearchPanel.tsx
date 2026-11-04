/**
 * MAMIE AI Research & Interpretation Engine
 * PHASE 08: AI Interpretation Engine
 */

import { useState } from 'react';
import { useAsset } from '../context/AssetContext';
import { Brain, FileText, AlertTriangle, CheckCircle, Clock, Sparkles } from 'lucide-react';

export default function AIResearchPanel() {
  const {  currentAsset } = useAsset();
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleGenerateReport = () => {
    setGenerating(true);
    
    // Simulate AI report generation
    setTimeout(() => {
      setReport({
        asset: currentAsset.shortName,
        timestamp: new Date().toISOString(),
        executiveSummary: `${currentAsset.shortName} menunjukkan pola pergerakan yang menarik dalam 30 hari terakhir. Analisis teknikal mengindikasikan potensi kelanjutan trend dengan dukungan volume yang memadai.`,
        
        marketStructure: {
          trend: 'Bullish',
          support: 2320.50,
          resistance: 2380.00,
          volatility: 'Normal',
        },
        
        keyFindings: [
          {
            finding: 'Pola akumulasi terdeteksi di area support',
            confidence: 'HIGH',
            evidence: ['Volume increase', 'Price action', 'Order flow'],
          },
          {
            finding: 'Korelasi positif dengan USD/IDR melemah',
            confidence: 'MEDIUM',
            evidence: ['Correlation analysis', 'Macro factors'],
          },
          {
            finding: 'Volatilitas berada di bawah rata-rata historis',
            confidence: 'HIGH',
            evidence: ['Volatility analysis', 'Historical comparison'],
          },
        ],
        
        probabilityScenarios: [
          { scenario: 'Bullish Continuation', probability: 45, target: 2400 },
          { scenario: 'Range Bound', probability: 35, target: 2350 },
          { scenario: 'Bearish Reversal', probability: 20, target: 2280 },
        ],
        
        riskAssessment: {
          overallRisk: 'MEDIUM',
          keyRisks: [
            'Geopolitical uncertainty',
            'Central bank policy changes',
            'Liquidity constraints',
          ],
        },
        
        dataLimitations: [
          'Data order book tidak tersedia untuk analisis microstructure mendalam',
          'Data fundamental terbatas untuk analisis valuation',
          'Data historis hanya 3 bulan untuk backtesting',
        ],
        
        evidenceLevel: 'STATISTICALLY_SUPPORTED',
        outputGate: 'APPROVED_WITH_LIMITATIONS',
      });
      
      setGenerating(false);
    }, 2000);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'HIGH': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'MEDIUM': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'LOW': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-gold flex items-center gap-2">
            <Brain className="w-6 h-6" />
            AI Research & Interpretation
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Evidence-based market intelligence powered by quantitative analysis
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="btn-premium flex items-center gap-2"
        >
          <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {!report ? (
        <div className="premium-card p-12 text-center">
          <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">AI Research Report</h3>
          <p className="text-gray-400 text-sm mb-4">
            Click "Generate Report" to create an evidence-based analysis for {currentAsset.shortName}
          </p>
          <p className="text-gray-500 text-xs">
            Reports are generated using quantitative models, technical analysis, and market data.
            All findings include confidence levels and supporting evidence.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Executive Summary */}
          <div className="premium-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-amber-400" />
              <h3 className="text-white font-semibold">Executive Summary</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {report.executiveSummary}
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs">
              <span className="text-gray-400">Asset: <span className="text-white">{report.asset}</span></span>
              <span className="text-gray-400">Generated: <span className="text-white">{new Date(report.timestamp).toLocaleString()}</span></span>
            </div>
          </div>

          {/* Market Structure */}
          <div className="premium-card p-4">
            <h3 className="text-white font-semibold mb-3">Market Structure</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">Trend</div>
                <div className={`text-lg font-bold ${
                  report.marketStructure.trend === 'Bullish' ? 'text-emerald-400' :
                  report.marketStructure.trend === 'Bearish' ? 'text-red-400' :
                  'text-amber-400'
                }`}>
                  {report.marketStructure.trend}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Support</div>
                <div className="text-lg font-bold text-white font-mono">
                  ${report.marketStructure.support}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Resistance</div>
                <div className="text-lg font-bold text-white font-mono">
                  ${report.marketStructure.resistance}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Volatility</div>
                <div className="text-lg font-bold text-white">
                  {report.marketStructure.volatility}
                </div>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="premium-card p-4">
            <h3 className="text-white font-semibold mb-3">Key Findings</h3>
            <div className="space-y-3">
              {report.keyFindings.map((finding: any, i: any) => (
                <div key={i} className="p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <span className="text-white text-sm font-medium">{finding.finding}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${getConfidenceColor(finding.confidence)}`}>
                      {finding.confidence}
                    </span>
                  </div>
                  <div className="ml-6">
                    <div className="text-gray-400 text-xs mb-1">Evidence:</div>
                    <div className="flex flex-wrap gap-1">
                      {finding.evidence.map((ev: any, j: any) => (
                        <span key={j} className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-300">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Probability Scenarios */}
          <div className="premium-card p-4">
            <h3 className="text-white font-semibold mb-3">Probability Scenarios</h3>
            <div className="space-y-3">
              {report.probabilityScenarios.map((scenario: any, i: any) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{scenario.scenario}</div>
                    <div className="text-xs text-gray-500">Target: ${scenario.target}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-400">{scenario.probability}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="premium-card p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Risk Assessment
            </h3>
            <div className="mb-3">
              <div className="text-gray-400 text-xs mb-1">Overall Risk Level</div>
              <div className={`text-xl font-bold ${
                report.riskAssessment.overallRisk === 'LOW' ? 'text-emerald-400' :
                report.riskAssessment.overallRisk === 'MEDIUM' ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {report.riskAssessment.overallRisk}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-2">Key Risks:</div>
              <ul className="text-sm text-gray-300 space-y-1">
                {report.riskAssessment.keyRisks.map((risk: any, i: any) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Data Limitations */}
          <div className="premium-card p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Data Limitations
            </h3>
            <ul className="text-sm text-gray-300 space-y-2">
              {report.dataLimitations.map((limitation: any, i: any) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400">⚠</span>
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance */}
          <div className="premium-card p-4 bg-gradient-to-br from-amber-500/5 to-purple-500/5 border-amber-500/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Evidence & Governance</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded border ${getConfidenceColor('HIGH')}`}>
                  {report.evidenceLevel}
                </span>
                <span className={`text-xs px-2 py-1 rounded border ${getConfidenceColor('MEDIUM')}`}>
                  {report.outputGate}
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-xs">
              This report is generated using evidence-based methodology. All findings are supported by 
              quantitative analysis and market data. Confidence levels indicate the statistical strength 
              of each finding. Limitations are clearly disclosed to ensure transparent decision-making.
            </p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-300 text-xs">
          <strong>PHASE 08 Implementation:</strong> This AI Research panel demonstrates evidence-based report generation. 
          In production, this would integrate with LLM providers (OpenAI, Anthropic) for natural language generation, 
          with strict evidence validation and hallucination controls. All outputs include confidence levels and 
          supporting evidence references.
        </p>
      </div>
    </div>
  );
}
