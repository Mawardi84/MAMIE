import { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Globe, 
  Building2, 
  DollarSign,
  Coins,
  Banknote,
  LineChart,
  Activity,
  Droplets,
  BarChart3,
  Users,
  Brain,
  Database,
  Shield,
  Settings,
  Sparkles,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  status?: 'active' | 'coming-soon' | 'not-configured';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function InstitutionalSidebar({ activePage, onPageChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'overview': true,
    'market': true,
    'asset': false,
    'research': false,
    'risk': false,
    'data': false,
    'ai': false,
  });

  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'executive-dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, status: 'active' },
        { id: 'market-overview', label: 'Market Overview', icon: TrendingUp, status: 'active' },
      ]
    },
    {
      title: 'MARKET INTELLIGENCE',
      items: [
        { id: 'market-terminal', label: 'Market Terminal', icon: Activity, status: 'active' },
        { id: 'asset-universe', label: 'Asset Universe', icon: Globe, status: 'coming-soon' },
        { id: 'cross-asset', label: 'Cross-Asset Analysis', icon: BarChart3, status: 'coming-soon' },
      ]
    },
    {
      title: 'ASSET CLASS',
      items: [
        { id: 'idx-equities', label: 'Indonesian Equities', icon: Building2, status: 'active' },
        { id: 'global-equities', label: 'Global Equities', icon: Globe, status: 'coming-soon' },
        { id: 'commodities', label: 'Commodities', icon: DollarSign, status: 'active' },
        { id: 'forex', label: 'Forex', icon: Banknote, status: 'active' },
        { id: 'crypto', label: 'Crypto', icon: Coins, status: 'active' },
        { id: 'fixed-income', label: 'Fixed Income', icon: LineChart, status: 'coming-soon' },
        { id: 'indices', label: 'Indices & Derivatives', icon: TrendingUp, status: 'coming-soon' },
      ]
    },
    {
      title: 'RESEARCH',
      items: [
        { id: 'microstructure', label: 'Market Microstructure', icon: Activity, status: 'active' },
        { id: 'liquidity', label: 'Liquidity Intelligence', icon: Droplets, status: 'active' },
        { id: 'macro', label: 'Macro Intelligence', icon: Globe, status: 'active' },
        { id: 'positioning', label: 'Positioning & COT', icon: Users, status: 'active' },
        { id: 'quant', label: 'Quant Research', icon: Brain, status: 'active' },
      ]
    },
    {
      title: 'RISK & GOVERNANCE',
      items: [
        { id: 'risk-monitor', label: 'Risk Monitor', icon: AlertTriangle, status: 'coming-soon' },
        { id: 'risk-analytics', label: 'Risk Analytics', icon: BarChart3, status: 'coming-soon' },
        { id: 'data-quality', label: 'Data Quality', icon: Shield, status: 'active' },
        { id: 'model-governance', label: 'Model Governance', icon: Shield, status: 'coming-soon' },
      ]
    },
    {
      title: 'DATA & SYSTEM',
      items: [
        { id: 'data-management', label: 'Data Management', icon: Database, status: 'active' },
        { id: 'data-sources', label: 'Data Sources', icon: Database, status: 'active' },
        { id: 'import-export', label: 'Import / Export', icon: FileText, status: 'coming-soon' },
        { id: 'system-health', label: 'System Health', icon: Activity, status: 'coming-soon' },
        { id: 'settings', label: 'Settings', icon: Settings, status: 'coming-soon' },
      ]
    },
    {
      title: 'AI WORKSPACE',
      items: [
        { id: 'ai-research', label: 'AI Research Assistant', icon: Sparkles, status: 'active' },
        { id: 'research-reports', label: 'Research Reports', icon: FileText, status: 'coming-soon' },
      ]
    },
  ];

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle.toLowerCase().replace(' ', '-')]: !prev[sectionTitle.toLowerCase().replace(' ', '-')]
    }));
  };

  const handleItemClick = (item: NavItem) => {
    if (item.status === 'active') {
      onPageChange(item.id);
    }
  };

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-screen z-40
        bg-[var(--color-bg-secondary)]
        border-r border-[var(--color-border-default)]
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border-default)]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">MAMIE</div>
              <div className="text-xs text-[var(--color-text-tertiary)]">Institutional</div>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-[var(--color-bg-surface)] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navSections.map((section) => {
          const sectionKey = section.title.toLowerCase().replace(' ', '-');
          const isExpanded = expandedSections[sectionKey];

          return (
            <div key={section.title} className="mb-2">
              {!collapsed && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider hover:text-[var(--color-text-secondary)] transition-colors"
                >
                  <span>{section.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              )}

              {(isExpanded || collapsed) && (
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = activePage === item.id;
                    const isDisabled = item.status !== 'active';

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        disabled={isDisabled}
                        className={`
                          w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
                          ${isActive 
                            ? 'bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] border-r-2 border-[var(--color-accent-primary)]' 
                            : isDisabled
                              ? 'text-[var(--color-text-disabled)] cursor-not-allowed'
                              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]'
                          }
                          ${collapsed ? 'justify-center' : ''}
                        `}
                        title={collapsed ? item.label : undefined}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.status === 'coming-soon' && (
                              <span className="text-xs text-[var(--color-text-tertiary)]">Soon</span>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[var(--color-border-default)]">
          <div className="text-xs text-[var(--color-text-tertiary)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>System Online</span>
            </div>
            <div>Version 1.0.0</div>
          </div>
        </div>
      )}
    </aside>
  );
}
