import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateRealizedVolatility,
  calculateCorrelation,
  calculateBeta,
  type PriceData,
} from './dataService';

describe('dataService', () => {
  describe('calculateRealizedVolatility', () => {
    it('should calculate realized volatility correctly', () => {
      const prices: PriceData[] = [
        { timestamp: 1, date: '2024-01-01', open: 100, high: 105, low: 95, close: 100, volume: 1000 },
        { timestamp: 2, date: '2024-01-02', open: 100, high: 103, low: 97, close: 102, volume: 1000 },
        { timestamp: 3, date: '2024-01-03', open: 102, high: 106, low: 100, close: 104, volume: 1000 },
        { timestamp: 4, date: '2024-01-04', open: 104, high: 107, low: 102, close: 105, volume: 1000 },
        { timestamp: 5, date: '2024-01-05', open: 105, high: 108, low: 103, close: 107, volume: 1000 },
      ];

      const volatility = calculateRealizedVolatility(prices, 3);

      expect(volatility).toHaveLength(5);
      expect(volatility[0]).toBe(0); // First element is always 0
      expect(volatility[1]).toBe(0); // Second element is 0 (window not complete)
      expect(volatility[2]).toBeGreaterThan(0); // Third element should have volatility
    });

    it('should return zeros for insufficient data', () => {
      const prices: PriceData[] = [
        { timestamp: 1, date: '2024-01-01', open: 100, high: 105, low: 95, close: 100, volume: 1000 },
      ];

      const volatility = calculateRealizedVolatility(prices, 5);

      expect(volatility).toHaveLength(1);
      expect(volatility[0]).toBe(0);
    });

    it('should handle zero prices', () => {
      const prices: PriceData[] = [
        { timestamp: 1, date: '2024-01-01', open: 0, high: 0, low: 0, close: 0, volume: 1000 },
        { timestamp: 2, date: '2024-01-02', open: 0, high: 0, low: 0, close: 0, volume: 1000 },
        { timestamp: 3, date: '2024-01-03', open: 0, high: 0, low: 0, close: 0, volume: 1000 },
      ];

      const volatility = calculateRealizedVolatility(prices, 2);

      expect(volatility).toHaveLength(3);
    });
  });

  describe('calculateCorrelation', () => {
    it('should calculate perfect positive correlation', () => {
      const series1: PriceData[] = [
        { timestamp: 1, date: '2024-01-01', open: 100, high: 105, low: 95, close: 100, volume: 1000 },
        { timestamp: 2, date: '2024-01-02', open: 100, high: 105, low: 95, close: 110, volume: 1000 },
        { timestamp: 3, date: '2024-01-03', open: 110, high: 115, low: 105, close: 120, volume: 1000 },
      ];

      const series2: PriceData[] = [
        { timestamp: 1, date: '2024-01-01', open: 100, high: 105, low: 95, close: 100, volume: 1000 },
        { timestamp: 2, date: '2024-01-02', open: 100, high: 105, low: 95, close: 110, volume: 1000 },
        { timestamp: 3, date: '2024-01-03', open: 110, high: 115, low: 105, close: 120, volume: 1000 },
      ];

      const correlation = calculateCorrelation(series1, series2);

      expect(correlation).toBeCloseTo(1, 5);
    });

    it('should calculate perfect negative correlation', () => {
      const series1: PriceData[] = [
        { timestamp: 1, date: '2024-01-01', open: 100, high: 105, low: 95, close: 100, volume: 1000 },
        { timestamp: 2, date: '2024-01-02', open: 100, high: 105, low: 95, close: 110, volume: 1000 },
        { timestamp: 3, date: '2024-01-03', open: 110, high: 115, low: 105, close: 120, volume: 1000 },
      ];

      const series2: PriceData[] = [
        { timestamp: 1, date: '2024-01-01', open: 100, high: 105, low: 95, close: 120, volume: 1000 },
        { timestamp: 2, date: '2024-01-02', open: 120, high: 125, low: 115, close: 110, volume: 1000 },
        { timestamp: 3, date: '2024-01-03', open: 110, high: 115, low: 105, close: 100, volume: 1000 },
      ];

      const correlation = calculateCorrelation(series1, series2);

      expect(correlation).toBeCloseTo(-1, 5);
    });

    it('should return 0 for insufficient data', () => {
      const series1: PriceData[] = [
        { timestamp: 1, date: '2024-01-01', open: 100, high: 105, low: 95, close: 100, volume: 1000 },
      ];

      const series2: PriceData[] = [
        { timestamp: 1, date: '2024-01-01', open: 100, high: 105, low: 95, close: 100, volume: 1000 },
      ];

      const correlation = calculateCorrelation(series1, series2);

      expect(correlation).toBe(0);
    });
  });

  describe('calculateBeta', () => {
    it('should calculate beta correctly', () => {
      const assetReturns = [0.01, 0.02, -0.01, 0.03, 0.02];
      const benchmarkReturns = [0.005, 0.01, -0.005, 0.015, 0.01];

      const beta = calculateBeta(assetReturns, benchmarkReturns);

      expect(beta).toBeGreaterThan(0);
      expect(beta).toBeCloseTo(2, 0); // Asset moves 2x the benchmark
    });

    it('should handle different length arrays', () => {
      const assetReturns = [0.01, 0.02, -0.01];
      const benchmarkReturns = [0.005, 0.01, -0.005, 0.015, 0.01];

      const beta = calculateBeta(assetReturns, benchmarkReturns);

      expect(typeof beta).toBe('number');
    });

    it('should return 0 for zero variance benchmark', () => {
      const assetReturns = [0.01, 0.02, 0.03];
      const benchmarkReturns = [0.01, 0.01, 0.01];

      const beta = calculateBeta(assetReturns, benchmarkReturns);

      expect(beta).toBe(0);
    });
  });
});
