/**
 * MAMIE Instrument Registry Tests
 * PHASE 01: Core Platform & Universal Instrument Registry
 * 
 * Test cases covering:
 * 1. Unique instrument ID
 * 2. Duplicate ticker pada exchange berbeda
 * 3. Historical ticker mapping
 * 4. IPO status
 * 5. Delisted status
 * 6. Suspended status
 * 7. Asset class validation
 * 8. Exchange mapping
 * 9. Effective date validation
 * 10. Instrument search
 * 11. Instrument filtering
 * 12. Corporate action metadata validation
 * 13. Data verification status
 * 14. Existing module compatibility
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createInstrument,
  getInstrument,
  getInstrumentBySymbol,
  updateInstrumentStatus,
  createIdentifier,
  getIdentifiersForInstrument,
  getStatusHistoryForInstrument,
  createCorporateAction,
  getCorporateActionsForInstrument,
  searchInstruments,
  initializeRegistry,
  getAssetClasses,
  getExchanges,
} from '../service';
import { InstrumentStatus, DataVerificationStatus, AssetClassId } from '../types';

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
  initializeRegistry();
});

describe('Instrument Registry - PHASE 01 Tests', () => {
  // Test 1: Unique instrument ID
  describe('Test 1: Unique Instrument ID', () => {
    it('should generate unique UUID for each instrument', () => {
      const instrument1 = createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'TEST1',
        instrument_name: 'Test Company 1',
        exchange_id: 'test-exchange',
        currency: 'USD',
        country: 'US',
        status: 'ACTIVE',
        effective_from: '2024-01-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      const instrument2 = createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'TEST2',
        instrument_name: 'Test Company 2',
        exchange_id: 'test-exchange',
        currency: 'USD',
        country: 'US',
        status: 'ACTIVE',
        effective_from: '2024-01-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      expect(instrument1.instrument_id).toBeDefined();
      expect(instrument2.instrument_id).toBeDefined();
      expect(instrument1.instrument_id).not.toBe(instrument2.instrument_id);
      expect(instrument1.instrument_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  // Test 2: Duplicate ticker pada exchange berbeda
  describe('Test 2: Duplicate Ticker on Different Exchanges', () => {
    it('should allow same ticker on different exchanges', () => {
      const instrument1 = createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'ABC',
        instrument_name: 'Company ABC on NYSE',
        exchange_id: 'nyse',
        currency: 'USD',
        country: 'US',
        status: 'ACTIVE',
        effective_from: '2024-01-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      const instrument2 = createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'ABC',
        instrument_name: 'Company ABC on IDX',
        exchange_id: 'idx',
        currency: 'IDR',
        country: 'ID',
        status: 'ACTIVE',
        effective_from: '2024-01-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      expect(instrument1.instrument_id).not.toBe(instrument2.instrument_id);
      expect(instrument1.primary_symbol).toBe('ABC');
      expect(instrument2.primary_symbol).toBe('ABC');
      expect(instrument1.exchange_id).toBe('nyse');
      expect(instrument2.exchange_id).toBe('idx');
    });
  });

  // Test 3: Historical ticker mapping
  describe('Test 3: Historical Ticker Mapping', () => {
    it('should support multiple identifiers for same instrument', () => {
      const instrument = createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'NEW_TICKER',
        instrument_name: 'Company with ticker change',
        exchange_id: 'idx',
        currency: 'IDR',
        country: 'ID',
        status: 'ACTIVE',
        effective_from: '2024-01-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      // Add old ticker as identifier
      const oldTickerId = createIdentifier({
        instrument_id: instrument.instrument_id,
        identifier_type: 'TICKER',
        identifier_value: 'OLD_TICKER',
        valid_from: '2020-01-01',
        valid_to: '2023-12-31',
      });

      // Add ISIN
      const isinId = createIdentifier({
        instrument_id: instrument.instrument_id,
        identifier_type: 'ISIN',
        identifier_value: 'ID1234567890',
      });

      const identifiers = getIdentifiersForInstrument(instrument.instrument_id);
      expect(identifiers).toHaveLength(2);
      expect(identifiers.find(i => i.identifier_value === 'OLD_TICKER')).toBeDefined();
      expect(identifiers.find(i => i.identifier_value === 'ID1234567890')).toBeDefined();
    });
  });

  // Test 4: IPO status
  describe('Test 4: IPO Status', () => {
    it('should support IPO status', () => {
      const instrument = createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'IPO_CO',
        instrument_name: 'Newly IPO Company',
        exchange_id: 'idx',
        currency: 'IDR',
        country: 'ID',
        status: 'IPO',
        effective_from: '2024-06-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      expect(instrument.status).toBe('IPO');
      
      const history = getStatusHistoryForInstrument(instrument.instrument_id);
      expect(history).toHaveLength(1);
      expect(history[0].status).toBe('IPO');
    });
  });

  // Test 5: Delisted status
  describe('Test 5: Delisted Status', () => {
    it('should track status change to DELISTED', () => {
      const instrument = createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'DELISTED_CO',
        instrument_name: 'Delisted Company',
        exchange_id: 'idx',
        currency: 'IDR',
        country: 'ID',
        status: 'ACTIVE',
        effective_from: '2020-01-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      const updated = updateInstrumentStatus(
        instrument.instrument_id,
        'DELISTED',
        'Voluntary delisting'
      );

      expect(updated).toBeDefined();
      expect(updated?.status).toBe('DELISTED');
      
      const history = getStatusHistoryForInstrument(instrument.instrument_id);
      expect(history).toHaveLength(2);
      expect(history[0].status).toBe('DELISTED');
      expect(history[1].status).toBe('ACTIVE');
    });
  });

  // Test 6: Suspended status
  describe('Test 6: Suspended Status', () => {
    it('should track status change to SUSPENDED', () => {
      const instrument = createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'SUSPENDED_CO',
        instrument_name: 'Suspended Company',
        exchange_id: 'idx',
        currency: 'IDR',
        country: 'ID',
        status: 'ACTIVE',
        effective_from: '2020-01-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      const updated = updateInstrumentStatus(
        instrument.instrument_id,
        'SUSPENDED',
        'Regulatory suspension'
      );

      expect(updated).toBeDefined();
      expect(updated?.status).toBe('SUSPENDED');
      
      const history = getStatusHistoryForInstrument(instrument.instrument_id);
      expect(history).toHaveLength(2);
      expect(history[0].status).toBe('SUSPENDED');
    });
  });

  // Test 7: Asset class validation
  describe('Test 7: Asset Class Validation', () => {
    it('should have default asset classes initialized', () => {
      const assetClasses = getAssetClasses();
      expect(assetClasses.length).toBeGreaterThan(0);
      
      const equity = assetClasses.find((ac: any) => ac.asset_class_id === 'equity');
      expect(equity).toBeDefined();
      expect(equity?.name).toBe('Equity');
      
      const commodity = assetClasses.find((ac: any) => ac.asset_class_id === 'commodity');
      expect(commodity).toBeDefined();
    });
  });

  // Test 8: Exchange mapping
  describe('Test 8: Exchange Mapping', () => {
    it('should have default exchanges initialized', () => {
      const exchanges = getExchanges();
      expect(exchanges.length).toBeGreaterThan(0);
      
      const idx = exchanges.find((ex: any) => ex.mic_code === 'XIDX');
      expect(idx).toBeDefined();
      expect(idx?.name).toBe('Indonesia Stock Exchange');
    });
  });

  // Test 9: Effective date validation
  describe('Test 9: Effective Date Validation', () => {
    it('should store effective_from and effective_to dates', () => {
      const instrument = createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'DATE_TEST',
        instrument_name: 'Date Test Company',
        exchange_id: 'idx',
        currency: 'IDR',
        country: 'ID',
        status: 'ACTIVE',
        effective_from: '2020-01-01',
        effective_to: '2023-12-31',
        data_verification_status: 'NOT_VERIFIED',
      });

      expect(instrument.effective_from).toBe('2020-01-01');
      expect(instrument.effective_to).toBe('2023-12-31');
    });
  });

  // Test 10: Instrument search
  describe('Test 10: Instrument Search', () => {
    it('should search instruments by symbol', () => {
      createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'SEARCH_TEST',
        instrument_name: 'Search Test Company',
        exchange_id: 'idx',
        currency: 'IDR',
        country: 'ID',
        status: 'ACTIVE',
        effective_from: '2024-01-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      const result = searchInstruments({ symbol: 'SEARCH' });
      expect(result.total).toBeGreaterThan(0);
      expect(result.instruments[0].primary_symbol).toBe('SEARCH_TEST');
    });
  });

  // Test 11: Instrument filtering
  describe('Test 11: Instrument Filtering', () => {
    it('should filter instruments by asset class', () => {
      createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'EQUITY1',
        instrument_name: 'Equity Company',
        exchange_id: 'idx',
        currency: 'IDR',
        country: 'ID',
        status: 'ACTIVE',
        effective_from: '2024-01-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      createInstrument({
        asset_class_id: 'commodity',
        instrument_type: 'FUTURE',
        primary_symbol: 'COMMODITY1',
        instrument_name: 'Commodity Future',
        exchange_id: 'cme',
        currency: 'USD',
        country: 'US',
        status: 'ACTIVE',
        effective_from: '2024-01-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      const equityResult = searchInstruments({ asset_class_id: 'equity' });
      expect(equityResult.instruments.every((i: any) => i.asset_class_id === 'equity')).toBe(true);

      const commodityResult = searchInstruments({ asset_class_id: 'commodity' });
      expect(commodityResult.instruments.every((i: any) => i.asset_class_id === 'commodity')).toBe(true);
    });
  });

  // Test 12: Corporate action metadata validation
  describe('Test 12: Corporate Action Metadata Validation', () => {
    it('should store corporate action metadata', () => {
      const instrument = createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'CORP_ACTION',
        instrument_name: 'Corporate Action Test',
        exchange_id: 'idx',
        currency: 'IDR',
        country: 'ID',
        status: 'ACTIVE',
        effective_from: '2020-01-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      const action = createCorporateAction({
        instrument_id: instrument.instrument_id,
        action_type: 'STOCK_SPLIT',
        announcement_date: '2024-01-01',
        ex_date: '2024-01-15',
        effective_date: '2024-01-20',
        adjustment_factor: 2.0,
        description: '2:1 stock split',
      });

      expect(action.action_id).toBeDefined();
      expect(action.action_type).toBe('STOCK_SPLIT');
      expect(action.adjustment_factor).toBe(2.0);

      const actions = getCorporateActionsForInstrument(instrument.instrument_id);
      expect(actions).toHaveLength(1);
    });
  });

  // Test 13: Data verification status
  describe('Test 13: Data Verification Status', () => {
    it('should track data verification status', () => {
      const instrument = createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'VERIFY_TEST',
        instrument_name: 'Verification Test',
        exchange_id: 'idx',
        currency: 'IDR',
        country: 'ID',
        status: 'ACTIVE',
        effective_from: '2024-01-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      expect(instrument.data_verification_status).toBe('NOT_VERIFIED');

      const updated = getInstrument(instrument.instrument_id);
      expect(updated?.data_verification_status).toBe('NOT_VERIFIED');
    });
  });

  // Test 14: Existing module compatibility
  describe('Test 14: Existing Module Compatibility', () => {
    it('should not break existing Asset interface usage', () => {
      // This test ensures that the new Instrument Registry
      // does not break the existing Asset interface used by other modules
      
      const instrument = createInstrument({
        asset_class_id: 'equity',
        instrument_type: 'COMMON_STOCK',
        primary_symbol: 'COMPAT_TEST',
        instrument_name: 'Compatibility Test',
        exchange_id: 'idx',
        currency: 'IDR',
        country: 'ID',
        status: 'ACTIVE',
        effective_from: '2024-01-01',
        data_verification_status: 'NOT_VERIFIED',
      });

      // Instrument should have all required fields
      expect(instrument.instrument_id).toBeDefined();
      expect(instrument.primary_symbol).toBe('COMPAT_TEST');
      expect(instrument.instrument_name).toBe('Compatibility Test');
      expect(instrument.asset_class_id).toBe('equity');
      expect(instrument.status).toBe('ACTIVE');
    });
  });
});
