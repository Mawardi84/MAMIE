/**
 * MAMIE Data Source Registry - Service
 * PHASE 02: Data Source & Data Integrity
 */

import { v4 as uuidv4 } from 'uuid';
import {
  DataSource,
  DataIngestionJob,
  DataQualityCheck,
  DataLineage,
  DataQualityReport,
  DataSourceType,
  LicenseStatus,
  DataQualityStatus,
} from './types';

// Storage keys
const STORAGE_KEYS = {
  DATA_SOURCES: 'mamie_data_sources',
  INGESTION_JOBS: 'mamie_ingestion_jobs',
  QUALITY_CHECKS: 'mamie_quality_checks',
  DATA_LINEAGE: 'mamie_data_lineage',
  QUALITY_REPORTS: 'mamie_quality_reports',
};

// Storage helpers
function loadFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// ============================================================================
// DATA SOURCE OPERATIONS
// ============================================================================

export function getDataSources(): DataSource[] {
  return loadFromStorage<DataSource>(STORAGE_KEYS.DATA_SOURCES);
}

export function getDataSource(id: string): DataSource | undefined {
  const sources = getDataSources();
  return sources.find(s => s.source_id === id);
}

export function createDataSource(source: Omit<DataSource, 'source_id' | 'created_at' | 'updated_at'>): DataSource {
  const now = new Date().toISOString();
  const newSource: DataSource = {
    ...source,
    source_id: uuidv4(),
    created_at: now,
    updated_at: now,
  };
  
  const sources = getDataSources();
  sources.push(newSource);
  saveToStorage(STORAGE_KEYS.DATA_SOURCES, sources);
  
  return newSource;
}

export function updateDataSource(id: string, updates: Partial<DataSource>): DataSource | undefined {
  const sources = getDataSources();
  const index = sources.findIndex(s => s.source_id === id);
  
  if (index === -1) return undefined;
  
  const updated = {
    ...sources[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  sources[index] = updated;
  saveToStorage(STORAGE_KEYS.DATA_SOURCES, sources);
  
  return updated;
}

// ============================================================================
// DATA INGESTION JOB OPERATIONS
// ============================================================================

export function getIngestionJobs(): DataIngestionJob[] {
  return loadFromStorage<DataIngestionJob>(STORAGE_KEYS.INGESTION_JOBS);
}

export function getIngestionJobsBySource(sourceId: string): DataIngestionJob[] {
  const jobs = getIngestionJobs();
  return jobs
    .filter(j => j.source_id === sourceId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function createIngestionJob(job: Omit<DataIngestionJob, 'job_id' | 'created_at'>): DataIngestionJob {
  const newJob: DataIngestionJob = {
    ...job,
    job_id: uuidv4(),
    created_at: new Date().toISOString(),
  };
  
  const jobs = getIngestionJobs();
  jobs.push(newJob);
  saveToStorage(STORAGE_KEYS.INGESTION_JOBS, jobs);
  
  return newJob;
}

export function updateIngestionJob(id: string, updates: Partial<DataIngestionJob>): DataIngestionJob | undefined {
  const jobs = getIngestionJobs();
  const index = jobs.findIndex(j => j.job_id === id);
  
  if (index === -1) return undefined;
  
  jobs[index] = { ...jobs[index], ...updates };
  saveToStorage(STORAGE_KEYS.INGESTION_JOBS, jobs);
  
  return jobs[index];
}

// ============================================================================
// DATA QUALITY CHECK OPERATIONS
// ============================================================================

export function getQualityChecks(): DataQualityCheck[] {
  return loadFromStorage<DataQualityCheck>(STORAGE_KEYS.QUALITY_CHECKS);
}

export function getQualityChecksBySource(sourceId: string): DataQualityCheck[] {
  const checks = getQualityChecks();
  return checks
    .filter(c => c.source_id === sourceId)
    .sort((a, b) => new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime());
}

export function createQualityCheck(check: Omit<DataQualityCheck, 'check_id' | 'checked_at'>): DataQualityCheck {
  const newCheck: DataQualityCheck = {
    ...check,
    check_id: uuidv4(),
    checked_at: new Date().toISOString(),
  };
  
  const checks = getQualityChecks();
  checks.push(newCheck);
  saveToStorage(STORAGE_KEYS.QUALITY_CHECKS, checks);
  
  return newCheck;
}

// ============================================================================
// DATA LINEAGE OPERATIONS
// ============================================================================

export function getDataLineage(): DataLineage[] {
  return loadFromStorage<DataLineage>(STORAGE_KEYS.DATA_LINEAGE);
}

export function createDataLineage(lineage: Omit<DataLineage, 'lineage_id'>): DataLineage {
  const newLineage: DataLineage = {
    ...lineage,
    lineage_id: uuidv4(),
  };
  
  const lineages = getDataLineage();
  lineages.push(newLineage);
  saveToStorage(STORAGE_KEYS.DATA_LINEAGE, lineages);
  
  return newLineage;
}

// ============================================================================
// DATA QUALITY REPORT OPERATIONS
// ============================================================================

export function getQualityReports(): DataQualityReport[] {
  return loadFromStorage<DataQualityReport>(STORAGE_KEYS.QUALITY_REPORTS);
}

export function getQualityReportsBySource(sourceId: string): DataQualityReport[] {
  const reports = getQualityReports();
  return reports
    .filter(r => r.source_id === sourceId)
    .sort((a, b) => new Date(b.report_date).getTime() - new Date(a.report_date).getTime());
}

export function createQualityReport(report: Omit<DataQualityReport, 'report_id' | 'generated_at'>): DataQualityReport {
  const newReport: DataQualityReport = {
    ...report,
    report_id: uuidv4(),
    generated_at: new Date().toISOString(),
  };
  
  const reports = getQualityReports();
  reports.push(newReport);
  saveToStorage(STORAGE_KEYS.QUALITY_REPORTS, reports);
  
  return newReport;
}

// ============================================================================
// DATA QUALITY ENGINE
// ============================================================================

export function runDataQualityCheck(sourceId: string): DataQualityReport {
  const source = getDataSource(sourceId);
  if (!source) {
    throw new Error(`Data source ${sourceId} not found`);
  }
  
  const checks: DataQualityCheck[] = [];
  
  // Completeness check
  const completenessScore = source.available_fields.length > 0 ? 80 : 50;
  checks.push({
    check_id: uuidv4(),
    source_id: sourceId,
    check_type: 'COMPLETENESS',
    check_name: 'Field Completeness',
    status: completenessScore >= 70 ? 'PASS' : 'WARNING',
    score: completenessScore,
    details: `${source.available_fields.length} fields available`,
    recommendations: completenessScore < 70 ? ['Add more data fields'] : [],
    checked_at: new Date().toISOString(),
  });
  
  // Accuracy check (simulated)
  const accuracyScore = source.data_quality_score;
  checks.push({
    check_id: uuidv4(),
    source_id: sourceId,
    check_type: 'ACCURACY',
    check_name: 'Data Accuracy',
    status: accuracyScore >= 80 ? 'PASS' : accuracyScore >= 60 ? 'WARNING' : 'FAIL',
    score: accuracyScore,
    details: `Quality score: ${accuracyScore}/100`,
    recommendations: accuracyScore < 80 ? ['Verify data against authoritative sources'] : [],
    checked_at: new Date().toISOString(),
  });
  
  // Consistency check
  const consistencyScore = source.reliability_score;
  checks.push({
    check_id: uuidv4(),
    source_id: sourceId,
    check_type: 'CONSISTENCY',
    check_name: 'Data Consistency',
    status: consistencyScore >= 80 ? 'PASS' : consistencyScore >= 60 ? 'WARNING' : 'FAIL',
    score: consistencyScore,
    details: `Reliability score: ${consistencyScore}/100`,
    recommendations: consistencyScore < 80 ? ['Monitor for data inconsistencies'] : [],
    checked_at: new Date().toISOString(),
  });
  
  // Timeliness check
  const lastVerified = new Date(source.last_verified);
  const daysSinceVerified = Math.floor((Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24));
  const timelinessScore = Math.max(0, 100 - daysSinceVerified * 5);
  checks.push({
    check_id: uuidv4(),
    source_id: sourceId,
    check_type: 'TIMELINESS',
    check_name: 'Data Timeliness',
    status: timelinessScore >= 80 ? 'PASS' : timelinessScore >= 60 ? 'WARNING' : 'FAIL',
    score: timelinessScore,
    details: `Last verified: ${daysSinceVerified} days ago`,
    recommendations: timelinessScore < 80 ? ['Re-verify data source'] : [],
    checked_at: new Date().toISOString(),
  });
  
  // Calculate overall scores
  const overallScore = checks.reduce((sum, c) => sum + c.score, 0) / checks.length;
  const completenessAvg = checks.filter(c => c.check_type === 'COMPLETENESS').reduce((sum, c) => sum + c.score, 0) / checks.filter(c => c.check_type === 'COMPLETENESS').length;
  const accuracyAvg = checks.filter(c => c.check_type === 'ACCURACY').reduce((sum, c) => sum + c.score, 0) / checks.filter(c => c.check_type === 'ACCURACY').length;
  const consistencyAvg = checks.filter(c => c.check_type === 'CONSISTENCY').reduce((sum, c) => sum + c.score, 0) / checks.filter(c => c.check_type === 'CONSISTENCY').length;
  const timelinessAvg = checks.filter(c => c.check_type === 'TIMELINESS').reduce((sum, c) => sum + c.score, 0) / checks.filter(c => c.check_type === 'TIMELINESS').length;
  
  // Save checks
  checks.forEach(check => {
    const existingChecks = getQualityChecks();
    existingChecks.push(check);
    saveToStorage(STORAGE_KEYS.QUALITY_CHECKS, existingChecks);
  });
  
  // Create report
  const report = createQualityReport({
    source_id: sourceId,
    report_date: new Date().toISOString().split('T')[0],
    overall_score: overallScore,
    checks,
    completeness_score: completenessAvg,
    accuracy_score: accuracyAvg,
    consistency_score: consistencyAvg,
    timeliness_score: timelinessAvg,
    issues: checks.filter(c => c.status === 'FAIL').map(c => c.details),
    recommendations: checks.flatMap(c => c.recommendations || []),
  });
  
  return report;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export function initializeDefaultDataSources(): void {
  const existing = getDataSources();
  if (existing.length > 0) return;
  
  const defaultSources: Omit<DataSource, 'source_id' | 'created_at' | 'updated_at'>[] = [
    {
      source_name: 'Yahoo Finance',
      source_url: 'https://finance.yahoo.com',
      source_type: 'MARKET_DATA',
      access_method: 'REST_API',
      asset_classes: ['equity', 'commodity', 'fx', 'crypto', 'index', 'fixed_income'],
      instruments_covered: 10000,
      geographic_coverage: ['GLOBAL'],
      available_fields: ['OHLCV', 'volume', 'market_cap'],
      update_frequency: 'DAILY',
      license_status: 'FREE_NON_COMMERCIAL',
      commercial_use_allowed: false,
      redistribution_allowed: false,
      attribution_required: true,
      attribution_text: 'Data provided by Yahoo Finance',
      authentication_required: false,
      rate_limit: '2000 requests/hour',
      data_quality_score: 85,
      reliability_score: 90,
      last_verified: new Date().toISOString(),
      known_limitations: ['No tick data', 'Delayed for some instruments'],
      status: 'ACTIVE',
    },
    {
      source_name: 'CFTC COT Reports',
      source_url: 'https://www.cftc.gov/MarketReports/CommitteesofTraders',
      source_type: 'POSITIONING',
      access_method: 'CSV_DOWNLOAD',
      asset_classes: ['commodity', 'fx', 'index', 'fixed_income'],
      instruments_covered: 200,
      geographic_coverage: ['US'],
      available_fields: ['non_commercial_long', 'non_commercial_short', 'commercial_long', 'commercial_short'],
      historical_start_date: '2000-01-01',
      update_frequency: 'WEEKLY',
      license_status: 'PUBLIC_DOMAIN',
      commercial_use_allowed: true,
      redistribution_allowed: true,
      attribution_required: false,
      authentication_required: false,
      data_quality_score: 95,
      reliability_score: 98,
      last_verified: new Date().toISOString(),
      known_limitations: ['Weekly granularity', 'Limited to reportable positions'],
      status: 'ACTIVE',
    },
    {
      source_name: 'FRED (Federal Reserve Economic Data)',
      source_url: 'https://fred.stlouisfed.org',
      source_type: 'MACRO_ECONOMIC',
      access_method: 'REST_API',
      asset_classes: ['fixed_income', 'fx'],
      instruments_covered: 800000,
      geographic_coverage: ['US', 'GLOBAL'],
      available_fields: ['CPI', 'GDP', 'unemployment', 'interest_rates'],
      historical_start_date: '1950-01-01',
      update_frequency: 'MONTHLY',
      license_status: 'PUBLIC_DOMAIN',
      commercial_use_allowed: true,
      redistribution_allowed: true,
      attribution_required: false,
      authentication_required: false,
      data_quality_score: 98,
      reliability_score: 99,
      last_verified: new Date().toISOString(),
      known_limitations: ['Primarily US-focused'],
      status: 'ACTIVE',
    },
    {
      source_name: 'Bank Indonesia',
      source_url: 'https://www.bi.go.id',
      source_type: 'MACRO_ECONOMIC',
      access_method: 'WEB_SCRAPING',
      asset_classes: ['fixed_income', 'fx'],
      instruments_covered: 100,
      geographic_coverage: ['ID'],
      available_fields: ['BI_Rate', 'inflation', 'GDP', 'exchange_rates'],
      update_frequency: 'MONTHLY',
      license_status: 'PUBLIC_DOMAIN',
      commercial_use_allowed: true,
      redistribution_allowed: true,
      attribution_required: true,
      attribution_text: 'Data sourced from Bank Indonesia',
      authentication_required: false,
      data_quality_score: 90,
      reliability_score: 95,
      last_verified: new Date().toISOString(),
      known_limitations: ['Manual download required', 'Format varies'],
      status: 'ACTIVE',
    },
    {
      source_name: 'Bursa Efek Indonesia (IDX)',
      source_url: 'https://www.idx.co.id',
      source_type: 'MARKET_DATA',
      access_method: 'WEB_SCRAPING',
      asset_classes: ['equity', 'index'],
      instruments_covered: 900,
      geographic_coverage: ['ID'],
      available_fields: ['OHLCV', 'market_cap', 'foreign_flow'],
      update_frequency: 'DAILY',
      license_status: 'NOT_VERIFIED',
      commercial_use_allowed: false,
      redistribution_allowed: false,
      attribution_required: true,
      attribution_text: 'Data sourced from IDX',
      authentication_required: false,
      data_quality_score: 75,
      reliability_score: 80,
      last_verified: new Date().toISOString(),
      known_limitations: ['Limited free historical data', 'No tick data'],
      status: 'ACTIVE',
    },
  ];
  
  defaultSources.forEach(source => createDataSource(source));
}

export function initializeDataSourceRegistry(): void {
  initializeDefaultDataSources();
}
