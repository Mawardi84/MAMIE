import { useState, useEffect } from 'react';
import {
  fetchGoldSpotPrice,
  fetchGoldPriceData,
  fetchCOTData,
  fetchDXYData,
  fetchVIXData,
  fetchUS10YData,
  fetchSilverData,
  calculateRealizedVolatility,
  calculateCorrelation,
  cachedFetch,
  type PriceData,
  type COTData,
} from '../services/dataService';

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: Date | null;
}

// Hook for gold spot price
export function useGoldSpotPrice(): UseDataResult<{ price: number; change: number; changePercent: number }> {
  const [data, setData] = useState<{ price: number; change: number; changePercent: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await cachedFetch('gold-spot', fetchGoldSpotPrice, 60000); // 1 minute cache
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gold price');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData, lastUpdated };
}

// Hook for gold price history
export function useGoldPriceHistory(range: string = '1mo', interval: string = '1d'): UseDataResult<PriceData[]> {
  const [data, setData] = useState<PriceData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const cacheKey = `gold-history-${range}-${interval}`;
      const result = await cachedFetch(cacheKey, () => fetchGoldPriceData('GC=F', range, interval));
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range, interval]);

  return { data, loading, error, refetch: fetchData, lastUpdated };
}

// Hook for COT data
export function useCOTData(limit: number = 52): UseDataResult<COTData[]> {
  const [data, setData] = useState<COTData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await cachedFetch(`cot-${limit}`, () => fetchCOTData('GOLD', limit), 24 * 60 * 60 * 1000); // 24 hours cache
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch COT data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [limit]);

  return { data, loading, error, refetch: fetchData, lastUpdated };
}

// Hook for DXY data
export function useDXYData(range: string = '1mo'): UseDataResult<PriceData[]> {
  const [data, setData] = useState<PriceData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await cachedFetch(`dxy-${range}`, () => fetchDXYData(range));
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch DXY data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  return { data, loading, error, refetch: fetchData, lastUpdated };
}

// Hook for VIX data
export function useVIXData(range: string = '1mo'): UseDataResult<PriceData[]> {
  const [data, setData] = useState<PriceData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await cachedFetch(`vix-${range}`, () => fetchVIXData(range));
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch VIX data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  return { data, loading, error, refetch: fetchData, lastUpdated };
}

// Hook for US 10Y yield
export function useUS10YData(range: string = '1mo'): UseDataResult<PriceData[]> {
  const [data, setData] = useState<PriceData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await cachedFetch(`us10y-${range}`, () => fetchUS10YData(range));
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch US 10Y data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  return { data, loading, error, refetch: fetchData, lastUpdated };
}

// Hook for Silver data
export function useSilverData(range: string = '1mo'): UseDataResult<PriceData[]> {
  const [data, setData] = useState<PriceData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await cachedFetch(`silver-${range}`, () => fetchSilverData(range));
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Silver data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  return { data, loading, error, refetch: fetchData, lastUpdated };
}

// Hook for volatility calculation
export function useVolatility(prices: PriceData[] | null, window: number = 20): { volatility: number[] | null; loading: boolean } {
  const [volatility, setVolatility] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!prices || prices.length === 0) {
      setVolatility(null);
      return;
    }

    setLoading(true);
    const vol = calculateRealizedVolatility(prices, window);
    setVolatility(vol);
    setLoading(false);
  }, [prices, window]);

  return { volatility, loading };
}

// Hook for correlation calculation
export function useCorrelation(
  series1: PriceData[] | null,
  series2: PriceData[] | null
): { correlation: number | null; loading: boolean } {
  const [correlation, setCorrelation] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!series1 || !series2 || series1.length === 0 || series2.length === 0) {
      setCorrelation(null);
      return;
    }

    setLoading(true);
    const corr = calculateCorrelation(series1, series2);
    setCorrelation(corr);
    setLoading(false);
  }, [series1, series2]);

  return { correlation, loading };
}
