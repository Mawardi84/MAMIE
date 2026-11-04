import { useState } from 'react';
import { Search, Bell, User, Settings, TrendingUp, Clock } from 'lucide-react';
import { useAsset } from '../context/AssetContext';
import { ASSETS } from '../data/assetRegistry';

export default function InstitutionalTopBar() {
  const {  currentAsset } = useAsset();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="h-16 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-default)] flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left Section - Search */}
      <div className="flex-1 max-w-2xl">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search instruments, reports, or data... (⌘K)"
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors"
          />
        </form>
      </div>

      {/* Center Section - Current Instrument */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-4 px-4 py-2 bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)]">
          <div>
            <div className="text-xs text-[var(--color-text-tertiary)]">Current Instrument</div>
            <div className="text-sm font-semibold text-white">{currentAsset.shortName}</div>
          </div>
          <div className="h-8 w-px bg-[var(--color-border-default)]"></div>
          <div>
            <div className="text-xs text-[var(--color-text-tertiary)]">Asset Class</div>
            <div className="text-sm font-medium text-[var(--color-text-primary)]">{currentAsset.category}</div>
          </div>
          <div className="h-8 w-px bg-[var(--color-border-default)]"></div>
          <div>
            <div className="text-xs text-[var(--color-text-tertiary)]">Exchange</div>
            <div className="text-sm font-medium text-[var(--color-text-primary)]">{currentAsset.exchange}</div>
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex-1 flex items-center justify-end gap-3">
        {/* Market Session Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)]">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-medium text-[var(--color-text-primary)]">Market Open</span>
          <Clock className="w-3 h-3 text-[var(--color-text-tertiary)]" />
        </div>

        {/* Data Freshness */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)]">
          <TrendingUp className="w-3 h-3 text-[var(--color-success)]" />
          <span className="text-xs text-[var(--color-text-secondary)]">Live</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-surface)] transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-lg shadow-lg">
              <div className="p-4 border-b border-[var(--color-border-default)]">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-[var(--color-border-default)] hover:bg-[var(--color-bg-surface)] cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm text-white">Data Quality Alert</div>
                      <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                        Yahoo Finance API response time increased
                      </div>
                      <div className="text-xs text-[var(--color-text-tertiary)] mt-1">2 minutes ago</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b border-[var(--color-border-default)] hover:bg-[var(--color-bg-surface)] cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm text-white">Model Validation Complete</div>
                      <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                        Volatility model passed out-of-sample test
                      </div>
                      <div className="text-xs text-[var(--color-text-tertiary)] mt-1">1 hour ago</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 border-t border-[var(--color-border-default)]">
                <button className="w-full text-center text-xs text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] py-2">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <button
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--color-bg-surface)] transition-colors"
          aria-label="User menu"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </button>

        {/* Settings */}
        <button
          className="p-2 rounded-lg hover:bg-[var(--color-bg-surface)] transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>
      </div>
    </header>
  );
}
