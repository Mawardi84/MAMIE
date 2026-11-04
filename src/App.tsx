import { useState, lazy, Suspense } from 'react';
import { AssetProvider } from './context/AssetContext';
import InstitutionalSidebar from './components/InstitutionalSidebar';
import InstitutionalTopBar from './components/InstitutionalTopBar';
import TickerTape from './components/TickerTape';

// Lazy load heavy components for code splitting
const ExecutiveDashboard = lazy(() => import('./components/ExecutiveDashboard'));
const TradingTerminal = lazy(() => import('./components/TradingTerminal'));
const LiquidityPanel = lazy(() => import('./components/LiquidityPanel'));
const OrderFlowPanel = lazy(() => import('./components/OrderFlowPanel'));
const ComexSpotPanel = lazy(() => import('./components/ComexSpotPanel'));
const ProbabilityPanel = lazy(() => import('./components/ProbabilityPanel'));
const BacktestPanel = lazy(() => import('./components/BacktestPanel'));
const AIEnginePanel = lazy(() => import('./components/AIEnginePanel'));
const DataSourcesPanel = lazy(() => import('./components/DataSourcesPanel'));
const DataSourcePanel = lazy(() => import('./components/DataSourcePanel'));
const InstrumentRegistryPanel = lazy(() => import('./components/InstrumentRegistryPanel'));
const IndonesianEquityPanel = lazy(() => import('./components/IndonesianEquityPanel'));
const MultiAssetIntelligencePanel = lazy(() => import('./components/MultiAssetIntelligencePanel'));
const AIResearchPanel = lazy(() => import('./components/AIResearchPanel'));
const MicrostructurePanel = lazy(() => import('./components/MicrostructurePanel'));
const MacroPanel = lazy(() => import('./components/MacroPanel'));
const PositioningPanel = lazy(() => import('./components/PositioningPanel'));
const QuantResearchPanel = lazy(() => import('./components/QuantResearchPanel'));
const RiskGovernancePanel = lazy(() => import('./components/RiskGovernancePanel'));
const CrossAssetAnalysis = lazy(() => import('./components/CrossAssetAnalysis'));
const AssetUniverse = lazy(() => import('./components/AssetUniverse'));
const GlobalEquitiesPanel = lazy(() => import('./components/GlobalEquitiesPanel'));
const FixedIncomePanel = lazy(() => import('./components/FixedIncomePanel'));
const IndicesDerivativesPanel = lazy(() => import('./components/IndicesDerivativesPanel'));

import { NotificationProvider } from './components/NotificationSystem';

export default function App() {
  const [activePage, setActivePage] = useState('executive-dashboard');

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );

  const renderContent = () => {
    const content = (() => {
      switch (activePage) {
        case 'executive-dashboard':
          return <ExecutiveDashboard />;
        case 'market-terminal':
          return <TradingTerminal />;
        case 'microstructure':
          return <MicrostructurePanel />;
        case 'liquidity':
          return <LiquidityPanel />;
        case 'macro':
          return <MacroPanel />;
        case 'positioning':
          return <PositioningPanel />;
        case 'quant':
          return <QuantResearchPanel />;
        case 'probability':
          return <ProbabilityPanel />;
        case 'backtest':
          return <BacktestPanel />;
        case 'ai':
          return <AIEnginePanel />;
        case 'ai-research':
          return <AIResearchPanel />;
        case 'data-sources':
          return <DataSourcesPanel />;
        case 'data-quality':
          return <DataSourcePanel />;
        case 'registry':
          return <InstrumentRegistryPanel />;
        case 'idx-equities':
          return <IndonesianEquityPanel />;
        case 'multiasset':
          return <MultiAssetIntelligencePanel />;
        case 'comex':
          return <ComexSpotPanel />;
        case 'orderflow':
          return <OrderFlowPanel />;
        case 'risk-monitor':
        case 'risk-analytics':
        case 'model-governance':
          return <RiskGovernancePanel />;
        case 'cross-asset':
          return <CrossAssetAnalysis />;
        case 'asset-universe':
          return <AssetUniverse />;
        case 'global-equities':
          return <GlobalEquitiesPanel />;
        case 'fixed-income':
          return <FixedIncomePanel />;
        case 'indices-derivatives':
          return <IndicesDerivativesPanel />;
        default:
          return <ExecutiveDashboard />;
      }
    })();

    return <Suspense fallback={<LoadingFallback />}>{content}</Suspense>;
  };

  return (
    <AssetProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
          {/* Institutional Sidebar */}
          <InstitutionalSidebar 
            activePage={activePage} 
            onPageChange={setActivePage} 
          />

          {/* Main Content Area */}
          <div className="ml-64">
            {/* Institutional Top Bar */}
            <InstitutionalTopBar />

            {/* Ticker Tape */}
            <TickerTape />

            {/* Workspace Content */}
            <main className="p-6">
              {renderContent()}
            </main>
          </div>
        </div>
      </NotificationProvider>
    </AssetProvider>
  );
}
