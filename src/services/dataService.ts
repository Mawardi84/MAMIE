// Multi-Asset Data Fetching Service
// Supports: Metals, Forex, Crypto, Commodities, Indices, Stocks

import { getCOTCommodity, type Asset } from '../data/assetRegistry';

export interface PriceData {
  timestamp: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface COTData {
  date: string;
  reportType: string;
  marketAndExchangeNames: string;
  nonCommercialLong: number;
  nonCommercialShort: number;
  nonCommercialSpreading: number;
  commercialLong: number;
  commercialShort: number;
  commercialSpreading: number;
  totalLong: number;
  totalShort: number;
}

export interface AssetQuote {
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  previousClose: number;
  marketCap?: number;
  name: string;
  symbol: string;
}

// CORS Proxy fallback chain
const CORS_PROXIES = [
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

// Fetch with CORS proxy fallback
async function fetchWithProxy(url: string): Promise<Response> {
  // Try direct fetch first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) return response;
  } catch (e) {
    // CORS blocked or timeout, try proxies
  }

  // Try each CORS proxy
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    try {
      const proxyUrl = CORS_PROXIES[i](url);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) return response;
    } catch (e) {
      continue;
    }
  }

  throw new Error('All fetch attempts failed. Check internet connection or try again later.');
}

async function safeJson(response: Response): Promise<any> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('Invalid JSON response from API');
  }
}

// ============ GENERIC ASSET DATA FETCHING ============

// Fetch price history for ANY asset
export async function fetchAssetPriceData(
  symbol: string,
  range: string = '1mo',
  interval: string = '1d'
): Promise<PriceData[]> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
  const response = await fetchWithProxy(url);
  const data = await safeJson(response);

  if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
    throw new Error(`No data available for ${symbol}`);
  }

  const result = data.chart.result[0];
  const timestamps = result.timestamp;
  const quotes = result.indicators.quote[0];

  return timestamps
    .map((timestamp: number, index: number) => ({
      timestamp,
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      open: quotes.open[index] || 0,
      high: quotes.high[index] || 0,
      low: quotes.low[index] || 0,
      close: quotes.close[index] || 0,
      volume: quotes.volume[index] || 0,
    }))
    .filter((d: PriceData) => d.close > 0);
}

// Fetch real-time quote for ANY asset
export async function fetchAssetQuote(symbol: string): Promise<AssetQuote> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
  const response = await fetchWithProxy(url);
  const data = await safeJson(response);

  if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
    throw new Error(`No quote data for ${symbol}`);
  }

  const result = data.chart.result[0];
  const meta = result.meta;
  const quotes = result.indicators.quote[0];

  const closes = (quotes.close || []).filter((c: number | null) => c !== null);
  const currentPrice = closes[closes.length - 1] || meta.regularMarketPrice || 0;
  const previousClose = meta.chartPreviousClose || meta.previousClose || (closes.length > 1 ? closes[closes.length - 2] : currentPrice);

  const highs = (quotes.high || []).filter((h: number | null) => h !== null);
  const lows = (quotes.low || []).filter((l: number | null) => l !== null);
  const volumes = (quotes.volume || []).filter((v: number | null) => v !== null);

  const change = currentPrice - previousClose;
  const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

  return {
    price: currentPrice,
    change,
    changePercent,
    high: highs[highs.length - 1] || currentPrice,
    low: lows[lows.length - 1] || currentPrice,
    volume: volumes[volumes.length - 1] || 0,
    previousClose,
    marketCap: meta.marketCap,
    name: meta.longName || meta.shortName || meta.symbol || symbol,
    symbol: meta.symbol || symbol,
  };
}

// Fetch multiple quotes in parallel (for watchlist)
export async function fetchMultipleQuotes(symbols: string[]): Promise<Record<string, AssetQuote>> {
  const results = await Promise.allSettled(
    symbols.map(async (symbol) => {
      const quote = await fetchAssetQuote(symbol);
      return { symbol, quote };
    })
  );

  const quotesMap: Record<string, AssetQuote> = {};
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      quotesMap[result.value.symbol] = result.value.quote;
    }
  });

  return quotesMap;
}

// ============ COT DATA (Futures & Forex) ============

export async function fetchCOTData(
  commodity: string,
  limit: number = 52
): Promise<COTData[]> {
  const url = `https://publicreporting.cftc.gov/resource/6dca-aqww.json?$where=commodity=%27${encodeURIComponent(commodity)}%27&$limit=${limit}&$order=report_date_as_yyyymmdd+DESC`;
  const response = await fetchWithProxy(url);
  const data = await safeJson(response);

  return data.map((item: any) => ({
    date: item.report_date_as_yyyymmdd || item.report_date || '',
    reportType: item.report_type_description || 'Disaggregated',
    marketAndExchangeNames: item.market_and_exchange_names || commodity,
    nonCommercialLong: parseInt(item.noncomm_positions_long_all) || 0,
    nonCommercialShort: parseInt(item.noncomm_positions_short_all) || 0,
    nonCommercialSpreading: parseInt(item.noncomm_position_spreading) || 0,
    commercialLong: parseInt(item.comm_positions_long_all) || 0,
    commercialShort: parseInt(item.comm_positions_short_all) || 0,
    commercialSpreading: parseInt(item.comm_position_spreading) || 0,
    totalLong: parseInt(item.tot_report_positions_long) || 0,
    totalShort: parseInt(item.tot_report_positions_short) || 0,
  }));
}

// Fetch COT data for an asset (using asset registry mapping)
export async function fetchCOTForAsset(asset: Asset, limit: number = 52): Promise<COTData[] | null> {
  const commodity = getCOTCommodity(asset.symbol);
  if (!commodity) return null;
  
  try {
    return await fetchCOTData(commodity, limit);
  } catch (e) {
    return null;
  }
}

// ============ CROSS-ASSET ANALYSIS ============

// Calculate realized volatility for any asset
export function calculateRealizedVolatility(prices: PriceData[], window: number = 20): number[] {
  const returns: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    if (prices[i].close > 0 && prices[i - 1].close > 0) {
      returns.push(Math.log(prices[i].close / prices[i - 1].close));
    } else {
      returns.push(0);
    }
  }

  const volatility: number[] = [];

  for (let i = 0; i < returns.length; i++) {
    if (i < window - 1) {
      volatility.push(0);
      continue;
    }

    const windowReturns = returns.slice(i - window + 1, i + 1);
    const mean = windowReturns.reduce((a, b) => a + b, 0) / window;
    const variance = windowReturns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (window - 1);
    const dailyVol = Math.sqrt(Math.max(0, variance));
    const annualizedVol = dailyVol * Math.sqrt(252) * 100;

    volatility.push(annualizedVol);
  }

  return volatility;
}

// Calculate correlation between any two price series
export function calculateCorrelation(series1: PriceData[], series2: PriceData[]): number {
  if (series1.length < 2 || series2.length < 2) return 0;

  const returns1 = series1.slice(1).map((p, i) =>
    p.close > 0 && series1[i].close > 0 ? Math.log(p.close / series1[i].close) : 0
  );
  const returns2 = series2.slice(1).map((p, i) =>
    p.close > 0 && series2[i].close > 0 ? Math.log(p.close / series2[i].close) : 0
  );

  const n = Math.min(returns1.length, returns2.length);
  const r1 = returns1.slice(0, n);
  const r2 = returns2.slice(0, n);

  const mean1 = r1.reduce((a, b) => a + b, 0) / n;
  const mean2 = r2.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denom1 = 0;
  let denom2 = 0;

  for (let i = 0; i < n; i++) {
    const diff1 = r1[i] - mean1;
    const diff2 = r2[i] - mean2;
    numerator += diff1 * diff2;
    denom1 += diff1 * diff1;
    denom2 += diff2 * diff2;
  }

  const denominator = Math.sqrt(denom1 * denom2);
  return denominator === 0 ? 0 : numerator / denominator;
}

// Calculate beta relative to a benchmark
export function calculateBeta(assetReturns: number[], benchmarkReturns: number[]): number {
  const n = Math.min(assetReturns.length, benchmarkReturns.length);
  const a = assetReturns.slice(0, n);
  const b = benchmarkReturns.slice(0, n);

  const meanA = a.reduce((x, y) => x + y, 0) / n;
  const meanB = b.reduce((x, y) => x + y, 0) / n;

  let covariance = 0;
  let varianceB = 0;

  for (let i = 0; i < n; i++) {
    covariance += (a[i] - meanA) * (b[i] - meanB);
    varianceB += (b[i] - meanB) * (b[i] - meanB);
  }

  return varianceB === 0 ? 0 : covariance / varianceB;
}

// Calculate relative performance (ratio)
export function calculateRelativePerformance(
  asset1: PriceData[],
  asset2: PriceData[]
): { date: string; ratio: number }[] {
  const n = Math.min(asset1.length, asset2.length);
  const result: { date: string; ratio: number }[] = [];

  for (let i = 0; i < n; i++) {
    const idx1 = asset1.length - n + i;
    const idx2 = asset2.length - n + i;
    if (asset1[idx1].close > 0 && asset2[idx2].close > 0) {
      result.push({
        date: asset1[idx1].date,
        ratio: asset1[idx1].close / asset2[idx2].close,
      });
    }
  }

  return result;
}

// ============ CACHING ============

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  duration: number = CACHE_DURATION
): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && now - cached.timestamp < duration) {
    return cached.data as T;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: now });

  return data;
}

// Test connection
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetchAssetQuote('GC=F');
    return {
      success: true,
      message: `Connected! Gold: $${response.price.toFixed(2)}`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}
