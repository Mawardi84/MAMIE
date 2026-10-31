/**
 * MAMIE Data Source Registry - React Hooks
 * PHASE 02: Data Source & Data Integrity
 */

import { useState, useEffect, useCallback } from 'react';
import * as service from './service';
import { DataSource, DataIngestionJob, DataQualityReport } from './types';

export function useDataSources() {
  const [data, setData] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataSources = useCallback(() => {
    try {
      setLoading(true);
      const sources = service.getDataSources();
      setData(sources);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data sources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataSources();
  }, [fetchDataSources]);

  return { data, loading, error, refetch: fetchDataSources };
}

export function useDataSource(id: string | undefined) {
  const [data, setData] = useState<DataSource | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataSource = useCallback(() => {
    if (!id) {
      setData(undefined);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const source = service.getDataSource(id);
      setData(source);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data source');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDataSource();
  }, [fetchDataSource]);

  return { data, loading, error, refetch: fetchDataSource };
}

export function useIngestionJobs(sourceId: string | undefined) {
  const [data, setData] = useState<DataIngestionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(() => {
    if (!sourceId) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const jobs = service.getIngestionJobsBySource(sourceId);
      setData(jobs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ingestion jobs');
    } finally {
      setLoading(false);
    }
  }, [sourceId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { data, loading, error, refetch: fetchJobs };
}

export function useQualityReports(sourceId: string | undefined) {
  const [data, setData] = useState<DataQualityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(() => {
    if (!sourceId) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const reports = service.getQualityReportsBySource(sourceId);
      setData(reports);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quality reports');
    } finally {
      setLoading(false);
    }
  }, [sourceId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { data, loading, error, refetch: fetchReports };
}

export function useInitializeDataSourceRegistry() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(() => {
    try {
      setLoading(true);
      service.initializeDataSourceRegistry();
      setInitialized(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize data source registry');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return { initialized, loading, error, initialize };
}
