import { useState, useEffect, useCallback } from 'react';
import {
  fetchAssetPriceData,
  fetchAssetQuote,
  fetchCOTForAsset,
  calculateRealizedVolatility,
  calculateCorrelation,
  cachedFetch,
  type PriceData,
  type COTData,
  type AssetQuote,
} from '../services/dataService';
import type { Asset } from '../data/assetRegistry';

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: Date | null;
}

// Generic hook for any asset quote
export function useAssetQuote(asset: Asset | null): UseDataResult<AssetQuote> {
  const [data, setData] = useState<AssetQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!asset) return;
    try {
      setLoading(true);
      setError(null);
      const result = await cachedFetch(
        `quote-${asset.symbol}`,
        () => fetchAssetQuote(asset.symbol),
        60000
      );
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote');
    } finally {
      setLoading(false);
    }
  }, [asset]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, lastUpdated };
}

// Generic hook for any asset price history
export function useAssetPriceHistory(
  asset: Asset | null,
  range: string = '1mo',
  interval: string = '1d'
): UseDataResult<PriceData[]> {
  const [data, setData] = useState<PriceData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!asset) return;
    try {
      setLoading(true);
      setError(null);
      const cacheKey = `history-${asset.symbol}-${range}-${interval}`;
      const result = await cachedFetch(cacheKey, () =>
        fetchAssetPriceData(asset.symbol, range, interval)
      );
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price history');
    } finally {
      setLoading(false);
    }
  }, [asset, range, interval]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, lastUpdated };
}

// Generic hook for COT data (only for assets that have it)
export function useAssetCOT(asset: Asset | null, limit: number = 52): UseDataResult<COTData[]> {
  const [data, setData] = useState<COTData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!asset || !asset.hasCOT) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await cachedFetch(
        `cot-${asset.symbol}-${limit}`,
        () => fetchCOTForAsset(asset, limit),
        24 * 60 * 60 * 1000
      );
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch COT data');
    } finally {
      setLoading(false);
    }
  }, [asset, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, lastUpdated };
}

// Generic hook for volatility calculation
export function useVolatility(
  prices: PriceData[] | null,
  window: number = 20
): { volatility: number[] | null; loading: boolean } {
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

// Generic hook for correlation between any two assets
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

// Hook for fetching multiple asset prices (for watchlist/correlation matrix)
export function useMultipleAssetPrices(
  assets: Asset[],
  range: string = '1mo'
): { data: Record<string, PriceData[]>; loading: boolean; error: string | null } {
  const [data, setData] = useState<Record<string, PriceData[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assets.length === 0) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.allSettled(
          assets.map((asset) =>
            cachedFetch(`multi-${asset.symbol}-${range}`, () =>
              fetchAssetPriceData(asset.symbol, range, '1d')
            )
          )
        );

        const newData: Record<string, PriceData[]> = {};
        results.forEach((result, i) => {
          if (result.status === 'fulfilled') {
            newData[assets[i].symbol] = result.value;
          }
        });
        setData(newData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [assets.map(a => a.symbol).join(','), range]);

  return { data, loading, error };
}
