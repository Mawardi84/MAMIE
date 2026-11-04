/**
 * MAMIE Instrument Registry - Domain Types
 * PHASE 01: Core Platform & Universal Instrument Registry
 * 
 * This module defines the universal instrument registry that supports
 * multiple asset classes with stable instrument IDs and historical tracking.
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type AssetClassId = 
  | 'equity'
  | 'commodity'
  | 'fx'
  | 'crypto'
  | 'fixed_income'
  | 'index'
  | 'derivative';

export type InstrumentStatus = 
  | 'ACTIVE'
  | 'IPO'
  | 'SUSPENDED'
  | 'DELISTED'
  | 'EXPIRED'
  | 'MATURED'
  | 'INACTIVE';

export type DataVerificationStatus = 
  | 'VERIFIED'
  | 'PARTIALLY_VERIFIED'
  | 'NOT_VERIFIED'
  | 'NOT_CONFIGURED';

export type IdentifierType = 
  | 'TICKER'
  | 'ISIN'
  | 'FIGI'
  | 'EXCHANGE_SYMBOL'
  | 'PROVIDER_SYMBOL'
  | 'ALIAS';

export type CorporateActionType = 
  | 'STOCK_SPLIT'
  | 'REVERSE_SPLIT'
  | 'CASH_DIVIDEND'
  | 'STOCK_DIVIDEND'
  | 'RIGHTS_ISSUE'
  | 'BONUS_SHARES'
  | 'MERGER'
  | 'ACQUISITION'
  | 'OTHER';

// ============================================================================
// CORE ENTITIES
// ============================================================================

/**
 * Asset Class - Defines a category of financial instruments
 */
export interface AssetClass {
  asset_class_id: AssetClassId;
  name: string;
  description: string;
  supported_instrument_types: string[];
  validation_rules: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Exchange - Trading venue where instruments are traded
 */
export interface Exchange {
  exchange_id: string; // UUID
  name: string;
  mic_code?: string; // Market Identifier Code (ISO 10383)
  country: string;
  timezone: string;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE';
  trading_sessions?: TradingSession[];
  created_at: string;
  updated_at: string;
}

/**
 * Trading Session - Defines trading hours for an exchange
 */
export interface TradingSession {
  session_id: string;
  name: string; // e.g., "Regular Trading", "Pre-Market"
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  timezone: string;
  days_of_week: number[]; // 0=Sunday, 6=Saturday
}

/**
 * Issuer - Entity that issues securities (for equities, bonds)
 */
export interface Issuer {
  issuer_id: string; // UUID
  name: string;
  country: string;
  sector?: string;
  industry?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Instrument - Universal financial instrument with stable ID
 */
export interface Instrument {
  instrument_id: string; // UUID - STABLE PRIMARY KEY
  asset_class_id: AssetClassId;
  instrument_type: string; // e.g., "COMMON_STOCK", "FUTURE", "SPOT"
  primary_symbol: string; // Current primary ticker/symbol
  instrument_name: string;
  exchange_id: string;
  currency: string;
  country: string;
  issuer_id?: string; // For equities, bonds
  
  // Status & Lifecycle
  status: InstrumentStatus;
  effective_from: string; // ISO date
  effective_to?: string; // ISO date (null if still active)
  
  // Data Governance
  data_verification_status: DataVerificationStatus;
  data_source_id?: string;
  
  // Instrument-Specific Metadata
  tick_size?: number;
  lot_size?: number;
  contract_multiplier?: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Instrument Identifier - Multiple identifiers for the same instrument
 */
export interface InstrumentIdentifier {
  identifier_id: string; // UUID
  instrument_id: string; // FK to Instrument
  identifier_type: IdentifierType;
  identifier_value: string;
  source?: string; // e.g., "IDX", "Bloomberg", "Reuters"
  valid_from?: string; // ISO date
  valid_to?: string; // ISO date (null if still valid)
  created_at: string;
}

/**
 * Instrument Status History - Tracks all status changes
 */
export interface InstrumentStatusHistory {
  history_id: string; // UUID
  instrument_id: string; // FK to Instrument
  status: InstrumentStatus;
  effective_from: string; // ISO date
  effective_to?: string; // ISO date
  reason?: string;
  created_at: string;
}

/**
 * Corporate Action - Events that affect instruments
 */
export interface CorporateAction {
  action_id: string; // UUID
  instrument_id: string; // FK to Instrument
  action_type: CorporateActionType;
  announcement_date: string; // ISO date
  ex_date: string; // ISO date
  effective_date: string; // ISO date
  adjustment_factor?: number; // e.g., 2.0 for 2:1 split
  description: string;
  created_at: string;
}

/**
 * Data Source - Registry of data providers
 */
export interface DataSource {
  source_id: string; // UUID
  source_name: string;
  source_url?: string;
  access_method: 'API' | 'WEB_SCRAPING' | 'CSV_DOWNLOAD' | 'MANUAL';
  license_status: DataVerificationStatus;
  attribution_required: boolean;
  storage_permission: boolean;
  redistribution_permission: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// SEARCH & FILTER TYPES
// ============================================================================

export interface InstrumentSearchFilters {
  symbol?: string;
  name?: string;
  asset_class_id?: AssetClassId;
  exchange_id?: string;
  country?: string;
  status?: InstrumentStatus;
  data_verification_status?: DataVerificationStatus;
}

export interface InstrumentSearchResult {
  instruments: Instrument[];
  total: number;
  page: number;
  page_size: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
