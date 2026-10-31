import { useState } from 'react';
import { AssetProvider } from './context/AssetContext';
import TradingTerminal from './components/TradingTerminal';
import TickerTape from './components/TickerTape';
import LiquidityPanel from './components/LiquidityPanel';
import OrderFlowPanel from './components/OrderFlowPanel';
import ComexSpotPanel from './components/ComexSpotPanel';
import ProbabilityPanel from './components/ProbabilityPanel';
import BacktestPanel from './components/BacktestPanel';
import AIEnginePanel from './components/AIEnginePanel';
import DataSourcesPanel from './components/DataSourcesPanel';
import {
  LayoutDashboard,
  Droplets,
  GitBranch,
  Repeat,
  BarChart3,
  FlaskConical,
  Brain,
  Database,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Trading Terminal', icon: LayoutDashboard },
  { id: 'liquidity', label: 'Liquidity Analysis', icon: Droplets },
  { id: 'orderflow', label: 'Order Flow', icon: GitBranch },
  { id: 'comex', label: 'COMEX ↔ Spot', icon: Repeat },
  { id: 'probability', label: 'Probability Models', icon: BarChart3 },
  { id: 'backtest', label: 'Backtesting', icon: FlaskConical },
  { id: 'ai', label: 'AI Engine', icon: Brain },
  { id: 'datasources', label: 'Data Sources', icon: Database },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <TradingTerminal />;
      case 'liquidity': return <LiquidityPanel />;
      case 'orderflow': return <OrderFlowPanel />;
      case 'comex': return <ComexSpotPanel />;
      case 'probability': return <ProbabilityPanel />;
      case 'backtest': return <BacktestPanel />;
      case 'ai': return <AIEnginePanel />;
      case 'datasources': return <DataSourcesPanel />;
      default: return <TradingTerminal />;
    }
  };

  return (
    <AssetProvider>
      <div className="min-h-screen bg-[#0a0e17] text-white flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800/50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}>
          {/* Logo */}
          <div className="p-6 border-b border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gold-accent flex items-center justify-center pulse-gold">
                <span className="text-lg font-bold text-gray-900">Q</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gradient-gold">Multi-Asset</h2>
                <p className="text-xs text-gray-400">Quantitative Research</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                  ${activeTab === item.id
                    ? 'bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
                  }
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto text-amber-400" />
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800/50">
            <div className="premium-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-300 font-semibold">System Status</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Data Feed</span>
                  <span className="text-xs text-emerald-400 font-medium">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Assets</span>
                  <span className="text-xs text-emerald-400 font-medium">60+ Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Last Sync</span>
                  <span className="text-xs text-gray-400 font-mono">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-gray-900/30 backdrop-blur-xl border-b border-gray-800/50 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                  <span>Research</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-gradient-gold font-semibold">
                    {navItems.find(n => n.id === activeTab)?.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-4 py-2 premium-card">
                  <span className="text-gray-400 text-xs">Multi-Asset</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-amber-400 text-xs font-bold">60+ Assets</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 premium-card">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-400 text-xs font-medium">Live Data</span>
                </div>
              </div>
            </div>
          </header>

          {/* Ticker Tape */}
          <TickerTape />

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-800/50 bg-gray-900/30 backdrop-blur-xl px-6 py-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium">Multi-Asset Quantitative Research Platform v3.0</span>
              <span>Research purposes only — Not financial advice</span>
            </div>
          </footer>
        </main>
      </div>
    </AssetProvider>
  );
}
