/**
 * MAMIE Instrument Registry API Abstraction Layer
 * PHASE 01: Core Platform & Universal Instrument Registry
 * 
 * This module provides an API abstraction layer that currently uses localStorage
 * but is designed to be easily replaced with a backend API in future phases.
 */

import * as registryService from './service';
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
  ApiResponse,
  InstrumentStatus,
} from './types';

// ============================================================================
// API CLIENT INTERFACE
// ============================================================================

/**
 * This interface defines the contract for the instrument registry API.
 * In PHASE 01, we use localStorage implementation.
 * In future phases, this can be replaced with HTTP API calls.
 */
export interface InstrumentRegistryApi {
  // Asset Classes
  getAssetClasses(): Promise<ApiResponse<AssetClass[]>>;
  getAssetClass(id: string): Promise<ApiResponse<AssetClass | undefined>>;
  
  // Exchanges
  getExchanges(): Promise<ApiResponse<Exchange[]>>;
  getExchange(id: string): Promise<ApiResponse<Exchange | undefined>>;
  
  // Issuers
  getIssuers(): Promise<ApiResponse<Issuer[]>>;
  getIssuer(id: string): Promise<ApiResponse<Issuer | undefined>>;
  
  // Instruments
  getInstruments(): Promise<ApiResponse<Instrument[]>>;
  getInstrument(id: string): Promise<ApiResponse<Instrument | undefined>>;
  getInstrumentBySymbol(symbol: string): Promise<ApiResponse<Instrument | undefined>>;
  searchInstruments(filters: InstrumentSearchFilters, page?: number, pageSize?: number): Promise<ApiResponse<InstrumentSearchResult>>;
  createInstrument(instrument: Omit<Instrument, 'instrument_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Instrument>>;
  updateInstrument(id: string, updates: Partial<Instrument>): Promise<ApiResponse<Instrument | undefined>>;
  updateInstrumentStatus(id: string, status: InstrumentStatus, reason?: string): Promise<ApiResponse<Instrument | undefined>>;
  
  // Identifiers
  getIdentifiersForInstrument(instrumentId: string): Promise<ApiResponse<InstrumentIdentifier[]>>;
  createIdentifier(identifier: Omit<InstrumentIdentifier, 'identifier_id' | 'created_at'>): Promise<ApiResponse<InstrumentIdentifier>>;
  
  // Status History
  getStatusHistoryForInstrument(instrumentId: string): Promise<ApiResponse<InstrumentStatusHistory[]>>;
  
  // Corporate Actions
  getCorporateActionsForInstrument(instrumentId: string): Promise<ApiResponse<CorporateAction[]>>;
  createCorporateAction(action: Omit<CorporateAction, 'action_id' | 'created_at'>): Promise<ApiResponse<CorporateAction>>;
  
  // Data Sources
  getDataSources(): Promise<ApiResponse<DataSource[]>>;
  getDataSource(id: string): Promise<ApiResponse<DataSource | undefined>>;
  
  // Initialization
  initializeRegistry(): Promise<ApiResponse<void>>;
}

// ============================================================================
// LOCAL STORAGE API IMPLEMENTATION
// ============================================================================

/**
 * Current implementation using localStorage.
 * This can be replaced with HTTP API calls in future phases.
 */
class LocalStorageApi implements InstrumentRegistryApi {
  // Asset Classes
  async getAssetClasses(): Promise<ApiResponse<AssetClass[]>> {
    try {
      const data = registryService.getAssetClasses();
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  async getAssetClass(id: string): Promise<ApiResponse<AssetClass | undefined>> {
    try {
      const data = registryService.getAssetClass(id as any);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  // Exchanges
  async getExchanges(): Promise<ApiResponse<Exchange[]>> {
    try {
      const data = registryService.getExchanges();
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  async getExchange(id: string): Promise<ApiResponse<Exchange | undefined>> {
    try {
      const data = registryService.getExchange(id);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  // Issuers
  async getIssuers(): Promise<ApiResponse<Issuer[]>> {
    try {
      const data = registryService.getIssuers();
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  async getIssuer(id: string): Promise<ApiResponse<Issuer | undefined>> {
    try {
      const data = registryService.getIssuer(id);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  // Instruments
  async getInstruments(): Promise<ApiResponse<Instrument[]>> {
    try {
      const data = registryService.getInstruments();
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  async getInstrument(id: string): Promise<ApiResponse<Instrument | undefined>> {
    try {
      const data = registryService.getInstrument(id);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  async getInstrumentBySymbol(symbol: string): Promise<ApiResponse<Instrument | undefined>> {
    try {
      const data = registryService.getInstrumentBySymbol(symbol);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  async searchInstruments(
    filters: InstrumentSearchFilters, 
    page: number = 1, 
    pageSize: number = 50
  ): Promise<ApiResponse<InstrumentSearchResult>> {
    try {
      const data = registryService.searchInstruments(filters, page, pageSize);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  async createInstrument(
    instrument: Omit<Instrument, 'instrument_id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<Instrument>> {
    try {
      const data = registryService.createInstrument(instrument);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  async updateInstrument(
    id: string, 
    updates: Partial<Instrument>
  ): Promise<ApiResponse<Instrument | undefined>> {
    try {
      const data = registryService.updateInstrument(id, updates);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  async updateInstrumentStatus(
    id: string, 
    status: InstrumentStatus, 
    reason?: string
  ): Promise<ApiResponse<Instrument | undefined>> {
    try {
      const data = registryService.updateInstrumentStatus(id, status, reason);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  // Identifiers
  async getIdentifiersForInstrument(instrumentId: string): Promise<ApiResponse<InstrumentIdentifier[]>> {
    try {
      const data = registryService.getIdentifiersForInstrument(instrumentId);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  async createIdentifier(
    identifier: Omit<InstrumentIdentifier, 'identifier_id' | 'created_at'>
  ): Promise<ApiResponse<InstrumentIdentifier>> {
    try {
      const data = registryService.createIdentifier(identifier);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  // Status History
  async getStatusHistoryForInstrument(instrumentId: string): Promise<ApiResponse<InstrumentStatusHistory[]>> {
    try {
      const data = registryService.getStatusHistoryForInstrument(instrumentId);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  // Corporate Actions
  async getCorporateActionsForInstrument(instrumentId: string): Promise<ApiResponse<CorporateAction[]>> {
    try {
      const data = registryService.getCorporateActionsForInstrument(instrumentId);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  async createCorporateAction(
    action: Omit<CorporateAction, 'action_id' | 'created_at'>
  ): Promise<ApiResponse<CorporateAction>> {
    try {
      const data = registryService.createCorporateAction(action);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  // Data Sources
  async getDataSources(): Promise<ApiResponse<DataSource[]>> {
    try {
      const data = registryService.getDataSources();
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  async getDataSource(id: string): Promise<ApiResponse<DataSource | undefined>> {
    try {
      const data = registryService.getDataSource(id);
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }

  // Initialization
  async initializeRegistry(): Promise<ApiResponse<void>> {
    try {
      registryService.initializeRegistry();
      return { success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString() 
      };
    }
  }
}

// ============================================================================
// API CLIENT INSTANCE
// ============================================================================

/**
 * Singleton API client instance.
 * In future phases, this can be replaced with an HTTP client.
 */
export const instrumentRegistryApi: InstrumentRegistryApi = new LocalStorageApi();
