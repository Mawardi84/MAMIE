/**
 * MAMIE Instrument Registry Service
 * PHASE 01: Core Platform & Universal Instrument Registry
 * 
 * This service provides CRUD operations for the instrument registry
 * with localStorage persistence and API abstraction for future backend migration.
 */

import { v4 as uuidv4 } from 'uuid';
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
  DataVerificationStatus,
  AssetClassId,
} from './types';

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  ASSET_CLASSES: 'mamie_asset_classes',
  EXCHANGES: 'mamie_exchanges',
  ISSUERS: 'mamie_issuers',
  INSTRUMENTS: 'mamie_instruments',
  IDENTIFIERS: 'mamie_identifiers',
  STATUS_HISTORY: 'mamie_status_history',
  CORPORATE_ACTIONS: 'mamie_corporate_actions',
  DATA_SOURCES: 'mamie_data_sources',
};

// ============================================================================
// STORAGE HELPERS
// ============================================================================

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
// ASSET CLASS OPERATIONS
// ============================================================================

export function getAssetClasses(): AssetClass[] {
  return loadFromStorage<AssetClass>(STORAGE_KEYS.ASSET_CLASSES);
}

export function getAssetClass(id: AssetClassId): AssetClass | undefined {
  const classes = getAssetClasses();
  return classes.find(ac => ac.asset_class_id === id);
}

export function createAssetClass(assetClass: Omit<AssetClass, 'created_at' | 'updated_at'>): AssetClass {
  const now = new Date().toISOString();
  const newAssetClass: AssetClass = {
    ...assetClass,
    created_at: now,
    updated_at: now,
  };
  
  const classes = getAssetClasses();
  classes.push(newAssetClass);
  saveToStorage(STORAGE_KEYS.ASSET_CLASSES, classes);
  
  return newAssetClass;
}

// ============================================================================
// EXCHANGE OPERATIONS
// ============================================================================

export function getExchanges(): Exchange[] {
  return loadFromStorage<Exchange>(STORAGE_KEYS.EXCHANGES);
}

export function getExchange(id: string): Exchange | undefined {
  const exchanges = getExchanges();
  return exchanges.find(e => e.exchange_id === id);
}

export function createExchange(exchange: Omit<Exchange, 'exchange_id' | 'created_at' | 'updated_at'>): Exchange {
  const now = new Date().toISOString();
  const newExchange: Exchange = {
    ...exchange,
    exchange_id: uuidv4(),
    created_at: now,
    updated_at: now,
  };
  
  const exchanges = getExchanges();
  exchanges.push(newExchange);
  saveToStorage(STORAGE_KEYS.EXCHANGES, exchanges);
  
  return newExchange;
}

// ============================================================================
// ISSUER OPERATIONS
// ============================================================================

export function getIssuers(): Issuer[] {
  return loadFromStorage<Issuer>(STORAGE_KEYS.ISSUERS);
}

export function getIssuer(id: string): Issuer | undefined {
  const issuers = getIssuers();
  return issuers.find(i => i.issuer_id === id);
}

export function createIssuer(issuer: Omit<Issuer, 'issuer_id' | 'created_at' | 'updated_at'>): Issuer {
  const now = new Date().toISOString();
  const newIssuer: Issuer = {
    ...issuer,
    issuer_id: uuidv4(),
    created_at: now,
    updated_at: now,
  };
  
  const issuers = getIssuers();
  issuers.push(newIssuer);
  saveToStorage(STORAGE_KEYS.ISSUERS, issuers);
  
  return newIssuer;
}

// ============================================================================
// INSTRUMENT OPERATIONS
// ============================================================================

export function getInstruments(): Instrument[] {
  return loadFromStorage<Instrument>(STORAGE_KEYS.INSTRUMENTS);
}

export function getInstrument(id: string): Instrument | undefined {
  const instruments = getInstruments();
  return instruments.find(i => i.instrument_id === id);
}

export function getInstrumentBySymbol(symbol: string): Instrument | undefined {
  const instruments = getInstruments();
  return instruments.find(i => i.primary_symbol === symbol);
}

export function createInstrument(instrument: Omit<Instrument, 'instrument_id' | 'created_at' | 'updated_at'>): Instrument {
  const now = new Date().toISOString();
  const newInstrument: Instrument = {
    ...instrument,
    instrument_id: uuidv4(),
    created_at: now,
    updated_at: now,
  };
  
  const instruments = getInstruments();
  instruments.push(newInstrument);
  saveToStorage(STORAGE_KEYS.INSTRUMENTS, instruments);
  
  // Create initial status history entry
  createStatusHistory({
    instrument_id: newInstrument.instrument_id,
    status: newInstrument.status,
    effective_from: newInstrument.effective_from,
    effective_to: newInstrument.effective_to,
  });
  
  return newInstrument;
}

export function updateInstrument(id: string, updates: Partial<Instrument>): Instrument | undefined {
  const instruments = getInstruments();
  const index = instruments.findIndex(i => i.instrument_id === id);
  
  if (index === -1) return undefined;
  
  const updated = {
    ...instruments[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  instruments[index] = updated;
  saveToStorage(STORAGE_KEYS.INSTRUMENTS, instruments);
  
  return updated;
}

export function updateInstrumentStatus(
  id: string, 
  newStatus: InstrumentStatus, 
  reason?: string
): Instrument | undefined {
  const instruments = getInstruments();
  const index = instruments.findIndex(i => i.instrument_id === id);
  
  if (index === -1) return undefined;
  
  const now = new Date().toISOString();
  const oldInstrument = instruments[index];
  
  // Close previous status history entry
  const history = getStatusHistory();
  const lastHistoryIndex = history
    .filter(h => h.instrument_id === id)
    .sort((a, b) => new Date(b.effective_from).getTime() - new Date(a.effective_from).getTime())
    .findIndex(h => !h.effective_to);
  
  if (lastHistoryIndex !== -1) {
    const historyIndex = history.findIndex(h => h.history_id === history[lastHistoryIndex].history_id);
    if (historyIndex !== -1) {
      history[historyIndex].effective_to = now;
      saveToStorage(STORAGE_KEYS.STATUS_HISTORY, history);
    }
  }
  
  // Update instrument
  const updated = {
    ...oldInstrument,
    status: newStatus,
    effective_to: now,
    updated_at: now,
  };
  
  instruments[index] = updated;
  saveToStorage(STORAGE_KEYS.INSTRUMENTS, instruments);
  
  // Create new status history entry
  createStatusHistory({
    instrument_id: id,
    status: newStatus,
    effective_from: now,
    reason,
  });
  
  return updated;
}

// ============================================================================
// INSTRUMENT IDENTIFIER OPERATIONS
// ============================================================================

export function getIdentifiers(): InstrumentIdentifier[] {
  return loadFromStorage<InstrumentIdentifier>(STORAGE_KEYS.IDENTIFIERS);
}

export function getIdentifiersForInstrument(instrumentId: string): InstrumentIdentifier[] {
  const identifiers = getIdentifiers();
  return identifiers.filter(id => id.instrument_id === instrumentId);
}

export function createIdentifier(identifier: Omit<InstrumentIdentifier, 'identifier_id' | 'created_at'>): InstrumentIdentifier {
  const newIdentifier: InstrumentIdentifier = {
    ...identifier,
    identifier_id: uuidv4(),
    created_at: new Date().toISOString(),
  };
  
  const identifiers = getIdentifiers();
  identifiers.push(newIdentifier);
  saveToStorage(STORAGE_KEYS.IDENTIFIERS, identifiers);
  
  return newIdentifier;
}

// ============================================================================
// STATUS HISTORY OPERATIONS
// ============================================================================

export function getStatusHistory(): InstrumentStatusHistory[] {
  return loadFromStorage<InstrumentStatusHistory>(STORAGE_KEYS.STATUS_HISTORY);
}

export function getStatusHistoryForInstrument(instrumentId: string): InstrumentStatusHistory[] {
  const history = getStatusHistory();
  return history
    .filter(h => h.instrument_id === instrumentId)
    .sort((a, b) => new Date(b.effective_from).getTime() - new Date(a.effective_from).getTime());
}

export function createStatusHistory(history: Omit<InstrumentStatusHistory, 'history_id' | 'created_at'>): InstrumentStatusHistory {
  const newHistory: InstrumentStatusHistory = {
    ...history,
    history_id: uuidv4(),
    created_at: new Date().toISOString(),
  };
  
  const histories = getStatusHistory();
  histories.push(newHistory);
  saveToStorage(STORAGE_KEYS.STATUS_HISTORY, histories);
  
  return newHistory;
}

// ============================================================================
// CORPORATE ACTION OPERATIONS
// ============================================================================

export function getCorporateActions(): CorporateAction[] {
  return loadFromStorage<CorporateAction>(STORAGE_KEYS.CORPORATE_ACTIONS);
}

export function getCorporateActionsForInstrument(instrumentId: string): CorporateAction[] {
  const actions = getCorporateActions();
  return actions
    .filter(a => a.instrument_id === instrumentId)
    .sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime());
}

export function createCorporateAction(action: Omit<CorporateAction, 'action_id' | 'created_at'>): CorporateAction {
  const newAction: CorporateAction = {
    ...action,
    action_id: uuidv4(),
    created_at: new Date().toISOString(),
  };
  
  const actions = getCorporateActions();
  actions.push(newAction);
  saveToStorage(STORAGE_KEYS.CORPORATE_ACTIONS, actions);
  
  return newAction;
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

// ============================================================================
// SEARCH & FILTER OPERATIONS
// ============================================================================

export function searchInstruments(
  filters: InstrumentSearchFilters,
  page: number = 1,
  pageSize: number = 50
): InstrumentSearchResult {
  let instruments = getInstruments();
  
  // Apply filters
  if (filters.symbol) {
    const symbolLower = filters.symbol.toLowerCase();
    instruments = instruments.filter(i => 
      i.primary_symbol.toLowerCase().includes(symbolLower)
    );
  }
  
  if (filters.name) {
    const nameLower = filters.name.toLowerCase();
    instruments = instruments.filter(i => 
      i.instrument_name.toLowerCase().includes(nameLower)
    );
  }
  
  if (filters.asset_class_id) {
    instruments = instruments.filter(i => i.asset_class_id === filters.asset_class_id);
  }
  
  if (filters.exchange_id) {
    instruments = instruments.filter(i => i.exchange_id === filters.exchange_id);
  }
  
  if (filters.country) {
    instruments = instruments.filter(i => i.country === filters.country);
  }
  
  if (filters.status) {
    instruments = instruments.filter(i => i.status === filters.status);
  }
  
  if (filters.data_verification_status) {
    instruments = instruments.filter(i => i.data_verification_status === filters.data_verification_status);
  }
  
  // Pagination
  const total = instruments.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedInstruments = instruments.slice(startIndex, startIndex + pageSize);
  
  return {
    instruments: paginatedInstruments,
    total,
    page,
    page_size: pageSize,
  };
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export function initializeDefaultAssetClasses(): void {
  const existing = getAssetClasses();
  if (existing.length > 0) return; // Already initialized
  
  const defaultClasses: Omit<AssetClass, 'created_at' | 'updated_at'>[] = [
    {
      asset_class_id: 'equity',
      name: 'Equity',
      description: 'Shares of ownership in a company',
      supported_instrument_types: ['COMMON_STOCK', 'PREFERRED_STOCK', 'ETF'],
      validation_rules: { requires_issuer: true, requires_exchange: true },
    },
    {
      asset_class_id: 'commodity',
      name: 'Commodity',
      description: 'Physical goods and raw materials',
      supported_instrument_types: ['FUTURE', 'SPOT', 'ETF'],
      validation_rules: { requires_exchange: true },
    },
    {
      asset_class_id: 'fx',
      name: 'Foreign Exchange',
      description: 'Currency pairs',
      supported_instrument_types: ['SPOT', 'FORWARD', 'FUTURE'],
      validation_rules: { requires_exchange: false },
    },
    {
      asset_class_id: 'crypto',
      name: 'Cryptocurrency',
      description: 'Digital assets using blockchain technology',
      supported_instrument_types: ['SPOT', 'FUTURE', 'TOKEN'],
      validation_rules: { requires_exchange: false },
    },
    {
      asset_class_id: 'fixed_income',
      name: 'Fixed Income',
      description: 'Debt securities and bonds',
      supported_instrument_types: ['BOND', 'TREASURY', 'CORPORATE_BOND'],
      validation_rules: { requires_issuer: true },
    },
    {
      asset_class_id: 'index',
      name: 'Index',
      description: 'Market indices and benchmarks',
      supported_instrument_types: ['INDEX', 'INDEX_FUTURE'],
      validation_rules: { requires_exchange: true },
    },
    {
      asset_class_id: 'derivative',
      name: 'Derivative',
      description: 'Financial contracts derived from underlying assets',
      supported_instrument_types: ['OPTION', 'FUTURE', 'SWAP'],
      validation_rules: { requires_exchange: true },
    },
  ];
  
  defaultClasses.forEach(ac => createAssetClass(ac));
}

export function initializeDefaultExchanges(): void {
  const existing = getExchanges();
  if (existing.length > 0) return;
  
  const defaultExchanges: Omit<Exchange, 'exchange_id' | 'created_at' | 'updated_at'>[] = [
    {
      name: 'Indonesia Stock Exchange',
      mic_code: 'XIDX',
      country: 'ID',
      timezone: 'Asia/Jakarta',
      currency: 'IDR',
      status: 'ACTIVE',
    },
    {
      name: 'New York Stock Exchange',
      mic_code: 'XNYS',
      country: 'US',
      timezone: 'America/New_York',
      currency: 'USD',
      status: 'ACTIVE',
    },
    {
      name: 'NASDAQ',
      mic_code: 'XNAS',
      country: 'US',
      timezone: 'America/New_York',
      currency: 'USD',
      status: 'ACTIVE',
    },
    {
      name: 'COMEX',
      mic_code: 'XCEC',
      country: 'US',
      timezone: 'America/New_York',
      currency: 'USD',
      status: 'ACTIVE',
    },
    {
      name: 'NYMEX',
      mic_code: 'XNYM',
      country: 'US',
      timezone: 'America/New_York',
      currency: 'USD',
      status: 'ACTIVE',
    },
    {
      name: 'ICE',
      mic_code: 'XICE',
      country: 'US',
      timezone: 'America/New_York',
      currency: 'USD',
      status: 'ACTIVE',
    },
    {
      name: 'CBOT',
      mic_code: 'XCBT',
      country: 'US',
      timezone: 'America/Chicago',
      currency: 'USD',
      status: 'ACTIVE',
    },
    {
      name: 'Forex Market',
      country: 'GLOBAL',
      timezone: 'UTC',
      currency: 'USD',
      status: 'ACTIVE',
    },
    {
      name: 'Crypto Market',
      country: 'GLOBAL',
      timezone: 'UTC',
      currency: 'USD',
      status: 'ACTIVE',
    },
  ];
  
  defaultExchanges.forEach(ex => createExchange(ex));
}

export function initializeRegistry(): void {
  initializeDefaultAssetClasses();
  initializeDefaultExchanges();
}
