import { describe, it, expect } from 'vitest';
import {
  ASSETS,
  ASSET_CATEGORIES,
  getAssetBySymbol,
  getAssetsByCategory,
  getCOTCommodity,
  getAssetsWithCOT,
  getTopAssets,
} from '../data/assetRegistry';

describe('assetRegistry', () => {
  describe('ASSETS', () => {
    it('should have at least 60 assets', () => {
      expect(ASSETS.length).toBeGreaterThanOrEqual(60);
    });

    it('should have all required properties', () => {
      ASSETS.forEach((asset) => {
        expect(asset).toHaveProperty('symbol');
        expect(asset).toHaveProperty('name');
        expect(asset).toHaveProperty('shortName');
        expect(asset).toHaveProperty('category');
        expect(asset).toHaveProperty('currency');
        expect(asset).toHaveProperty('exchange');
        expect(asset).toHaveProperty('hasCOT');
        expect(asset).toHaveProperty('tradingHours');
        expect(asset).toHaveProperty('tickSize');
      });
    });

    it('should have unique symbols', () => {
      const symbols = ASSETS.map((a) => a.symbol);
      const uniqueSymbols = new Set(symbols);
      expect(symbols.length).toBe(uniqueSymbols.size);
    });
  });

  describe('ASSET_CATEGORIES', () => {
    it('should have 7 categories', () => {
      expect(Object.keys(ASSET_CATEGORIES)).toHaveLength(7);
    });

    it('should include all required categories', () => {
      expect(ASSET_CATEGORIES).toHaveProperty('metals');
      expect(ASSET_CATEGORIES).toHaveProperty('forex');
      expect(ASSET_CATEGORIES).toHaveProperty('crypto');
      expect(ASSET_CATEGORIES).toHaveProperty('commodities');
      expect(ASSET_CATEGORIES).toHaveProperty('indices');
      expect(ASSET_CATEGORIES).toHaveProperty('stocks');
      expect(ASSET_CATEGORIES).toHaveProperty('bonds');
    });

    it('should have required properties for each category', () => {
      Object.values(ASSET_CATEGORIES).forEach((category) => {
        expect(category).toHaveProperty('label');
        expect(category).toHaveProperty('icon');
        expect(category).toHaveProperty('color');
        expect(category).toHaveProperty('description');
      });
    });
  });

  describe('getAssetBySymbol', () => {
    it('should return asset for valid symbol', () => {
      const gold = getAssetBySymbol('GC=F');
      expect(gold).toBeDefined();
      expect(gold?.shortName).toBe('Gold');
    });

    it('should return undefined for invalid symbol', () => {
      const invalid = getAssetBySymbol('INVALID_SYMBOL');
      expect(invalid).toBeUndefined();
    });
  });

  describe('getAssetsByCategory', () => {
    it('should return assets for valid category', () => {
      const metals = getAssetsByCategory('metals');
      expect(metals.length).toBeGreaterThan(0);
      metals.forEach((asset) => {
        expect(asset.category).toBe('metals');
      });
    });

    it('should return empty array for invalid category', () => {
      const invalid = getAssetsByCategory('invalid' as any);
      expect(invalid).toEqual([]);
    });
  });

  describe('getCOTCommodity', () => {
    it('should return COT commodity for supported symbol', () => {
      const gold = getCOTCommodity('GC=F');
      expect(gold).toBe('GOLD');
    });

    it('should return null for unsupported symbol', () => {
      const invalid = getCOTCommodity('INVALID');
      expect(invalid).toBeNull();
    });
  });

  describe('getAssetsWithCOT', () => {
    it('should return only assets with COT data', () => {
      const assetsWithCOT = getAssetsWithCOT();
      expect(assetsWithCOT.length).toBeGreaterThan(0);
      assetsWithCOT.forEach((asset) => {
        expect(asset.hasCOT).toBe(true);
      });
    });
  });

  describe('getTopAssets', () => {
    it('should return requested number of top assets', () => {
      const top10 = getTopAssets(10);
      expect(top10).toHaveLength(10);
    });

    it('should return default 15 assets', () => {
      const top15 = getTopAssets();
      expect(top15).toHaveLength(15);
    });

    it('should return valid assets', () => {
      const top = getTopAssets(5);
      top.forEach((asset) => {
        expect(asset).toHaveProperty('symbol');
        expect(asset).toHaveProperty('name');
      });
    });
  });
});
