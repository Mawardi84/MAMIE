# 🔧 TradingView-API Backend Setup Guide

## 📊 Current Status

### ❌ Backend NOT RUNNING

The TradingView-API backend has been **created but not activated**. Here's what exists:

✅ **Files Created:**
- `backend/server-tradingview.js` - Backend code (397 lines)
- `backend/package.json` - Dependencies configuration
- `backend/.env.example-tradingview` - Environment template
- `backend/README-TRADINGVIEW.md` - Documentation

❌ **Not Done:**
- Dependencies not installed (no `node_modules`)
- Backend server not running
- Frontend not connected to backend
- Still using sample data locally

---

## 🚀 How to Activate TradingView-API Backend

### Option 1: Local Setup (Recommended for Development)

#### Step 1: Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install Node.js dependencies
npm install
```

This will install:
- `@mathieuc/tradingview` ^4.1.1 - TradingView API library
- `express` ^4.18.2 - Web framework
- `cors` ^2.8.5 - CORS middleware
- `dotenv` ^16.3.1 - Environment variables

#### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example-tradingview .env

# Edit .env file (optional)
nano .env
```

**Environment Variables:**
```env
# Port
PORT=8000

# CORS Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# TradingView Credentials (Optional - for premium features)
TV_SESSION=
TV_SIGNATURE=

# Cache TTL (milliseconds)
CACHE_TTL=300000
```

**Note:** TradingView credentials are **optional**. Without them, you still get:
- ✅ Real-time data
- ✅ Historical data
- ✅ Basic indicators
- ❌ Premium indicators (requires account)

#### Step 3: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 MAMIE Backend API (TradingView-API)                 ║
║                                                           ║
║   Server running on: http://localhost:8000                ║
║   API Docs: http://localhost:8000/api/health              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

#### Step 4: Test Backend

Open new terminal:

```bash
# Test health check
curl http://localhost:8000/api/health

# Expected response:
# {"status":"healthy","tradingview":"connected","timestamp":"...","cache_size":0}

# Test data fetch
curl "http://localhost:8000/api/data/GC=F?timeframe=1d&count=10"

# Test quote
curl http://localhost:8000/api/quote/BTC-USD
```

#### Step 5: Configure Frontend

```bash
# Navigate to root project
cd ..

# Copy environment file
cp .env.example .env

# Edit .env
nano .env

# Set backend URL
VITE_API_BASE=http://localhost:8000
```

#### Step 6: Restart Frontend

```bash
# Stop frontend (Ctrl+C if running)

# Restart frontend
npm run dev
```

Frontend will now use TradingView-API backend instead of sample data!

---

### Option 2: Docker Setup

#### Create Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["npm", "start"]
```

#### Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - PORT=8000
      - CORS_ORIGINS=http://localhost:5173
      - TV_SESSION=${TV_SESSION}
      - TV_SIGNATURE=${TV_SIGNATURE}
    restart: unless-stopped
```

#### Build and Run

```bash
# Build image
docker-compose build

# Run container
docker-compose up -d

# View logs
docker-compose logs -f backend
```

---

## 🔄 Switching from Sample Data to TradingView-API

### Current State (Sample Data)

```typescript
// src/services/dataService.ts
import { getMultipleQuotes } from '../data/sampleData';

export async function fetchMultipleQuotes(symbols: string[]) {
  return getMultipleQuotes(symbols); // Uses local sample data
}
```

### After Backend Setup (TradingView-API)

```typescript
// src/services/dataService.ts
const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function fetchMultipleQuotes(symbols: string[]) {
  if (API_BASE) {
    // Use backend API
    const response = await fetch(`${API_BASE}/api/quotes?symbols=${symbols.join(',')}`);
    return response.json();
  } else {
    // Fallback to sample data
    return getMultipleQuotes(symbols);
  }
}
```

**The frontend already has this logic!** Once you set `VITE_API_BASE`, it will automatically use the backend.

---

## 📊 Comparison: Sample Data vs TradingView-API

| Feature | Sample Data (Current) | TradingView-API (Backend) |
|---------|----------------------|---------------------------|
| **Data Source** | Local generation | Real TradingView data |
| **Real-time** | ❌ Simulated | ✅ Real-time |
| **Historical** | ✅ 365 days | ✅ Up to 5000 bars |
| **Assets** | 6 assets | 50+ assets |
| **Accuracy** | Realistic but fake | ✅ Real market data |
| **Setup** | ✅ Ready to use | ⚠️ Requires backend setup |
| **Cost** | ✅ Free | ✅ Free (basic) |
| **Reliability** | ✅ Always works | ⚠️ Depends on TradingView |
| **CORS** | ✅ No issues | ✅ Backend bypasses CORS |

---

## 🎯 Recommendation

### For Development/Testing:
**Use Sample Data** (current setup)
- ✅ No setup required
- ✅ Always works
- ✅ Fast and reliable
- ✅ Good for UI development

### For Production:
**Use TradingView-API Backend**
- ✅ Real market data
- ✅ Real-time updates
- ✅ More assets
- ✅ Professional grade

### For Demo/Presentation:
**Use Sample Data**
- ✅ Reliable
- ✅ No external dependencies
- ✅ Always available

---

## 🧪 Testing TradingView-API Backend

### Test 1: Health Check

```bash
curl http://localhost:8000/api/health
```

**Expected:**
```json
{
  "status": "healthy",
  "tradingview": "connected",
  "timestamp": "2026-01-XXT00:00:00.000Z",
  "cache_size": 0
}
```

### Test 2: Get Historical Data

```bash
curl "http://localhost:8000/api/data/GC=F?timeframe=1d&count=100"
```

**Expected:**
```json
{
  "symbol": "GC=F",
  "timeframe": "1d",
  "data": [
    {
      "timestamp": 1704067200,
      "date": "2024-01-01",
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

### Test 3: Get Quote

```bash
curl http://localhost:8000/api/quote/BTC-USD
```

**Expected:**
```json
{
  "symbol": "BTC-USD",
  "price": 42300.50,
  "change": 300.50,
  "changePercent": 0.71,
  "high": 42500.00,
  "low": 41800.00,
  "volume": 15000,
  "previousClose": 42000.00,
  "name": "Bitcoin / Tether",
  "timestamp": "2026-01-XXT00:00:00.000Z"
}
```

### Test 4: Get Multiple Quotes

```bash
curl "http://localhost:8000/api/quotes?symbols=GC=F,CL=F,BTC-USD,ETH-USD"
```

**Expected:**
```json
{
  "quotes": [
    {
      "symbol": "GC=F",
      "price": 2068.30,
      "change": 5.20,
      "changePercent": 0.25,
      ...
    },
    ...
  ],
  "count": 4
}
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@mathieuc/tradingview'"

**Solution:**
```bash
cd backend
npm install
```

### Issue: "Port 8000 already in use"

**Solution:**
```bash
# Find process using port 8000
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=8001 npm start
```

### Issue: "CORS error" in frontend

**Solution:**
1. Check `CORS_ORIGINS` in `backend/.env`
2. Add your frontend URL: `CORS_ORIGINS=http://localhost:5173`
3. Restart backend

### Issue: "No data available"

**Solution:**
1. Check symbol is in SYMBOL_MAP
2. Verify symbol exists on TradingView
3. Try with login credentials for better reliability

### Issue: "Rate limit exceeded"

**Solution:**
1. Wait a few seconds
2. Clear cache: `curl -X POST http://localhost:8000/api/cache/clear`
3. Use TradingView credentials for higher limits

---

## 📚 Documentation

### Backend Documentation
- `backend/README-TRADINGVIEW.md` - Complete backend guide
- `backend/README.md` - General backend documentation

### Frontend Documentation
- `QUICK_START_TRADINGVIEW.md` - Quick start guide
- `docs/data-sources/TRADINGVIEW_API_SOLUTION.md` - Solution documentation
- `docs/data-sources/DATA_SOURCE_COMPARISON.md` - Comparison with alternatives

### API Documentation
- Health Check: `GET /api/health`
- Historical Data: `GET /api/data/:symbol`
- Latest Quote: `GET /api/quote/:symbol`
- Multiple Quotes: `GET /api/quotes?symbols=A,B,C`
- Supported Symbols: `GET /api/symbols`
- Clear Cache: `POST /api/cache/clear`
- Cache Stats: `GET /api/cache/stats`

---

## ✅ Checklist

### Backend Setup Checklist

- [ ] Navigate to `backend/` directory
- [ ] Run `npm install`
- [ ] Copy `.env.example-tradingview` to `.env`
- [ ] Configure environment variables (optional)
- [ ] Run `npm run dev` or `npm start`
- [ ] Test health endpoint: `curl http://localhost:8000/api/health`
- [ ] Test data endpoint: `curl "http://localhost:8000/api/data/GC=F?timeframe=1d&count=10"`
- [ ] Verify backend is running on port 8000

### Frontend Integration Checklist

- [ ] Copy `.env.example` to `.env` in root
- [ ] Set `VITE_API_BASE=http://localhost:8000`
- [ ] Restart frontend: `npm run dev`
- [ ] Verify frontend connects to backend
- [ ] Check browser console for API calls
- [ ] Verify real-time data appears

---

## 🎯 Summary

### Current Status

**Sample Data System:** ✅ WORKING PERFECTLY
- All features functional
- No CORS issues
- Fast and reliable
- Good for development

**TradingView-API Backend:** ⚠️ CREATED BUT NOT ACTIVATED
- Files created
- Code written
- Documentation complete
- **Needs: npm install + npm start**

### Next Steps

1. **If you want real-time data:**
   - Follow setup guide above
   - Install dependencies
   - Start backend
   - Configure frontend

2. **If sample data is sufficient:**
   - Keep current setup
   - No changes needed
   - System works perfectly

3. **For production:**
   - Setup TradingView-API backend
   - Deploy to cloud (Vercel, Railway, Render)
   - Configure environment variables
   - Monitor performance

---

## 📞 Support

### Quick Commands

```bash
# Install backend dependencies
cd backend && npm install

# Start backend
npm run dev

# Test backend
curl http://localhost:8000/api/health

# Configure frontend
echo "VITE_API_BASE=http://localhost:8000" > .env

# Restart frontend
npm run dev
```

### Common Issues

**Q: Do I need TradingView account?**  
A: No, but recommended for premium features and better reliability.

**Q: Is TradingView-API free?**  
A: Yes, basic usage is free. Premium features require account.

**Q: Can I use both sample data and TradingView-API?**  
A: Yes! Frontend automatically falls back to sample data if backend is unavailable.

**Q: Which is better for production?**  
A: TradingView-API backend provides real data, but requires setup and maintenance.

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-XX  
**Status:** ⚠️ BACKEND CREATED BUT NOT ACTIVATED
