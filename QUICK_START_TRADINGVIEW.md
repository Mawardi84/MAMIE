# 🚀 Quick Start Guide - TradingView-API Backend

## Overview

Panduan cepat untuk setup backend API menggunakan **@mathieuc/tradingview** - solusi **TERBAIK** untuk data real-time dari TradingView.

**Setup Time:** 5-10 minutes  
**Difficulty:** Easy  
**Cost:** FREE  

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Install Node.js

Check if Node.js is installed:
```bash
node --version  # Should be 18+ or 20+
```

If not installed, download from: https://nodejs.org/

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example-tradingview .env

# (Optional) Edit .env to add TradingView credentials
nano .env
```

### Step 3: Run Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

Backend akan berjalan di `http://localhost:8000`

### Step 4: Test Backend

Open new terminal:

```bash
# Test health check
curl http://localhost:8000/api/health

# Expected response:
# {"status":"healthy","tradingview":"connected","timestamp":"...","cache_size":0}
```

### Step 5: Configure Frontend

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

### Step 6: Run Frontend

```bash
# Install dependencies (if not done)
npm install

# Run frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### Step 7: Verify

1. Open browser: `http://localhost:5173`
2. Navigate to Executive Dashboard
3. Data should appear (Gold, Oil, BTC, etc.)
4. Check console - should see "Backend API" logs

**Done!** 🎉

---

## 📋 Detailed Setup

### Prerequisites

- **Node.js** 18+ or 20+
- **npm** or **yarn**
- **Git** (optional)

### Installation

#### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `@mathieuc/tradingview` - TradingView API library
- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variables

#### 2. Configure Environment

```bash
cp .env.example-tradingview .env
nano .env
```

**Environment Variables:**

```bash
# Port
PORT=8000

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# TradingView Credentials (Optional)
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

#### 3. Run Backend

```bash
# Development (with auto-reload)
npm run dev

# Production
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

### Testing

#### Test Health Check

```bash
curl http://localhost:8000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "tradingview": "connected",
  "timestamp": "2026-01-XXT00:00:00.000Z",
  "cache_size": 0
}
```

#### Test Data Fetch

```bash
# Get Gold data (10 daily candles)
curl "http://localhost:8000/api/data/GC=F?timeframe=1d&count=10"

# Get Bitcoin quote
curl http://localhost:8000/api/quote/BTC-USD

# Get multiple quotes
curl "http://localhost:8000/api/quotes?symbols=GC=F,CL=F,BTC-USD,ETH-USD"

# Get supported symbols
curl http://localhost:8000/api/symbols
```

#### Test Frontend Integration

1. Open browser: `http://localhost:5173`
2. Navigate to Executive Dashboard
3. Check if data appears (Gold, Oil, BTC, etc.)
4. Open DevTools → Console
5. Should see logs like: "📥 Fetching data for GC=F..."

---

## 🔧 Configuration

### Adding New Symbols

Edit `backend/server-tradingview.js`:

```javascript
const SYMBOL_MAP = {
  // Add your symbol here
  'NEW-SYMBOL': 'EXCHANGE:SYMBOL',
  
  // Examples:
  'TSLA': 'NASDAQ:TSLA',
  'AMD': 'NASDAQ:AMD',
  'SOL-USD': 'BINANCE:SOLUSDT',
};
```

### Adding New Timeframes

Edit `backend/server-tradingview.js`:

```javascript
const TIMEFRAME_MAP = {
  // Add your timeframe here
  '3h': '180',
  
  // Existing:
  '1m': '1',
  '5m': '5',
  '15m': '15',
  '1h': '60',
  '4h': '240',
  '1d': 'D',
  '1w': 'W',
  '1M': 'M',
};
```

### Using TradingView Credentials (Optional)

**Benefits:**
- Premium indicators
- Higher rate limits
- Better reliability

**How to get credentials:**

1. Create account at https://www.tradingview.com/
2. Login to TradingView
3. Open browser DevTools (F12)
4. Go to Application → Cookies → https://www.tradingview.com
5. Copy `sessionid` and `sessionid_sign` values
6. Add to `backend/.env`:

```bash
TV_SESSION=your_session_id_here
TV_SIGNATURE=your_session_signature_here
```

7. Restart backend: `npm run dev`

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@mathieuc/tradingview'"

**Solution:**
```bash
npm install
```

### Issue: "No data available"

**Solution:**
1. Check symbol is in SYMBOL_MAP
2. Test manually: `curl "http://localhost:8000/api/data/AAPL?timeframe=1d&count=10"`
3. Check TradingView status: https://status.tradingview.com/

### Issue: "Rate limit exceeded"

**Solution:**
1. Wait a few seconds
2. Clear cache: `curl -X POST http://localhost:8000/api/cache/clear`
3. Use TradingView credentials for higher limits

### Issue: "Connection timeout"

**Solution:**
1. Check internet connection
2. Check TradingView status
3. Restart backend: `npm run dev`

### Issue: "CORS error" in frontend

**Solution:**
1. Check `CORS_ORIGINS` in `backend/.env`
2. Add your frontend URL: `CORS_ORIGINS=http://localhost:5173`
3. Restart backend

### Issue: Backend not starting

**Solution:**
```bash
# Check Node.js version
node --version  # Should be 18+

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check port 8000 is free
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows

# Kill process if needed
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

---

## 📊 Performance

### Expected Performance

| Metric | Value |
|--------|-------|
| **Response Time** | < 500ms |
| **Cache Hit Rate** | ~80% |
| **Rate Limits** | Generous |
| **Reliability** | 99%+ |

### Monitoring

```bash
# Check cache stats
curl http://localhost:8000/api/cache/stats

# Clear cache
curl -X POST http://localhost:8000/api/cache/clear

# Check health
curl http://localhost:8000/api/health
```

---

## 🚀 Production Deployment

### Option 1: PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
pm2 start server-tradingview.js --name mamie-backend

# Monitor
pm2 status
pm2 logs mamie-backend

# Stop
pm2 stop mamie-backend

# Restart
pm2 restart mamie-backend
```

### Option 2: Docker

```bash
# Build image
docker build -t mamie-backend .

# Run container
docker run -p 8000:8000 --env-file .env mamie-backend
```

### Option 3: Systemd (Linux)

Create `/etc/systemd/system/mamie-backend.service`:

```ini
[Unit]
Description=MAMIE Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/backend
ExecStart=/usr/bin/node server-tradingview.js
Restart=always
Environment=NODE_ENV=production
Environment=PORT=8000

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl enable mamie-backend
sudo systemctl start mamie-backend

# Check status
sudo systemctl status mamie-backend
```

---

## 📚 Documentation

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/data/:symbol` - Historical data
- `GET /api/quote/:symbol` - Latest quote
- `GET /api/quotes?symbols=A,B,C` - Multiple quotes
- `GET /api/symbols` - Supported symbols
- `POST /api/cache/clear` - Clear cache
- `GET /api/cache/stats` - Cache statistics

### Symbol Format

**MAMIE Format → TradingView Format:**
- `GC=F` → `COMEX:GC1!`
- `BTC-USD` → `BINANCE:BTCUSDT`
- `EURUSD=X` → `FX:EURUSD`
- `^GSPC` → `TVC:SPX`
- `AAPL` → `NASDAQ:AAPL`

### Timeframe Format

**MAMIE Format → TradingView Format:**
- `1m` → `1`
- `5m` → `5`
- `15m` → `15`
- `1h` → `60`
- `4h` → `240`
- `1d` → `D`
- `1w` → `W`
- `1M` → `M`

---

## 💡 Tips

### Tip 1: Use TradingView Credentials

**RECOMMENDED** for better reliability and premium features.

See "Using TradingView Credentials" section above.

### Tip 2: Monitor Cache

```bash
# Check cache size
curl http://localhost:8000/api/cache/stats

# Clear cache if needed
curl -X POST http://localhost:8000/api/cache/clear
```

### Tip 3: Test Multiple Symbols

```bash
# Test various symbols
curl "http://localhost:8000/api/quote/GC=F"
curl "http://localhost:8000/api/quote/BTC-USD"
curl "http://localhost:8000/api/quote/EURUSD=X"
curl "http://localhost:8000/api/quote/^GSPC"
curl "http://localhost:8000/api/quote/AAPL"
```

### Tip 4: Use Batch API

```bash
# Get multiple quotes at once (more efficient)
curl "http://localhost:8000/api/quotes?symbols=GC=F,CL=F,BTC-USD,ETH-USD,AAPL,MSFT"
```

### Tip 5: Check Logs

```bash
# Development mode
npm run dev

# Production with PM2
pm2 logs mamie-backend

# Docker
docker logs <container_id>
```

---

## ✅ Checklist

### Setup Checklist

- [ ] Node.js 18+ installed
- [ ] `cd backend`
- [ ] `npm install`
- [ ] `cp .env.example-tradingview .env`
- [ ] Configure `.env` (optional: add TV credentials)
- [ ] `npm run dev`
- [ ] Test health: `curl http://localhost:8000/api/health`
- [ ] Test data: `curl "http://localhost:8000/api/data/GC=F?timeframe=1d&count=10"`
- [ ] Configure frontend: `VITE_API_BASE=http://localhost:8000`
- [ ] Run frontend: `npm run dev`
- [ ] Verify data appears in UI

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS origins
- [ ] Setup reverse proxy (Nginx)
- [ ] Configure SSL/HTTPS
- [ ] Setup PM2 or Docker
- [ ] Setup monitoring
- [ ] Setup logging
- [ ] Configure rate limiting
- [ ] Setup backup and recovery
- [ ] Test failover scenarios

---

## 🎉 Success!

If you see data in the UI, you're done! 🎊

**Next Steps:**
1. Monitor performance
2. Add TradingView credentials (optional)
3. Deploy to production
4. Add more symbols if needed

---

## 📞 Support

### Documentation

- **TradingView-API GitHub:** https://github.com/Mathieu2301/TradingView-API
- **npm Package:** https://www.npmjs.com/package/@mathieuc/tradingview
- **Backend README:** `backend/README-TRADINGVIEW.md`
- **Solution Guide:** `docs/data-sources/TRADINGVIEW_API_SOLUTION.md`

### Common Questions

**Q: Do I need TradingView account?**  
A: No, but recommended for premium features.

**Q: Is it free?**  
A: Yes, completely free for basic usage.

**Q: How fast is it?**  
A: < 500ms response time, real-time via WebSocket.

**Q: Can I use it in production?**  
A: Yes, but add TradingView credentials for better reliability.

**Q: What if TradingView-API is down?**  
A: Frontend automatically falls back to Yahoo Finance via CORS proxy.

---

**Status:** ✅ READY TO USE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-XX
