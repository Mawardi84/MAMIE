// Real-time data fetching services for XAU/USD research
// Using free public APIs

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

export interface MacroData {
  date: string;
  value: number;
}

// Yahoo Finance API for Gold prices
export async function fetchGoldPriceData(
  symbol: string = 'GC=F',
  range: string = '1mo',
  interval: string = '1d'
): Promise<PriceData[]> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }
    
    const data = await response.json();
    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    
    return timestamps.map((timestamp: number, index: number) => ({
      timestamp,
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      open: quotes.open[index] || 0,
      high: quotes.high[index] || 0,
      low: quotes.low[index] || 0,
      close: quotes.close[index] || 0,
      volume: quotes.volume[index] || 0,
    })).filter((d: PriceData) => d.close > 0);
  } catch (error) {
    console.error('Error fetching gold price data:', error);
    throw error;
  }
}

// Fetch real-time gold spot price
export async function fetchGoldSpotPrice(): Promise<{ price: number; change: number; changePercent: number }> {
  try {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/XAUUSD=X?interval=1m&range=1d';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const result = data.chart.result[0];
    const meta = result.meta;
    const quotes = result.indicators.quote[0];
    
    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose || meta.previousClose;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    return {
      price: currentPrice,
      change,
      changePercent,
    };
  } catch (error) {
    console.error('Error fetching gold spot price:', error);
    throw error;
  }
}

// CFTC COT Reports API
export async function fetchCOTData(
  commodity: string = 'GOLD',
  limit: number = 52
): Promise<COTData[]> {
  try {
    // CFTC public reporting API
    const url = `https://publicreporting.cftc.gov/resource/6dca-aqww.json?$where=commodity=%27${commodity}%27&$limit=${limit}&$order=report_date_as_yyyymmdd+DESC`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`CFTC API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      date: item.report_date_as_yyyymmdd,
      reportType: item.report_type_description,
      marketAndExchangeNames: item.market_and_exchange_names,
      nonCommercialLong: parseInt(item.noncomm_positions_long_all) || 0,
      nonCommercialShort: parseInt(item.noncomm_positions_short_all) || 0,
      nonCommercialSpreading: parseInt(item.noncomm_position_spreading) || 0,
      commercialLong: parseInt(item.comm_positions_long_all) || 0,
      commercialShort: parseInt(item.comm_positions_short_all) || 0,
      commercialSpreading: parseInt(item.comm_position_spreading) || 0,
      totalLong: parseInt(item.tot_report_positions_long) || 0,
      totalShort: parseInt(item.tot_report_positions_short) || 0,
    }));
  } catch (error) {
    console.error('Error fetching COT data:', error);
    throw error;
  }
}

// FRED API for macroeconomic data (requires free API key)
export async function fetchFREDData(
  seriesId: string,
  apiKey: string = 'DEMO_KEY'
): Promise<MacroData[]> {
  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=100`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.observations
      .filter((obs: any) => obs.value !== '.')
      .map((obs: any) => ({
        date: obs.date,
        value: parseFloat(obs.value),
      }));
  } catch (error) {
    console.error('Error fetching FRED data:', error);
    throw error;
  }
}

// Fetch DXY (US Dollar Index)
export async function fetchDXYData(range: string = '1mo'): Promise<PriceData[]> {
  return fetchGoldPriceData('DX-Y.NYB', range, '1d');
}

// Fetch VIX (Volatility Index)
export async function fetchVIXData(range: string = '1mo'): Promise<PriceData[]> {
  return fetchGoldPriceData('^VIX', range, '1d');
}

// Fetch US 10-Year Treasury Yield
export async function fetchUS10YData(range: string = '1mo'): Promise<PriceData[]> {
  return fetchGoldPriceData('^TNX', range, '1d');
}

// Fetch Silver prices for correlation analysis
export async function fetchSilverData(range: string = '1mo'): Promise<PriceData[]> {
  return fetchGoldPriceData('SI=F', range, '1d');
}

// Calculate realized volatility
export function calculateRealizedVolatility(prices: PriceData[], window: number = 20): number[] {
  const returns: number[] = [];
  
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i].close / prices[i - 1].close));
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
    const dailyVol = Math.sqrt(variance);
    const annualizedVol = dailyVol * Math.sqrt(252) * 100;
    
    volatility.push(annualizedVol);
  }
  
  return volatility;
}

// Calculate correlation between two price series
export function calculateCorrelation(series1: PriceData[], series2: PriceData[]): number {
  const returns1 = series1.slice(1).map((p, i) => Math.log(p.close / series1[i].close));
  const returns2 = series2.slice(1).map((p, i) => Math.log(p.close / series2[i].close));
  
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
  
  return numerator / Math.sqrt(denom1 * denom2);
}

// Cache utility
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
