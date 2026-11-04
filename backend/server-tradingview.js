// MAMIE Backend API with TradingView-API (Mathieu2301)
// Real-time market data from TradingView

import express from 'express';
import cors from 'cors';
import { getCandles, getQuote, getQuotes, watchCandles } from '@mathieuc/tradingview/data';

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  credentials: true
}));

app.use(express.json());

// Symbol mapping (MAMIE format -> TradingView format)
const SYMBOL_MAP = {
  // Commodities
  'GC=F': 'COMEX:GC1!',
  'SI=F': 'COMEX:SI1!',
  'CL=F': 'NYMEX:CL1!',
  'BZ=F': 'NYMEX:BZ1!',
  'NG=F': 'NYMEX:NG1!',
  'HG=F': 'COMEX:HG1!',
  
  // Crypto
  'BTC-USD': 'BINANCE:BTCUSDT',
  'ETH-USD': 'BINANCE:ETHUSDT',
  'SOL-USD': 'BINANCE:SOLUSDT',
  'BNB-USD': 'BINANCE:BNBUSDT',
  'XRP-USD': 'BINANCE:XRPUSDT',
  'ADA-USD': 'BINANCE:ADAUSDT',
  'AVAX-USD': 'BINANCE:AVAXUSDT',
  'DOT-USD': 'BINANCE:DOTUSDT',
  'LINK-USD': 'BINANCE:LINKUSDT',
  'MATIC-USD': 'BINANCE:MATICUSDT',
  
  // Forex
  'EURUSD=X': 'FX:EURUSD',
  'GBPUSD=X': 'FX:GBPUSD',
  'USDJPY=X': 'FX:USDJPY',
  'AUDUSD=X': 'FX:AUDUSD',
  'USDCAD=X': 'FX:USDCAD',
  'USDCHF=X': 'FX:USDCHF',
  'NZDUSD=X': 'FX:NZDUSD',
  
  // Indices
  '^GSPC': 'TVC:SPX',
  '^IXIC': 'TVC:NDX',
  '^DJI': 'TVC:DJI',
  '^RUT': 'TVC:RUT',
  '^VIX': 'TVC:VIX',
  '^N225': 'TVC:NI225',
  '^HSI': 'TVC:HSI',
  '^FTSE': 'TVC:FTSE',
  '^GDAXI': 'TVC:DAX',
  
  // Stocks (US)
  'AAPL': 'NASDAQ:AAPL',
  'MSFT': 'NASDAQ:MSFT',
  'GOOGL': 'NASDAQ:GOOGL',
  'AMZN': 'NASDAQ:AMZN',
  'TSLA': 'NASDAQ:TSLA',
  'META': 'NASDAQ:META',
  'NVDA': 'NASDAQ:NVDA',
  'JPM': 'NYSE:JPM',
  'V': 'NYSE:V',
  'XOM': 'NYSE:XOM',
  
  // Indonesian Stocks
  'BBCA.JK': 'IDX:BBCA',
  'BBRI.JK': 'IDX:BBRI',
  'TLKM.JK': 'IDX:TLKM',
  'BMRI.JK': 'IDX:BMRI',
  'BBNI.JK': 'IDX:BBNI',
};

// Timeframe mapping
const TIMEFRAME_MAP = {
  '1m': '1',
  '5m': '5',
  '15m': '15',
  '30m': '30',
  '1h': '60',
  '2h': '120',
  '4h': '240',
  '1d': 'D',
  '1w': 'W',
  '1M': 'M',
};

// Cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(symbol, timeframe, count) {
  return `${symbol}_${timeframe}_${count}`;
}

function getCachedData(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

function setCacheData(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Helper: Map symbol
function mapSymbol(symbol) {
  return SYMBOL_MAP[symbol] || symbol;
}

// Helper: Map timeframe
function mapTimeframe(timeframe) {
  return TIMEFRAME_MAP[timeframe] || timeframe;
}

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Test TradingView connection
    const testQuote = await getQuote('BINANCE:BTCUSDT');
    
    res.json({
      status: 'healthy',
      tradingview: 'connected',
      timestamp: new Date().toISOString(),
      cache_size: cache.size
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get historical data (candles)
app.get('/api/data/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1d', count = 100 } = req.query;
    
    const tvSymbol = mapSymbol(symbol);
    const tvTimeframe = mapTimeframe(timeframe);
    const countNum = parseInt(count);
    
    // Check cache
    const cacheKey = getCacheKey(tvSymbol, tvTimeframe, countNum);
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      console.log(`✅ Cache hit for ${symbol}`);
      return res.json({
        symbol,
        timeframe,
        data: cached,
        count: cached.length,
        cached: true
      });
    }
    
    console.log(`📥 Fetching data for ${symbol} (${tvSymbol})...`);
    
    // Fetch from TradingView
    const candles = await getCandles({
      symbol: tvSymbol,
      timeframe: tvTimeframe,
      count: countNum
    });
    
    if (!candles || candles.length === 0) {
      return res.status(404).json({
        error: 'No data available',
        symbol,
        timeframe
      });
    }
    
    // Convert to MAMIE format
    const data = candles.map(candle => ({
      timestamp: candle.time,
      date: new Date(candle.time * 1000).toISOString().split('T')[0],
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume || 0
    }));
    
    // Cache result
    setCacheData(cacheKey, data);
    
    res.json({
      symbol,
      timeframe,
      data,
      count: data.length,
      cached: false
    });
    
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({
      error: error.message,
      symbol: req.params.symbol
    });
  }
});

// Get latest quote
app.get('/api/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const tvSymbol = mapSymbol(symbol);
    
    // Check cache
    const cacheKey = `quote_${tvSymbol}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }
    
    console.log(`📥 Fetching quote for ${symbol}...`);
    
    const quote = await getQuote(tvSymbol);
    
    if (!quote) {
      return res.status(404).json({
        error: 'No quote available',
        symbol
      });
    }
    
    // Convert to MAMIE format
    const data = {
      symbol: quote.symbol || symbol,
      price: quote.lastPrice || quote.close || 0,
      change: quote.change || 0,
      changePercent: quote.changePercent || ((quote.change / quote.prevClose) * 100) || 0,
      high: quote.high || 0,
      low: quote.low || 0,
      open: quote.open || 0,
      volume: quote.volume || 0,
      previousClose: quote.prevClose || 0,
      marketCap: quote.marketCap || undefined,
      name: quote.description || quote.name || symbol,
      timestamp: new Date().toISOString()
    };
    
    // Cache result
    setCacheData(cacheKey, data);
    
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({
      error: error.message,
      symbol: req.params.symbol
    });
  }
});

// Get multiple quotes
app.get('/api/quotes', async (req, res) => {
  try {
    const { symbols } = req.query;
    
    if (!symbols) {
      return res.status(400).json({
        error: 'symbols parameter is required'
      });
    }
    
    const symbolList = symbols.split(',').map(s => s.trim());
    const tvSymbols = symbolList.map(mapSymbol);
    
    console.log(`📥 Fetching quotes for ${symbolList.length} symbols...`);
    
    const quotes = await getQuotes(tvSymbols);
    
    // Convert to MAMIE format
    const data = quotes.map((quote, index) => ({
      symbol: symbolList[index],
      price: quote.lastPrice || quote.close || 0,
      change: quote.change || 0,
      changePercent: quote.changePercent || 0,
      high: quote.high || 0,
      low: quote.low || 0,
      volume: quote.volume || 0,
      previousClose: quote.prevClose || 0,
      name: quote.description || quote.name || symbolList[index],
      timestamp: new Date().toISOString()
    }));
    
    res.json({
      quotes: data,
      count: data.length
    });
    
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Get supported symbols
app.get('/api/symbols', (req, res) => {
  res.json({
    symbols: Object.keys(SYMBOL_MAP),
    count: Object.keys(SYMBOL_MAP).length,
    mapping: SYMBOL_MAP
  });
});

// Clear cache
app.post('/api/cache/clear', (req, res) => {
  cache.clear();
  res.json({
    message: 'Cache cleared',
    timestamp: new Date().toISOString()
  });
});

// Get cache stats
app.get('/api/cache/stats', (req, res) => {
  res.json({
    size: cache.size,
    entries: Array.from(cache.keys()),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 MAMIE Backend API (TradingView-API)                 ║
║                                                           ║
║   Server running on: http://localhost:${PORT}                ║
║   API Docs: http://localhost:${PORT}/api/health              ║
║                                                           ║
║   Endpoints:                                              ║
║   - GET  /api/health          Health check                ║
║   - GET  /api/data/:symbol    Historical data             ║
║   - GET  /api/quote/:symbol   Latest quote                ║
║   - GET  /api/quotes          Multiple quotes             ║
║   - GET  /api/symbols         Supported symbols           ║
║   - POST /api/cache/clear     Clear cache                 ║
║   - GET  /api/cache/stats     Cache statistics            ║
║                                                           ║
║   Data Source: TradingView (via @mathieuc/tradingview)   ║
║   Cache TTL: 5 minutes                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
