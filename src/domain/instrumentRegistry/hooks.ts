/**
 * MAMIE Instrument Registry React Hooks
 * PHASE 01: Core Platform & Universal Instrument Registry
 * 
 * Custom React hooks for interacting with the instrument registry.
 */

import { useState, useEffect, useCallback } from 'react';
import { instrumentRegistryApi } from './api';
import {
  AssetClass,
  Exchange,
  Issuer,
  Instrument,
  InstrumentIdentifier,
  InstrumentStatusHistory,
  CorporateAction,
  DataSource,
  InstrumentSearchFilters,
  InstrumentSearchResult,
  InstrumentStatus,
} from './types';

// ============================================================================
// ASSET CLASS HOOKS
// ============================================================================

export function useAssetClasses() {
  const [data, setData] = useState<AssetClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssetClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await instrumentRegistryApi.getAssetClasses();
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.error || 'Failed to fetch asset classes');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAssetClasses();
  }, [fetchAssetClasses]);

  return { data, loading, error, refetch: fetchAssetClasses };
}

// ============================================================================
// EXCHANGE HOOKS
// ============================================================================

export function useExchanges() {
  const [data, setData] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExchanges = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await instrumentRegistryApi.getExchanges();
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.error || 'Failed to fetch exchanges');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchExchanges();
  }, [fetchExchanges]);

  return { data, loading, error, refetch: fetchExchanges };
}

// ============================================================================
// INSTRUMENT HOOKS
// ============================================================================

export function useInstruments() {
  const [data, setData] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstruments = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await instrumentRegistryApi.getInstruments();
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.error || 'Failed to fetch instruments');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInstruments();
  }, [fetchInstruments]);

  return { data, loading, error, refetch: fetchInstruments };
}

export function useInstrument(id: string | undefined) {
  const [data, setData] = useState<Instrument | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstrument = useCallback(async () => {
    if (!id) {
      setData(undefined);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const response = await instrumentRegistryApi.getInstrument(id);
    if (response.success) {
      setData(response.data);
    } else {
      setError(response.error || 'Failed to fetch instrument');
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchInstrument();
  }, [fetchInstrument]);

  return { data, loading, error, refetch: fetchInstrument };
}

export function useInstrumentSearch(filters: InstrumentSearchFilters, page: number = 1, pageSize: number = 50) {
  const [data, setData] = useState<InstrumentSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await instrumentRegistryApi.searchInstruments(filters, page, pageSize);
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.error || 'Failed to search instruments');
    }
    setLoading(false);
  }, [filters, page, pageSize]);

  useEffect(() => {
    search();
  }, [search]);

  return { data, loading, error, refetch: search };
}

// ============================================================================
// IDENTIFIER HOOKS
// ============================================================================

export function useInstrumentIdentifiers(instrumentId: string | undefined) {
  const [data, setData] = useState<InstrumentIdentifier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdentifiers = useCallback(async () => {
    if (!instrumentId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const response = await instrumentRegistryApi.getIdentifiersForInstrument(instrumentId);
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.error || 'Failed to fetch identifiers');
    }
    setLoading(false);
  }, [instrumentId]);

  useEffect(() => {
    fetchIdentifiers();
  }, [fetchIdentifiers]);

  return { data, loading, error, refetch: fetchIdentifiers };
}

// ============================================================================
// STATUS HISTORY HOOKS
// ============================================================================

export function useInstrumentStatusHistory(instrumentId: string | undefined) {
  const [data, setData] = useState<InstrumentStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!instrumentId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const response = await instrumentRegistryApi.getStatusHistoryForInstrument(instrumentId);
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.error || 'Failed to fetch status history');
    }
    setLoading(false);
  }, [instrumentId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { data, loading, error, refetch: fetchHistory };
}

// ============================================================================
// CORPORATE ACTION HOOKS
// ============================================================================

export function useCorporateActions(instrumentId: string | undefined) {
  const [data, setData] = useState<CorporateAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActions = useCallback(async () => {
    if (!instrumentId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const response = await instrumentRegistryApi.getCorporateActionsForInstrument(instrumentId);
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.error || 'Failed to fetch corporate actions');
    }
    setLoading(false);
  }, [instrumentId]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  return { data, loading, error, refetch: fetchActions };
}

// ============================================================================
// DATA SOURCE HOOKS
// ============================================================================

export function useDataSources() {
  const [data, setData] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataSources = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await instrumentRegistryApi.getDataSources();
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.error || 'Failed to fetch data sources');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDataSources();
  }, [fetchDataSources]);

  return { data, loading, error, refetch: fetchDataSources };
}

// ============================================================================
// INITIALIZATION HOOK
// ============================================================================

export function useInitializeRegistry() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await instrumentRegistryApi.initializeRegistry();
    if (response.success) {
      setInitialized(true);
    } else {
      setError(response.error || 'Failed to initialize registry');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return { initialized, loading, error, initialize };
}
