import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface MonitoringContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  trackError: (error: Error, context?: Record<string, any>) => void;
  trackPerformance: (metric: string, value: number, unit?: string) => void;
  setUser: (user: { id: string; email?: string; name?: string }) => void;
}

const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

/**
 * Monitoring Provider
 * Integrates with Sentry, Google Analytics, and custom analytics
 */
export function MonitoringProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string; name?: string } | null>(null);

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    // Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }

    // Custom analytics
    console.log('[Analytics Event]', eventName, properties);

    // Send to backend analytics API (if configured)
    if (import.meta.env.VITE_API_BASE_URL) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/analytics/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventName,
          properties,
          timestamp: new Date().toISOString(),
          userId: currentUser?.id,
        }),
      }).catch(console.error);
    }
  }, [currentUser]);

  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    // Sentry
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { contexts: context });
    }

    // Console error
    console.error('[Error]', error, context);

    // Send to error tracking API
    if (import.meta.env.VITE_API_BASE_URL) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/analytics/errors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          context,
          timestamp: new Date().toISOString(),
          userId: currentUser?.id,
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(console.error);
    }
  }, [currentUser]);

  const trackPerformance = useCallback((metric: string, value: number, unit: string = 'ms') => {
    // Performance API
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: metric,
        metric_value: value,
        metric_unit: unit,
      });
    }

    console.log('[Performance]', metric, value, unit);
  }, []);

  const setUser = useCallback((user: { id: string; email?: string; name?: string }) => {
    setCurrentUser(user);

    // Sentry user context
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.name,
      });
    }
  }, []);

  return (
    <MonitoringContext.Provider
      value={{
        trackEvent,
        trackError,
        trackPerformance,
        setUser,
      }}
    >
      {children}
    </MonitoringContext.Provider>
  );
}

/**
 * Hook to access monitoring functions
 */
export function useMonitoring() {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error('useMonitoring must be used within MonitoringProvider');
  }
  return context;
}

/**
 * Error Boundary Component
 * Catches React errors and reports them
 */
export class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);

    // Report to Sentry
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: { react: errorInfo },
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
            <h2 className="text-lg font-semibold text-red-400 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-300">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-red-400 text-sm"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
