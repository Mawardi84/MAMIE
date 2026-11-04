# 📊 TVDataFeed - Solusi Data Historis Gratis dari TradingView

## Overview

**tvdatafeed** adalah library Python open-source yang memungkinkan download data historis dari TradingView secara **GRATIS** tanpa perlu akun berbayar.

### Key Features

✅ **Gratis** - Tidak perlu akun TradingView berbayar  
✅ **Multi-Timeframe** - Support 1min, 5min, 15min, 1H, 4H, Daily, Weekly, Monthly  
✅ **Multi-Asset** - Saham, Forex, Crypto, Komoditas, Indeks  
✅ **Up to 5000 bars** - Data historis yang cukup untuk analisis  
✅ **Pandas DataFrame** - Output langsung ke format yang mudah digunakan  
✅ **Live Data** - Support real-time data retrieval  
✅ **No API Key Required** - Langsung bisa digunakan  

---

## Installation

```bash
pip install tvDatafeed
```

### Dependencies

```bash
pip install pandas numpy websocket-client
```

---

## Basic Usage

### 1. Import Library

```python
from tvDatafeed import TvDatafeed, Interval
```

### 2. Initialize (Tanpa Login)

```python
# Tanpa login (limited data)
tv = TvDatafeed()
```

### 3. Initialize (Dengan Login - Recommended)

```python
# Dengan login (more data, better reliability)
tv = TvDatafeed('your_tradingview_username', 'your_tradingview_password')
```

**Note:** Anda bisa membuat akun TradingView gratis di https://www.tradingview.com/

---

## Data Retrieval Examples

### Example 1: Download Daily Data

```python
from tvDatafeed import TvDatafeed, Interval

tv = TvDatafeed()

# Download data saham Apple (AAPL)
data = tv.get_hist(
    symbol='AAPL',
    exchange='NASDAQ',
    interval=Interval.in_daily,
    n_bars=100  # Number of bars to download
)

print(data.head())
print(data.shape)
```

**Output:**
```
                      open    high     low   close    volume
datetime                                                   
2024-01-02 00:00:00  185.50  186.20  184.80  185.90  45000000
2024-01-03 00:00:00  185.90  186.50  185.20  186.30  42000000
...
```

### Example 2: Download Intraday Data (1 Minute)

```python
# Download data 1-menit untuk Gold
data = tv.get_hist(
    symbol='GC1!',  # Gold Futures
    exchange='COMEX',
    interval=Interval.in_1_minute,
    n_bars=5000  # Maximum 5000 bars
)

print(f"Downloaded {len(data)} bars")
print(data.head())
```

### Example 3: Download Forex Data

```python
# Download EUR/USD
data = tv.get_hist(
    symbol='EURUSD',
    exchange='FX_IDC',
    interval=Interval.in_1_hour,
    n_bars=1000
)

print(data.head())
```

### Example 4: Download Crypto Data

```python
# Download Bitcoin
data = tv.get_hist(
    symbol='BTCUSDT',
    exchange='BINANCE',
    interval=Interval.in_daily,
    n_bars=365  # 1 year of data
)

print(data.head())
```

---

## Available Intervals

```python
from tvDatafeed import Interval

# Available intervals:
Interval.in_1_minute      # 1 minute
Interval.in_5_minute      # 5 minutes
Interval.in_15_minute     # 15 minutes
Interval.in_30_minute     # 30 minutes
Interval.in_1_hour        # 1 hour
Interval.in_2_hour        # 2 hours
Interval.in_3_hour        # 3 hours
Interval.in_4_hour        # 4 hours
Interval.in_daily         # Daily
Interval.in_weekly        # Weekly
Interval.in_monthly       # Monthly
```

---

## Supported Exchanges

### Stocks
- **NASDAQ** - US tech stocks
- **NYSE** - US stocks
- **IDX** - Indonesia Stock Exchange
- **SGX** - Singapore Exchange
- **TSE** - Tokyo Stock Exchange
- **LSE** - London Stock Exchange

### Forex
- **FX_IDC** - Forex pairs (EURUSD, GBPUSD, etc.)
- **OANDA** - OANDA forex data

### Crypto
- **BINANCE** - Binance crypto pairs
- **COINBASE** - Coinbase crypto pairs
- **KRAKEN** - Kraken crypto pairs

### Commodities
- **COMEX** - Gold, Silver, Copper
- **NYMEX** - Oil, Natural Gas
- **CBOT** - Corn, Wheat, Soybeans

### Indices
- **INDEX** - S&P 500, Dow Jones, etc.
- **CBOE** - VIX and other indices

---

## Symbol Format

### Stocks
```python
# US Stocks
symbol='AAPL', exchange='NASDAQ'
symbol='MSFT', exchange='NASDAQ'
symbol='GOOGL', exchange='NASDAQ'

# Indonesian Stocks
symbol='BBCA', exchange='IDX'
symbol='BBRI', exchange='IDX'
symbol='TLKM', exchange='IDX'
```

### Forex
```python
symbol='EURUSD', exchange='FX_IDC'
symbol='GBPUSD', exchange='FX_IDC'
symbol='USDJPY', exchange='FX_IDC'
symbol='USDIDR', exchange='FX_IDC'
```

### Crypto
```python
symbol='BTCUSDT', exchange='BINANCE'
symbol='ETHUSDT', exchange='BINANCE'
symbol='SOLUSDT', exchange='BINANCE'
```

### Commodities
```python
# Gold
symbol='GC1!', exchange='COMEX'  # Gold Futures (continuous)
symbol='XAUUSD', exchange='FX_IDC'  # Gold Spot

# Oil
symbol='CL1!', exchange='NYMEX'  # WTI Crude Oil (continuous)
symbol='USOIL', exchange='FX_IDC'  # WTI Spot
```

### Indices
```python
symbol='SPX', exchange='INDEX'  # S&P 500
symbol='DJI', exchange='INDEX'  # Dow Jones
symbol='IXIC', exchange='INDEX'  # Nasdaq Composite
symbol='IHSG', exchange='IDX'  # Jakarta Composite
```

---

## Advanced Usage

### Batch Download Multiple Symbols

```python
import pandas as pd
from tvDatafeed import TvDatafeed, Interval

tv = TvDatafeed()

symbols = [
    ('AAPL', 'NASDAQ'),
    ('MSFT', 'NASDAQ'),
    ('GOOGL', 'NASDAQ'),
    ('AMZN', 'NASDAQ'),
]

all_data = {}

for symbol, exchange in symbols:
    try:
        data = tv.get_hist(
            symbol=symbol,
            exchange=exchange,
            interval=Interval.in_daily,
            n_bars=100
        )
        all_data[symbol] = data
        print(f"Downloaded {symbol}: {len(data)} bars")
    except Exception as e:
        print(f"Error downloading {symbol}: {e}")

# Save to CSV
for symbol, data in all_data.items():
    data.to_csv(f'{symbol}_data.csv')
```

### Download with Date Range

```python
from datetime import datetime

# Note: tvdatafeed uses n_bars, not date range
# Calculate n_bars based on desired date range

# For daily data, 1 year = ~252 trading days
n_bars = 252  # 1 year of daily data

data = tv.get_hist(
    symbol='AAPL',
    exchange='NASDAQ',
    interval=Interval.in_daily,
    n_bars=n_bars
)
```

### Handle Errors Gracefully

```python
def safe_download(tv, symbol, exchange, interval, n_bars):
    try:
        data = tv.get_hist(
            symbol=symbol,
            exchange=exchange,
            interval=interval,
            n_bars=n_bars
        )
        
        if data is None or len(data) == 0:
            print(f"No data available for {symbol}")
            return None
        
        return data
    except Exception as e:
        print(f"Error downloading {symbol}: {e}")
        return None

# Usage
data = safe_download(tv, 'AAPL', 'NASDAQ', Interval.in_daily, 100)
```

---

## Integration with MAMIE

### Backend API Implementation

```python
# backend/app.py
from fastapi import FastAPI, HTTPException
from tvDatafeed import TvDatafeed, Interval
import pandas as pd
from datetime import datetime

app = FastAPI()

# Initialize TvDatafeed (with login for better reliability)
tv = TvDatafeed('username', 'password')

# Map MAMIE intervals to tvdatafeed intervals
INTERVAL_MAP = {
    '1m': Interval.in_1_minute,
    '5m': Interval.in_5_minute,
    '15m': Interval.in_15_minute,
    '1h': Interval.in_1_hour,
    '4h': Interval.in_4_hour,
    '1d': Interval.in_daily,
    '1w': Interval.in_weekly,
    '1M': Interval.in_monthly,
}

# Map MAMIE symbols to TradingView symbols
SYMBOL_MAP = {
    'GC=F': ('GC1!', 'COMEX'),
    'CL=F': ('CL1!', 'NYMEX'),
    'BTC-USD': ('BTCUSDT', 'BINANCE'),
    'ETH-USD': ('ETHUSDT', 'BINANCE'),
    '^GSPC': ('SPX', 'INDEX'),
    '^N225': ('NIKKEI', 'INDEX'),
    'EURUSD=X': ('EURUSD', 'FX_IDC'),
    'GBPUSD=X': ('GBPUSD', 'FX_IDC'),
    'USDJPY=X': ('USDJPY', 'FX_IDC'),
}

@app.get('/api/data/{symbol}')
async def get_data(
    symbol: str,
    interval: str = '1d',
    n_bars: int = 100
):
    try:
        # Map symbol
        if symbol in SYMBOL_MAP:
            tv_symbol, tv_exchange = SYMBOL_MAP[symbol]
        else:
            # Assume it's already in TradingView format
            tv_symbol = symbol
            tv_exchange = 'NASDAQ'  # Default
        
        # Map interval
        tv_interval = INTERVAL_MAP.get(interval, Interval.in_daily)
        
        # Download data
        data = tv.get_hist(
            symbol=tv_symbol,
            exchange=tv_exchange,
            interval=tv_interval,
            n_bars=n_bars
        )
        
        if data is None or len(data) == 0:
            raise HTTPException(status_code=404, detail='No data available')
        
        # Convert to JSON
        data_json = data.reset_index().to_dict(orient='records')
        
        return {
            'symbol': symbol,
            'interval': interval,
            'data': data_json,
            'count': len(data_json)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/api/quote/{symbol}')
async def get_quote(symbol: str):
    try:
        # Get latest data
        data = tv.get_hist(
            symbol=symbol,
            exchange='NASDAQ',
            interval=Interval.in_daily,
            n_bars=2
        )
        
        if data is None or len(data) < 2:
            raise HTTPException(status_code=404, detail='No data available')
        
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
            'volume': int(latest['volume']),
            'previousClose': float(previous['close']),
            'timestamp': latest.name.isoformat()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Frontend Integration

```typescript
// src/services/tvdatafeedService.ts

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export async function fetchFromTvDatafeed(
  symbol: string,
  interval: string = '1d',
  nBars: number = 100
): Promise<any> {
  const response = await fetch(
    `${API_BASE}/api/data/${symbol}?interval=${interval}&n_bars=${nBars}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchQuoteFromTvDatafeed(
  symbol: string
): Promise<any> {
  const response = await fetch(`${API_BASE}/api/quote/${symbol}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch quote: ${response.statusText}`);
  }
  
  return response.json();
}
```

---

## Comparison: tvdatafeed vs Yahoo Finance

| Feature | tvdatafeed | Yahoo Finance |
|---------|------------|---------------|
| **Cost** | ✅ Free | ✅ Free |
| **API Key** | ❌ Not required | ❌ Not required |
| **CORS** | ✅ No issues (backend) | ❌ CORS issues |
| **Rate Limits** | ✅ Generous | ❌ Strict |
| **Data Quality** | ✅ High | ⚠️ Variable |
| **Intraday Data** | ✅ Up to 5000 bars | ⚠️ Limited |
| **Reliability** | ✅ High | ⚠️ Variable |
| **Coverage** | ✅ Global | ✅ Global |
| **Implementation** | ⚠️ Requires backend | ✅ Direct from browser |

---

## Pros & Cons

### Pros ✅

1. **Gratis** - Tidak perlu akun berbayar
2. **Data Lengkap** - Up to 5000 bars per request
3. **Multi-Timeframe** - 1min sampai monthly
4. **Multi-Asset** - Saham, forex, crypto, komoditas, indeks
5. **Reliable** - Lebih stable daripada Yahoo Finance
6. **No CORS Issues** - Backend implementation bypass CORS
7. **Pandas Integration** - Langsung bisa digunakan untuk analisis

### Cons ❌

1. **Requires Backend** - Tidak bisa langsung dari browser
2. **Python Dependency** - Perlu Python environment
3. **TradingView Account** - Recommended untuk login (tapi bisa tanpa login)
4. **Rate Limits** - Ada rate limits (tapi lebih generous)
5. **Unofficial API** - Bukan official TradingView API

---

## Best Practices

### 1. Use Login for Better Reliability

```python
# Recommended
tv = TvDatafeed('username', 'password')

# Not recommended (limited data)
tv = TvDatafeed()
```

### 2. Implement Caching

```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def cached_get_hist(symbol, exchange, interval, n_bars):
    cache_key = hashlib.md5(f"{symbol}_{exchange}_{interval}_{n_bars}".encode()).hexdigest()
    
    # Check if data exists in cache
    cache_file = f"cache/{cache_key}.csv"
    if os.path.exists(cache_file):
        return pd.read_csv(cache_file, index_col=0, parse_dates=True)
    
    # Download data
    data = tv.get_hist(symbol, exchange, interval, n_bars)
    
    # Save to cache
    data.to_csv(cache_file)
    
    return data
```

### 3. Handle Errors Gracefully

```python
def safe_get_hist(tv, symbol, exchange, interval, n_bars, max_retries=3):
    for attempt in range(max_retries):
        try:
            data = tv.get_hist(symbol, exchange, interval, n_bars)
            if data is not None and len(data) > 0:
                return data
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
    
    return None
```

### 4. Use Appropriate n_bars

```python
# Daily data: 1 year = ~252 bars
n_bars_daily = 252

# Hourly data: 1 month = ~720 bars (24h * 30 days)
n_bars_hourly = 720

# 1-minute data: 1 week = ~5000 bars (max)
n_bars_1min = 5000
```

---

## Troubleshooting

### Issue 1: "No data available"

**Solution:**
- Check symbol and exchange are correct
- Verify the symbol exists on TradingView
- Try with login credentials

### Issue 2: "Rate limit exceeded"

**Solution:**
- Wait before making another request
- Implement caching
- Use login credentials for higher limits

### Issue 3: "Connection timeout"

**Solution:**
- Check internet connection
- Try again later
- Use login credentials for better reliability

---

## Conclusion

**tvdatafeed** adalah solusi yang **sangat promising** untuk masalah data kosong di MAMIE:

✅ **Gratis** - Tidak perlu biaya  
✅ **Reliable** - Lebih stable daripada Yahoo Finance  
✅ **Complete** - Multi-asset, multi-timeframe  
✅ **Easy to use** - Simple API  

⚠️ **Requires Backend** - Perlu implementasi backend Python  

**Recommendation:** Implementasi backend Python dengan tvdatafeed untuk production use.

---

## Next Steps

1. ✅ Review dokumentasi ini
2. ⏳ Setup Python backend dengan FastAPI
3. ⏳ Implementasi tvdatafeed integration
4. ⏳ Update frontend untuk menggunakan backend API
5. ⏳ Test dengan berbagai symbols dan timeframes
6. ⏳ Deploy backend ke production

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-XX  
**Status:** READY FOR IMPLEMENTATION
