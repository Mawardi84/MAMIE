# MAMIE Backend API with tvdatafeed
# FastAPI implementation for market data retrieval

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from tvDatafeed import TvDatafeed, Interval
import pandas as pd
from typing import Optional
from datetime import datetime
import os

app = FastAPI(
    title="MAMIE Market Data API",
    description="Backend API for MAMIE using tvdatafeed",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize TvDatafeed
# Note: For production, use environment variables for credentials
TV_USERNAME = os.getenv('TV_USERNAME', '')
TV_PASSWORD = os.getenv('TV_PASSWORD', '')

if TV_USERNAME and TV_PASSWORD:
    tv = TvDatafeed(TV_USERNAME, TV_PASSWORD)
    print("✅ TvDatafeed initialized with login")
else:
    tv = TvDatafeed()
    print("⚠️ TvDatafeed initialized without login (limited data)")

# Interval mapping
INTERVAL_MAP = {
    '1m': Interval.in_1_minute,
    '5m': Interval.in_5_minute,
    '15m': Interval.in_15_minute,
    '30m': Interval.in_30_minute,
    '1h': Interval.in_1_hour,
    '2h': Interval.in_2_hour,
    '3h': Interval.in_3_hour,
    '4h': Interval.in_4_hour,
    '1d': Interval.in_daily,
    '1w': Interval.in_weekly,
    '1M': Interval.in_monthly,
}

# Symbol mapping (MAMIE format -> TradingView format)
SYMBOL_MAP = {
    # Commodities
    'GC=F': ('GC1!', 'COMEX'),
    'SI=F': ('SI1!', 'COMEX'),
    'CL=F': ('CL1!', 'NYMEX'),
    'BZ=F': ('OIL.BRENT', 'COMEX'),
    'NG=F': ('NG1!', 'NYMEX'),
    'HG=F': ('HG1!', 'COMEX'),
    
    # Crypto
    'BTC-USD': ('BTCUSDT', 'BINANCE'),
    'ETH-USD': ('ETHUSDT', 'BINANCE'),
    'SOL-USD': ('SOLUSDT', 'BINANCE'),
    'BNB-USD': ('BNBUSDT', 'BINANCE'),
    'XRP-USD': ('XRPUSDT', 'BINANCE'),
    
    # Forex
    'EURUSD=X': ('EURUSD', 'FX_IDC'),
    'GBPUSD=X': ('GBPUSD', 'FX_IDC'),
    'USDJPY=X': ('USDJPY', 'FX_IDC'),
    'AUDUSD=X': ('AUDUSD', 'FX_IDC'),
    'USDCAD=X': ('USDCAD', 'FX_IDC'),
    'USDCHF=X': ('USDCHF', 'FX_IDC'),
    'NZDUSD=X': ('NZDUSD', 'FX_IDC'),
    
    # Indices
    '^GSPC': ('SPX', 'INDEX'),
    '^IXIC': ('IXIC', 'INDEX'),
    '^DJI': ('DJI', 'INDEX'),
    '^RUT': ('RUT', 'INDEX'),
    '^VIX': ('VIX', 'CBOE'),
    '^N225': ('NIKKEI', 'INDEX'),
    '^HSI': ('HSI', 'INDEX'),
    '^FTSE': ('UKX', 'INDEX'),
    '^GDAXI': ('DAX', 'INDEX'),
    
    # Indonesian Stocks (example)
    'BBCA.JK': ('BBCA', 'IDX'),
    'BBRI.JK': ('BBRI', 'IDX'),
    'TLKM.JK': ('TLKM', 'IDX'),
}

# Cache directory
CACHE_DIR = 'cache'
os.makedirs(CACHE_DIR, exist_ok=True)


def get_cache_key(symbol: str, exchange: str, interval: str, n_bars: int) -> str:
    """Generate cache key for data"""
    import hashlib
    key_string = f"{symbol}_{exchange}_{interval}_{n_bars}"
    return hashlib.md5(key_string.encode()).hexdigest()


def get_cached_data(cache_key: str) -> Optional[pd.DataFrame]:
    """Get data from cache if exists and not expired"""
    cache_file = os.path.join(CACHE_DIR, f"{cache_key}.csv")
    
    if not os.path.exists(cache_file):
        return None
    
    # Check if cache is expired (5 minutes)
    file_time = os.path.getmtime(cache_file)
    if datetime.now().timestamp() - file_time > 300:  # 5 minutes
        os.remove(cache_file)
        return None
    
    try:
        return pd.read_csv(cache_file, index_col=0, parse_dates=True)
    except:
        return None


def save_to_cache(cache_key: str, data: pd.DataFrame):
    """Save data to cache"""
    cache_file = os.path.join(CACHE_DIR, f"{cache_key}.csv")
    data.to_csv(cache_file)


def safe_get_hist(symbol: str, exchange: str, interval: Interval, n_bars: int, max_retries: int = 3):
    """Safely get historical data with retries"""
    import time
    
    for attempt in range(max_retries):
        try:
            data = tv.get_hist(
                symbol=symbol,
                exchange=exchange,
                interval=interval,
                n_bars=n_bars
            )
            
            if data is not None and len(data) > 0:
                return data
            
            print(f"No data returned for {symbol}")
            return None
            
        except Exception as e:
            print(f"Attempt {attempt + 1} failed for {symbol}: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
    
    return None


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "MAMIE Market Data API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/api/data/{symbol}")
async def get_historical_data(
    symbol: str,
    interval: str = Query('1d', description='Time interval: 1m, 5m, 15m, 1h, 4h, 1d, 1w, 1M'),
    n_bars: int = Query(100, description='Number of bars to download', ge=1, le=5000),
    exchange: Optional[str] = Query(None, description='Exchange (auto-detected if not provided)')
):
    """
    Get historical data for a symbol
    
    - **symbol**: Trading symbol (e.g., AAPL, GC=F, BTC-USD)
    - **interval**: Time interval (1m, 5m, 15m, 1h, 4h, 1d, 1w, 1M)
    - **n_bars**: Number of bars to download (max 5000)
    - **exchange**: Exchange name (optional, auto-detected)
    """
    try:
        # Map interval
        tv_interval = INTERVAL_MAP.get(interval)
        if not tv_interval:
            raise HTTPException(status_code=400, detail=f"Invalid interval: {interval}")
        
        # Map symbol
        if symbol in SYMBOL_MAP:
            tv_symbol, tv_exchange = SYMBOL_MAP[symbol]
        else:
            # Assume it's already in TradingView format
            tv_symbol = symbol
            tv_exchange = exchange or 'NASDAQ'
        
        # Check cache first
        cache_key = get_cache_key(tv_symbol, tv_exchange, interval, n_bars)
        cached_data = get_cached_data(cache_key)
        
        if cached_data is not None:
            print(f"✅ Cache hit for {symbol}")
            data = cached_data
        else:
            print(f"📥 Downloading data for {symbol}...")
            # Download data
            data = safe_get_hist(tv_symbol, tv_exchange, tv_interval, n_bars)
            
            if data is None:
                raise HTTPException(status_code=404, detail=f"No data available for {symbol}")
            
            # Save to cache
            save_to_cache(cache_key, data)
        
        # Convert to JSON
        data_json = data.reset_index().to_dict(orient='records')
        
        # Format timestamps
        for item in data_json:
            if 'datetime' in item:
                item['timestamp'] = item['datetime']
                del item['datetime']
        
        return {
            'symbol': symbol,
            'interval': interval,
            'exchange': tv_exchange,
            'data': data_json,
            'count': len(data_json),
            'cached': cached_data is not None
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/quote/{symbol}")
async def get_quote(symbol: str):
    """
    Get latest quote for a symbol
    
    - **symbol**: Trading symbol (e.g., AAPL, GC=F, BTC-USD)
    """
    try:
        # Map symbol
        if symbol in SYMBOL_MAP:
            tv_symbol, tv_exchange = SYMBOL_MAP[symbol]
        else:
            tv_symbol = symbol
            tv_exchange = 'NASDAQ'
        
        # Get latest 2 bars
        data = safe_get_hist(tv_symbol, tv_exchange, Interval.in_daily, 2)
        
        if data is None or len(data) < 2:
            raise HTTPException(status_code=404, detail=f"No data available for {symbol}")
        
        latest = data.iloc[-1]
        previous = data.iloc[-2]
        
        change = latest['close'] - previous['close']
        change_percent = (change / previous['close']) * 100
        
        return {
            'symbol': symbol,
            'price': float(latest['close']),
            'change': float(change),
            'changePercent': float(change_percent),
            'high': float(latest['high']),
            'low': float(latest['low']),
            'open': float(latest['open']),
            'volume': int(latest['volume']) if 'volume' in latest else 0,
            'previousClose': float(previous['close']),
            'timestamp': latest.name.isoformat() if hasattr(latest.name, 'isoformat') else str(latest.name)
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/multiple-quotes")
async def get_multiple_quotes(
    symbols: str = Query(..., description='Comma-separated list of symbols')
):
    """
    Get latest quotes for multiple symbols
    
    - **symbols**: Comma-separated list of symbols (e.g., AAPL,MSFT,GOOGL)
    """
    try:
        symbol_list = [s.strip() for s in symbols.split(',')]
        quotes = []
        
        for symbol in symbol_list:
            try:
                quote = await get_quote(symbol)
                quotes.append(quote)
            except Exception as e:
                print(f"Error fetching {symbol}: {e}")
                quotes.append({
                    'symbol': symbol,
                    'error': str(e)
                })
        
        return {
            'quotes': quotes,
            'count': len(quotes)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test tvdatafeed connection
        test_data = tv.get_hist('AAPL', 'NASDAQ', Interval.in_daily, 1)
        
        return {
            'status': 'healthy',
            'tvdatafeed': 'connected' if test_data is not None else 'no data',
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        return {
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }


@app.get("/api/symbols")
async def get_supported_symbols():
    """Get list of supported symbols"""
    return {
        'symbols': list(SYMBOL_MAP.keys()),
        'count': len(SYMBOL_MAP)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
