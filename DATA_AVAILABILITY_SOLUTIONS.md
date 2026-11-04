# 🔧 Data Availability Issues & Solutions

## Problem: Data Kosong atau Unavailable

### Root Cause Analysis

**Masalah utama:** Data dari Yahoo Finance API sering tidak tersedia karena:

1. **CORS Restrictions**
   - Browser memblokir direct API calls ke Yahoo Finance
   - Menggunakan CORS proxy (corsproxy.io, allorigins.win, codetabs.com)
   - CORS proxy sering down, rate limited, atau diblokir

2. **API Rate Limits**
   - Yahoo Finance memiliki rate limits yang ketat
   - Multiple requests dalam waktu singkat akan diblokir
   - Tidak ada API key untuk authenticated requests

3. **Network Issues**
   - CORS proxy servers mungkin down
   - Yahoo Finance API mungkin berubah atau diblokir
   - Internet connectivity issues

4. **Data Source Limitations**
   - Beberapa instrumen tidak tersedia di Yahoo Finance
   - Data historis terbatas untuk beberapa simbol
   - Real-time data mungkin delayed

---

## ✅ RECOMMENDED SOLUTION: tvdatafeed Backend API

### Overview

**tvdatafeed** adalah library Python open-source yang memungkinkan download data historis dari TradingView secara **GRATIS** tanpa perlu akun berbayar.

### Why tvdatafeed?

✅ **Gratis** - Tidak perlu akun TradingView berbayar  
✅ **Reliable** - Lebih stable daripada Yahoo Finance + CORS proxy  
✅ **No CORS Issues** - Backend implementation bypass CORS  
✅ **Multi-Asset** - Saham, Forex, Crypto, Komoditas, Indeks  
✅ **Multi-Timeframe** - 1min, 5min, 15min, 1H, 4H, Daily, Weekly, Monthly  
✅ **Up to 5000 bars** - Data historis yang cukup untuk analisis  
✅ **Caching** - Server-side caching untuk performa  
✅ **Rate Limits** - Lebih generous daripada Yahoo Finance  

### Implementation Status

✅ **Backend API** - FastAPI + tvdatafeed (see `backend/` folder)  
✅ **Frontend Integration** - Updated to use backend API with fallback  
✅ **Symbol Mapping** - 30+ symbols mapped (MAMIE → TradingView)  
✅ **Caching** - 5-minute cache TTL  
✅ **Error Handling** - Graceful fallback to Yahoo Finance  

### Quick Start

**See:** `QUICK_START_BACKEND.md` for detailed setup instructions.

```bash
# 1. Setup Backend
cd backend
pip install -r requirements.txt
python app.py

# 2. Configure Frontend
# Edit .env: VITE_API_BASE=http://localhost:8000

# 3. Run Frontend
npm run dev
```

### Architecture

```
Frontend (React)
    ↓
Backend API (FastAPI + tvdatafeed)
    ↓
TradingView Data
    ↓
Cache Layer (5-min TTL)
```

### Documentation

- **Quick Start:** `QUICK_START_BACKEND.md`
- **tvdatafeed Guide:** `docs/data-sources/TVDATAFEED_SOLUTION.md`
- **Backend README:** `backend/README.md`
- **API Documentation:** http://localhost:8000/docs (when backend is running)

---

## Current Implementation

### Error Handling

Semua komponen sekarang memiliki error handling yang baik:

```typescript
// Example dari ExecutiveDashboard
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setError(null);
      const data = await fetchMultipleQuotes(symbols);
      
      if (!data || Object.keys(data).length === 0) {
        setError('No data available from market data sources');
      } else {
        setData(data);
      }
    } catch (e) {
      setError('Failed to fetch market data. Please check your internet connection.');
    }
  };
  
  fetchData();
}, []);
```

### DataUnavailable Component

Komponen `DataUnavailable` menampilkan pesan yang jelas ketika data tidak tersedia:

```typescript
<DataUnavailable 
  message="Market Data Unavailable"
  reason="Unable to fetch data from market sources"
/>
```

**Features:**
- Menampilkan pesan error yang jelas
- Menjelaskan kemungkinan penyebab
- Memberikan solusi alternatif
- Auto-retry setiap 60 detik

---

## Solutions

### Solution 1: Backend Proxy (RECOMMENDED for Production)

**Implementasi backend proxy untuk bypass CORS:**

```javascript
// backend/server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

// Yahoo Finance proxy
app.get('/api/yahoo/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { range = '1mo', interval = '1d' } = req.query;
    
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
    const response = await fetch(url);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001);
```

**Update frontend untuk menggunakan backend proxy:**

```typescript
// src/services/dataService.ts
const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function fetchAssetQuote(symbol: string): Promise<AssetQuote> {
  const url = `${API_BASE}/api/yahoo/${symbol}?range=5d&interval=1d`;
  const response = await fetch(url);
  // ... rest of the code
}
```

**Benefits:**
- ✅ Bypass CORS restrictions
- ✅ Better rate limiting control
- ✅ Caching di server side
- ✅ Lebih reliable dan stable
- ✅ Bisa menambahkan authentication

**Requirements:**
- Backend server (Node.js/Express atau Python/FastAPI)
- Hosting untuk backend
- Environment variables untuk API base URL

---

### Solution 2: Alternative Data Sources

**Gunakan API lain yang lebih reliable:**

#### Alpha Vantage (Free Tier)
```typescript
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

export async function fetchFromAlphaVantage(symbol: string) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
  const response = await fetch(url);
  return response.json();
}
```

**Free Tier:**
- 25 requests per day
- 5 requests per minute
- Historical data available

#### Financial Modeling Prep (Free Tier)
```typescript
const FMP_API_KEY = import.meta.env.VITE_FMP_KEY;

export async function fetchFromFMP(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`;
  const response = await fetch(url);
  return response.json();
}
```

**Free Tier:**
- 250 requests per day
- Real-time quotes
- Historical data

#### Twelve Data (Free Tier)
```typescript
const TWELVE_DATA_API_KEY = import.meta.env.VITE_TWELVE_DATA_KEY;

export async function fetchFromTwelveData(symbol: string) {
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=${TWELVE_DATA_API_KEY}`;
  const response = await fetch(url);
  return response.json();
}
```

**Free Tier:**
- 800 requests per day
- 8 requests per minute
- Real-time dan historical data

---

### Solution 3: Caching Strategy

**Implementasi caching untuk mengurangi API calls:**

```typescript
// src/services/cacheService.ts
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getCachedData(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

export function setCachedData(key: string,  any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Usage in dataService
export async function fetchAssetQuote(symbol: string): Promise<AssetQuote> {
  const cacheKey = `quote-${symbol}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const data = await fetchFromAPI(symbol);
  setCachedData(cacheKey, data);
  
  return data;
}
```

**Benefits:**
- ✅ Mengurangi API calls
- ✅ Faster response time
- ✅ Bypass rate limits
- ✅ Better user experience

---

### Solution 4: Retry Mechanism

**Implementasi retry dengan exponential backoff:**

```typescript
async function fetchWithRetry(
  url: string, 
  maxRetries = 3, 
  baseDelay = 1000
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      
      // If not ok, throw error to trigger retry
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

**Benefits:**
- ✅ Handle temporary failures
- ✅ Better reliability
- ✅ Exponential backoff prevents spam

---

### Solution 5: Fallback Data

**Gunakan fallback data ketika API gagal:**

```typescript
const FALLBACK_DATA: Record<string, AssetQuote> = {
  'GC=F': {
    price: 2000,
    change: 10,
    changePercent: 0.5,
    high: 2010,
    low: 1990,
    volume: 100000,
    previousClose: 1990,
    name: 'Gold',
    symbol: 'GC=F',
  },
  // ... other fallback data
};

export async function fetchAssetQuote(symbol: string): Promise<AssetQuote> {
  try {
    const data = await fetchFromAPI(symbol);
    return data;
  } catch (error) {
    console.warn(`Failed to fetch ${symbol}, using fallback data`);
    return FALLBACK_DATA[symbol] || {
      price: 0,
      change: 0,
      changePercent: 0,
      high: 0,
      low: 0,
      volume: 0,
      previousClose: 0,
      name: symbol,
      symbol: symbol,
    };
  }
}
```

**Benefits:**
- ✅ Always show something
- ✅ Better user experience
- ✅ Can indicate data is stale

---

## Recommended Solution for Production

### Architecture

```
┌─────────────┐
│   Frontend  │
│   (React)   │
└──────┬──────┘
       │
       │ HTTP Requests
       ▼
┌─────────────────┐
│  Backend Proxy  │
│  (Node.js/      │
│   FastAPI)      │
└──────┬──────────┘
       │
       │ API Calls
       ▼
┌─────────────────┐
│  Data Sources   │
│  - Yahoo Finance│
│  - Alpha Vantage│
│  - FRED         │
│  - CFTC         │
└─────────────────┘
       │
       │
       ▼
┌─────────────────┐
│  Cache Layer    │
│  (Redis)        │
└─────────────────┘
```

### Implementation Steps

1. **Setup Backend Proxy**
   - Create Node.js/Express atau Python/FastAPI server
   - Implement API endpoints untuk setiap data source
   - Add caching layer (Redis)
   - Add rate limiting
   - Add error handling

2. **Update Frontend**
   - Change API calls to use backend proxy
   - Remove CORS proxy dependencies
   - Add proper error handling
   - Add loading states

3. **Add Monitoring**
   - Log API calls and errors
   - Monitor cache hit rate
   - Track API response times
   - Set up alerts for failures

4. **Deploy**
   - Deploy backend to cloud (AWS, GCP, Vercel)
   - Configure environment variables
   - Set up CI/CD pipeline
   - Monitor performance

---

## Current Status

### What's Working

✅ **Error Handling**
- Semua komponen memiliki error handling
- Menampilkan pesan yang jelas ketika data tidak tersedia
- Auto-retry setiap 60 detik

✅ **CORS Proxy Fallback**
- 3 CORS proxies sebagai fallback
- Automatic retry jika satu proxy gagal

✅ **DataUnavailable Component**
- Informatif message ketika data tidak tersedia
- Menjelaskan kemungkinan penyebab
- Memberikan solusi alternatif

### What's Not Working

❌ **CORS Proxy Reliability**
- CORS proxy sering down atau rate limited
- Tidak reliable untuk production use

❌ **API Rate Limits**
- Yahoo Finance memiliki rate limits ketat
- Multiple requests akan diblokir

❌ **No Backend**
- Frontend-only architecture
- Tidak ada caching di server side
- Tidak ada rate limiting control

---

## Next Steps

### Immediate (This Week)

1. ✅ ~~Add error handling~~ (DONE)
2. ✅ ~~Add DataUnavailable component~~ (DONE)
3. ⏳ Test all components with various scenarios
4. ⏳ Document known limitations

### Short-term (Next 2 Weeks)

1. ⏳ Implement backend proxy (Node.js/Express)
2. ⏳ Add caching layer (Redis)
3. ⏳ Update frontend to use backend proxy
4. ⏳ Add monitoring and logging

### Long-term (Next Month)

1. ⏳ Add alternative data sources
2. ⏳ Implement retry mechanism
3. ⏳ Add fallback data
4. ⏳ Deploy to production

---

## Conclusion

**Current Status:** Platform berfungsi dengan error handling yang baik, tetapi data fetching dari Yahoo Finance melalui CORS proxy tidak reliable untuk production use.

**Recommended Solution:** Implementasi backend proxy dengan caching layer untuk bypass CORS restrictions dan improve reliability.

**Timeline:** 
- Immediate: Error handling sudah implemented ✅
- Short-term: Backend proxy (2 weeks)
- Long-term: Full production setup (1 month)

**Impact:**
- ✅ Better reliability
- ✅ Faster response times
- ✅ Bypass CORS restrictions
- ✅ Production-ready architecture

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-XX  
**Status:** ACTIVE
