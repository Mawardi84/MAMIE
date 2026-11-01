import { useState } from 'react';
import { AssetProvider } from './context/AssetContext';
import InstitutionalSidebar from './components/InstitutionalSidebar';
import InstitutionalTopBar from './components/InstitutionalTopBar';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import TradingTerminal from './components/TradingTerminal';
import TickerTape from './components/TickerTape';
import LiquidityPanel from './components/LiquidityPanel';
import OrderFlowPanel from './components/OrderFlowPanel';
import ComexSpotPanel from './components/ComexSpotPanel';
import ProbabilityPanel from './components/ProbabilityPanel';
import BacktestPanel from './components/BacktestPanel';
import AIEnginePanel from './components/AIEnginePanel';
import DataSourcesPanel from './components/DataSourcesPanel';
import DataSourcePanel from './components/DataSourcePanel';
import InstrumentRegistryPanel from './components/InstrumentRegistryPanel';
import IndonesianEquityPanel from './components/IndonesianEquityPanel';
import MultiAssetIntelligencePanel from './components/MultiAssetIntelligencePanel';
import AIResearchPanel from './components/AIResearchPanel';
import MicrostructurePanel from './components/MicrostructurePanel';
import MacroPanel from './components/MacroPanel';
import PositioningPanel from './components/PositioningPanel';
import QuantResearchPanel from './components/QuantResearchPanel';
import RiskGovernancePanel from './components/RiskGovernancePanel';
import CrossAssetAnalysis from './components/CrossAssetAnalysis';
import AssetUniverse from './components/AssetUniverse';

export default function App() {
  const [activePage, setActivePage] = useState('executive-dashboard');

  const renderContent = () => {
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
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <AssetProvider>
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
    </AssetProvider>
  );
}
