// Sample realistic market data for demo purposes
// This data simulates real market behavior for testing and demonstration

export interface SampleDataPoint {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Generate realistic OHLCV data
function generateRealisticData(
  basePrice: number,
  volatility: number,
  days: number,
  trend: 'up' | 'down' | 'sideways' = 'sideways'
): SampleDataPoint[] {
  const data: SampleDataPoint[] = [];
  let currentPrice = basePrice;
  const now = Math.floor(Date.now() / 1000);
  const dayInSeconds = 86400;

  for (let i = days; i >= 0; i--) {
    const time = now - i * dayInSeconds;
    
    // Calculate daily change based on trend
    let trendBias = 0;
    if (trend === 'up') trendBias = 0.001;
    else if (trend === 'down') trendBias = -0.001;
    
    // Add randomness with volatility
    const change = (Math.random() - 0.5 + trendBias) * volatility;
    const open = currentPrice;
    const close = open * (1 + change);
    
    // Generate high and low
    const range = Math.abs(close - open) + open * volatility * 0.5;
    const high = Math.max(open, close) + Math.random() * range * 0.5;
    const low = Math.min(open, close) - Math.random() * range * 0.5;
    
    // Generate realistic volume
    const baseVolume = 1000000 + Math.random() * 5000000;
    const volume = Math.floor(baseVolume * (1 + Math.abs(change) * 10));
    
    data.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });
    
    currentPrice = close;
  }
  
  return data;
}

// Sample data for different assets
export const SAMPLE_DATA = {
  // Gold (XAU/USD) - Uptrend
  GOLD: generateRealisticData(2650, 0.015, 365, 'up'),
  
  // Bitcoin (BTC/USD) - Volatile uptrend
  BITCOIN: generateRealisticData(95000, 0.035, 365, 'up'),
  
  // EUR/USD - Sideways
  EURUSD: generateRealisticData(1.0850, 0.005, 365, 'sideways'),
  
  // S&P 500 - Uptrend
  SP500: generateRealisticData(5800, 0.012, 365, 'up'),
  
  // Crude Oil - Down trend
  OIL: generateRealisticData(72, 0.025, 365, 'down'),
  
  // Silver - Volatile
  SILVER: generateRealisticData(31, 0.028, 365, 'sideways'),
};

// Get current quote for an asset
export function getCurrentQuote(symbol: string): {
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
} {
  const data = SAMPLE_DATA[symbol as keyof typeof SAMPLE_DATA] || SAMPLE_DATA.GOLD;
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  
  const change = latest.close - previous.close;
  const changePercent = (change / previous.close) * 100;
  
  // Calculate 24h high/low
  const last24h = data.slice(-1);
  const high = Math.max(...last24h.map(d => d.high));
  const low = Math.min(...last24h.map(d => d.low));
  
  return {
    price: latest.close,
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    volume: latest.volume,
  };
}

// Get historical data for chart
export function getHistoricalData(symbol: string, days: number = 365): SampleDataPoint[] {
  const data = SAMPLE_DATA[symbol as keyof typeof SAMPLE_DATA] || SAMPLE_DATA.GOLD;
  return data.slice(-days);
}

// Get multiple quotes
export function getMultipleQuotes(symbols: string[]): Record<string, any> {
  const quotes: Record<string, any> = {};
  
  symbols.forEach(symbol => {
    const quote = getCurrentQuote(symbol);
    quotes[symbol] = {
      symbol,
      ...quote,
      name: getAssetName(symbol),
    };
  });
  
  return quotes;
}

// Get asset name
function getAssetName(symbol: string): string {
  const names: Record<string, string> = {
    GOLD: 'Gold (XAU/USD)',
    BITCOIN: 'Bitcoin (BTC/USD)',
    EURUSD: 'EUR/USD',
    SP500: 'S&P 500',
    OIL: 'Crude Oil (WTI)',
    SILVER: 'Silver (XAG/USD)',
  };
  
  return names[symbol] || symbol;
}

// Calculate technical indicators
export function calculateSMA(data: SampleDataPoint[], period: number): number[] {
  const sma: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(0);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
      sma.push(sum / period);
    }
  }
  
  return sma;
}

export function calculateEMA(data: SampleDataPoint[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
    ema.push(0);
  }
  ema[period - 1] = sum / period;
  
  // Calculate rest
  for (let i = period; i < data.length; i++) {
    const emaValue = (data[i].close - ema[i - 1]) * multiplier + ema[i - 1];
    ema.push(emaValue);
  }
  
  return ema;
}

export function calculateRSI(data: SampleDataPoint[], period: number = 14): number[] {
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
    
    if (i < period) {
      rsi.push(0);
    } else if (i === period) {
      const avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    } else {
      const prevRSI = rsi[i - 1];
      const avgGain = (gains.slice(-period).reduce((a, b) => a + b, 0) - gains[gains.length - period - 1]) / period;
      const avgLoss = (losses.slice(-period).reduce((a, b) => a + b, 0) - losses[losses.length - period - 1]) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }
  
  rsi.unshift(0); // First element
  return rsi;
}
