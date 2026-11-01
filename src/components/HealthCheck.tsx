import { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  message: string;
  lastChecked: Date;
  checks: {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message?: string;
    duration?: number;
  }[];
}

export default function HealthCheck() {
  const [health, setHealth] = useState<HealthStatus>({
    status: 'healthy',
    message: 'All systems operational',
    lastChecked: new Date(),
    checks: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    setLoading(true);
    const checks: HealthStatus['checks'] = [];

    // Check 1: Internet connectivity
    const connectivityStart = Date.now();
    try {
      const response = await fetch('https://www.google.com/favicon.ico', {
        mode: 'no-cors',
        cache: 'no-cache',
      });
      checks.push({
        name: 'Internet Connectivity',
        status: 'pass',
        message: 'Connected',
        duration: Date.now() - connectivityStart,
      });
    } catch (error) {
      checks.push({
        name: 'Internet Connectivity',
        status: 'fail',
        message: 'No internet connection',
        duration: Date.now() - connectivityStart,
      });
    }

    // Check 2: API availability
    const apiStart = Date.now();
    try {
      const response = await fetch('https://query1.finance.yahoo.com/v1/test', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
      });
      checks.push({
        name: 'Yahoo Finance API',
        status: 'pass',
        message: 'API available',
        duration: Date.now() - apiStart,
      });
    } catch (error) {
      checks.push({
        name: 'Yahoo Finance API',
        status: 'warn',
        message: 'API may be unavailable',
        duration: Date.now() - apiStart,
      });
    }

    // Check 3: LocalStorage
    try {
      localStorage.setItem('health_check', 'test');
      localStorage.removeItem('health_check');
      checks.push({
        name: 'Local Storage',
        status: 'pass',
        message: 'Available',
      });
    } catch (error) {
      checks.push({
        name: 'Local Storage',
        status: 'fail',
        message: 'Not available',
      });
    }

    // Check 4: Memory usage
    if (performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);
      const percentage = (usedMB / limitMB) * 100;

      checks.push({
        name: 'Memory Usage',
        status: percentage > 90 ? 'fail' : percentage > 70 ? 'warn' : 'pass',
        message: `${usedMB}MB / ${limitMB}MB (${percentage.toFixed(1)}%)`,
      });
    }

    // Determine overall status
    const hasFailure = checks.some((c) => c.status === 'fail');
    const hasWarning = checks.some((c) => c.status === 'warn');

    const overallStatus: HealthStatus['status'] = hasFailure
      ? 'down'
      : hasWarning
      ? 'degraded'
      : 'healthy';

    setHealth({
      status: overallStatus,
      message:
        overallStatus === 'healthy'
          ? 'All systems operational'
          : overallStatus === 'degraded'
          ? 'Some systems degraded'
          : 'System issues detected',
      lastChecked: new Date(),
      checks,
    });

    setLoading(false);
  };

  const getStatusIcon = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'degraded':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'down':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
    }
  };

  return (
    <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-[var(--color-accent-primary)]" />
          System Health
        </h2>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="px-3 py-1 text-xs bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded hover:bg-[var(--color-bg-primary)] transition-colors disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      <div className={`p-4 rounded-lg border mb-4 ${getStatusColor(health.status)}`}>
        <div className="flex items-center gap-3">
          {getStatusIcon(health.status)}
          <div>
            <div className="font-semibold">{health.message}</div>
            <div className="text-xs opacity-75">
              Last checked: {health.lastChecked.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {health.checks.map((check, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-[var(--color-bg-elevated)] rounded border border-[var(--color-border-default)]"
          >
            <div className="flex items-center gap-3">
              {check.status === 'pass' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {check.status === 'warn' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
              {check.status === 'fail' && <XCircle className="w-4 h-4 text-red-500" />}
              <div>
                <div className="text-sm font-medium text-white">{check.name}</div>
                {check.message && (
                  <div className="text-xs text-[var(--color-text-secondary)]">{check.message}</div>
                )}
              </div>
            </div>
            {check.duration && (
              <div className="text-xs text-[var(--color-text-tertiary)] font-mono">
                {check.duration}ms
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
