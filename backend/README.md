# MAMIE Backend API

Backend API untuk MAMIE menggunakan **tvdatafeed** untuk mengambil data market dari TradingView.

## 🚀 Features

✅ **Gratis** - Menggunakan tvdatafeed (tidak perlu API berbayar)  
✅ **Multi-Asset** - Saham, Forex, Crypto, Komoditas, Indeks  
✅ **Multi-Timeframe** - 1m, 5m, 15m, 1h, 4h, 1d, 1w, 1M  
✅ **Caching** - Redis/in-memory cache untuk performa  
✅ **CORS Enabled** - Siap untuk frontend integration  
✅ **Error Handling** - Graceful error handling dengan retry  
✅ **Rate Limiting** - Built-in rate limiting  

## 📋 Requirements

- Python 3.8+
- pip

## 🔧 Installation

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env dan tambahkan TradingView credentials (optional)
nano .env
```

**Note:** TradingView credentials **optional** tapi **recommended** untuk data yang lebih lengkap dan reliable. Buat akun gratis di https://www.tradingview.com/

### 3. Run Backend

```bash
# Development
python app.py

# Or with uvicorn
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend akan berjalan di `http://localhost:8000`

## 📚 API Endpoints

### Health Check

```bash
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "tvdatafeed": "connected",
  "timestamp": "2026-01-XXT00:00:00"
}
```

### Get Historical Data

```bash
GET /api/data/{symbol}?interval=1d&n_bars=100
```

**Parameters:**
- `symbol` - Trading symbol (e.g., AAPL, GC=F, BTC-USD)
- `interval` - Time interval: 1m, 5m, 15m, 1h, 4h, 1d, 1w, 1M
- `n_bars` - Number of bars (max 5000)
- `exchange` - Exchange name (optional, auto-detected)

**Example:**
```bash
curl "http://localhost:8000/api/data/GC=F?interval=1d&n_bars=100"
```

**Response:**
```json
{
  "symbol": "GC=F",
  "interval": "1d",
  "exchange": "COMEX",
  "data": [
    {
      "timestamp": "2024-01-02T00:00:00",
      "open": 2065.5,
      "high": 2070.2,
      "low": 2060.1,
      "close": 2068.3,
      "volume": 150000
    },
    ...
  ],
  "count": 100,
  "cached": false
}
```

### Get Latest Quote

```bash
GET /api/quote/{symbol}
```

**Example:**
```bash
curl "http://localhost:8000/api/quote/AAPL"
```

**Response:**
```json
{
  "symbol": "AAPL",
  "price": 185.92,
  "change": 1.23,
  "changePercent": 0.67,
  "high": 186.50,
  "low": 184.80,
  "open": 185.00,
  "volume": 45000000,
  "previousClose": 184.69,
  "timestamp": "2024-01-XXT00:00:00"
}
```

### Get Multiple Quotes

```bash
GET /api/multiple-quotes?symbols=AAPL,MSFT,GOOGL
```

**Response:**
```json
{
  "quotes": [
    {
      "symbol": "AAPL",
      "price": 185.92,
      "change": 1.23,
      "changePercent": 0.67,
      ...
    },
    ...
  ],
  "count": 3
}
```

### Get Supported Symbols

```bash
GET /api/symbols
```

**Response:**
```json
{
  "symbols": ["GC=F", "CL=F", "BTC-USD", "ETH-USD", ...],
  "count": 30
}
```

## 🎯 Supported Symbols

### Commodities
- `GC=F` - Gold Futures
- `SI=F` - Silver Futures
- `CL=F` - Crude Oil WTI
- `BZ=F` - Brent Crude
- `NG=F` - Natural Gas
- `HG=F` - Copper

### Crypto
- `BTC-USD` - Bitcoin
- `ETH-USD` - Ethereum
- `SOL-USD` - Solana
- `BNB-USD` - Binance Coin
- `XRP-USD` - Ripple

### Forex
- `EURUSD=X` - Euro/USD
- `GBPUSD=X` - British Pound/USD
- `USDJPY=X` - USD/Japanese Yen
- `AUDUSD=X` - Australian Dollar/USD
- `USDCAD=X` - USD/Canadian Dollar

### Indices
- `^GSPC` - S&P 500
- `^IXIC` - Nasdaq Composite
- `^DJI` - Dow Jones
- `^VIX` - VIX (Volatility Index)
- `^N225` - Nikkei 225

### Indonesian Stocks
- `BBCA.JK` - Bank Central Asia
- `BBRI.JK` - Bank Rakyat Indonesia
- `TLKM.JK` - Telkom Indonesia

## 🔌 Frontend Integration

### Update Frontend Environment

```bash
# Edit .env di root project
VITE_API_BASE=http://localhost:8000
```

### Update Frontend Service

```typescript
// src/services/dataService.ts

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export async function fetchAssetQuote(symbol: string): Promise<AssetQuote> {
  const response = await fetch(`${API_BASE}/api/quote/${symbol}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch quote: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchAssetPriceData(
  symbol: string,
  range: string = '1mo',
  interval: string = '1d'
): Promise<PriceData[]> {
  // Map range to n_bars
  const rangeToBars: Record<string, number> = {
    '1d': 1,
    '5d': 5,
    '1mo': 30,
    '3mo': 90,
    '6mo': 180,
    '1y': 365,
    '2y': 730,
  };
  
  const n_bars = rangeToBars[range] || 30;
  
  const response = await fetch(
    `${API_BASE}/api/data/${symbol}?interval=${interval}&n_bars=${n_bars}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  // Convert to PriceData format
  return result.data.map((item: any) => ({
    timestamp: new Date(item.timestamp).getTime() / 1000,
    date: item.timestamp.split('T')[0],
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume || 0,
  }));
}
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create cache directory
RUN mkdir -p cache

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - TV_USERNAME=${TV_USERNAME}
      - TV_PASSWORD=${TV_PASSWORD}
      - CACHE_DIR=/app/cache
    volumes:
      - ./cache:/app/cache
    restart: unless-stopped
```

### Build and Run

```bash
# Build
docker-compose build

# Run
docker-compose up -d

# Logs
docker-compose logs -f backend
```

## 📊 Performance

### Caching

Backend menggunakan caching untuk mengurangi API calls:
- **Cache TTL**: 5 menit (configurable)
- **Cache Location**: `backend/cache/`
- **Cache Key**: MD5 hash of symbol + exchange + interval + n_bars

### Rate Limiting

tvdatafeed memiliki rate limits:
- **Without Login**: ~10 requests/minute
- **With Login**: ~100 requests/minute

Backend otomatis handle rate limiting dengan:
- Exponential backoff retry
- Caching untuk mengurangi requests
- Error handling yang graceful

## 🔒 Security

### Environment Variables

**Jangan commit .env file!**

```bash
# Add to .gitignore
.env
cache/
__pycache__/
*.pyc
```

### CORS Configuration

Untuk production, update CORS origins di `app.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🧪 Testing

### Test Backend

```bash
# Test health endpoint
curl http://localhost:8000/api/health

# Test data endpoint
curl "http://localhost:8000/api/data/GC=F?interval=1d&n_bars=10"

# Test quote endpoint
curl http://localhost:8000/api/quote/AAPL
```

### Test Frontend Integration

1. Start backend: `python app.py`
2. Start frontend: `npm run dev`
3. Open browser: `http://localhost:5173`
4. Check console for API calls

## 📝 Troubleshooting

### Issue: "No data available"

**Solution:**
- Check symbol dan exchange benar
- Verify symbol ada di TradingView
- Coba dengan login credentials

### Issue: "Rate limit exceeded"

**Solution:**
- Tunggu beberapa saat sebelum retry
- Gunakan login credentials untuk limit yang lebih tinggi
- Implementasi caching

### Issue: "Connection timeout"

**Solution:**
- Check internet connection
- Coba lagi nanti
- Gunakan login credentials untuk reliability yang lebih baik

## 📚 Documentation

- **tvdatafeed**: https://github.com/rongardF/tvdatafeed
- **FastAPI**: https://fastapi.tiangolo.com/
- **TradingView**: https://www.tradingview.com/

## 🎯 Next Steps

1. ✅ Setup backend dengan tvdatafeed
2. ✅ Test API endpoints
3. ⏳ Update frontend untuk menggunakan backend API
4. ⏳ Deploy backend ke production
5. ⏳ Monitor performance dan reliability

## 📄 License

This project uses tvdatafeed which is open-source. Please respect TradingView's terms of service.

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-XX  
**Status:** ✅ READY FOR DEPLOYMENT
