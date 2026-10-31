/**
 * MAMIE Data Source Registry - Types
 * PHASE 02: Data Source & Data Integrity
 */

export type DataSourceType = 
  | 'MARKET_DATA'
  | 'FUNDAMENTAL'
  | 'MACRO_ECONOMIC'
  | 'POSITIONING'
  | 'CORPORATE_ACTION'
  | 'INDEX_CONSTITUENT'
  | 'ON_CHAIN';

export type AccessMethod = 
  | 'REST_API'
  | 'WEBSOCKET'
  | 'WEB_SCRAPING'
  | 'CSV_DOWNLOAD'
  | 'MANUAL_ENTRY';

export type LicenseStatus = 
  | 'PUBLIC_DOMAIN'
  | 'FREE_COMMERCIAL'
  | 'FREE_NON_COMMERCIAL'
  | 'ATTRIBUTION_REQUIRED'
  | 'RESTRICTED'
  | 'NOT_VERIFIED';

export type DataFrequency = 
  | 'REALTIME'
  | 'TICK'
  | 'SECONDLY'
  | 'MINUTELY'
  | 'HOURLY'
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'ANNUALLY'
  | 'EVENT_DRIVEN';

export type DataQualityStatus = 
  | 'VALID'
  | 'PARTIAL'
  | 'INVALID'
  | 'STALE'
  | 'MISSING'
  | 'RECONSTRUCTED'
  | 'UNVERIFIED';

export interface DataSource {
  source_id: string;
  source_name: string;
  source_url?: string;
  source_type: DataSourceType;
  access_method: AccessMethod;
  
  // Coverage
  asset_classes: string[];
  instruments_covered: number;
  geographic_coverage: string[];
  
  // Data Fields
  available_fields: string[];
  
  // History
  historical_start_date?: string;
  historical_end_date?: string;
  update_frequency: DataFrequency;
  
  // License & Compliance
  license_status: LicenseStatus;
  license_type?: string;
  commercial_use_allowed: boolean;
  redistribution_allowed: boolean;
  attribution_required: boolean;
  attribution_text?: string;
  
  // Access
  api_endpoint?: string;
  authentication_required: boolean;
  rate_limit?: string;
  
  // Quality
  data_quality_score: number; // 0-100
  reliability_score: number; // 0-100
  last_verified: string;
  
  // Limitations
  known_limitations: string[];
  
  // Status
  status: 'ACTIVE' | 'DEGRADED' | 'INACTIVE';
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface DataIngestionJob {
  job_id: string;
  source_id: string;
  job_type: 'FULL' | 'INCREMENTAL' | 'VALIDATION';
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  
  started_at?: string;
  completed_at?: string;
  
  records_processed: number;
  records_valid: number;
  records_invalid: number;
  records_skipped: number;
  
  error_message?: string;
  
  created_at: string;
}

export interface DataQualityCheck {
  check_id: string;
  source_id: string;
  check_type: 'COMPLETENESS' | 'ACCURACY' | 'CONSISTENCY' | 'TIMELINESS' | 'UNIQUENESS';
  check_name: string;
  
  status: 'PASS' | 'FAIL' | 'WARNING';
  score: number; // 0-100
  
  details: string;
  recommendations?: string[];
  
  checked_at: string;
}

export interface DataLineage {
  lineage_id: string;
  output_metric: string;
  output_instrument_id?: string;
  
  input_sources: string[]; // source_ids
  input_metrics: string[];
  
  calculation_method: string;
  parameters: Record<string, any>;
  
  calculated_at: string;
  calculated_by: string; // system version
  
  quality_status: DataQualityStatus;
}

export interface DataQualityReport {
  report_id: string;
  source_id: string;
  report_date: string;
  
  overall_score: number;
  
  checks: DataQualityCheck[];
  
  completeness_score: number;
  accuracy_score: number;
  consistency_score: number;
  timeliness_score: number;
  
  issues: string[];
  recommendations: string[];
  
  generated_at: string;
}
