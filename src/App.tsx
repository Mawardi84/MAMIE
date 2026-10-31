import { useState } from 'react';
import { AssetProvider } from './context/AssetContext';
import TradingTerminal from './components/TradingTerminal';
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
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gray-900 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">Q</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Multi-Asset</h2>
              <p className="text-xs text-gray-400">Quant Research</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
                ${activeTab === item.id
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
                }
              `}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
              {activeTab === item.id && (
                <ChevronRight className="w-3 h-3 ml-auto text-amber-400" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-300 font-medium">System Status</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Data Feed</span>
                <span className="text-xs text-emerald-400">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Models</span>
                <span className="text-xs text-emerald-400">7/7 Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Last Sync</span>
                <span className="text-xs text-gray-400">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                <span>Research</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-300">
                  {navItems.find(n => n.id === activeTab)?.label}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                <span className="text-gray-400 text-xs">Multi-Asset</span>
                <span className="text-gray-600">|</span>
                <span className="text-amber-400 text-xs font-medium">30+ Assets</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-400 text-xs">Live Data</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderContent()}
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>XAU/USD Quantitative Research Platform v2.1</span>
            <span>Research purposes only — Not financial advice</span>
          </div>
        </footer>
      </main>
    </div>
    </AssetProvider>
  );
}
