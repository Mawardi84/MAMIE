# 🔧 CORS Error Fix Guide

## Problem

You're seeing CORS errors when trying to fetch data from Yahoo Finance API:

```
Access to fetch at 'https://query1.finance.yahoo.com/...' from origin '...' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

All CORS proxies are returning **403 Forbidden** errors.

## Root Cause

1. **Yahoo Finance API** doesn't allow direct browser requests (CORS blocked)
2. **Public CORS proxies** (corsproxy.io, allorigins.win, etc.) are:
   - Rate-limited
   - Often blocked by Yahoo Finance
   - Unreliable for production use
3. **No backend proxy** configured to bypass CORS

## Solutions (Choose One)

### ✅ Solution 1: Deploy to Vercel (RECOMMENDED - Easiest)

We've created a serverless function that acts as a proxy. This is the most reliable free solution.

**Steps:**

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose "Yes" to deploy
   - Wait for deployment to complete

3. **Access your app**:
   - Vercel will give you a URL like: `https://your-app.vercel.app`
   - The serverless function is automatically available at `/api/proxy`
   - CORS errors will be resolved!

**Why this works:**
- Serverless functions run on the server (no CORS issues)
- Free tier includes 100GB bandwidth/month
- Automatic HTTPS
- Global CDN for fast responses

---

### ✅ Solution 2: Use Backend API (Most Reliable)

Set up the Node.js backend with TradingView-API:

**Steps:**

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the backend**:
   ```bash
   npm start
   ```
   Backend will run on `http://localhost:8000`

4. **Configure frontend**:
   Create/edit `.env` file in root directory:
   ```env
   VITE_API_BASE=http://localhost:8000
   ```

5. **Restart frontend**:
   ```bash
   npm run dev
   ```

**Why this works:**
- Backend runs on server (no CORS issues)
- Uses TradingView-API (more reliable than Yahoo Finance)
- Real-time data support
- Better error handling

---

### ✅ Solution 3: Use Alternative Free APIs

If you don't want to deploy, use APIs that support CORS:

#### Option A: Alpha Vantage (Free Tier)

1. **Get free API key**: https://www.alphavantage.co/support/#api-key
2. **Update `.env`**:
   ```env
   VITE_ALPHA_VANTAGE_KEY=your_api_key_here
   ```
3. **Update `dataService.ts`** to use Alpha Vantage endpoints

#### Option B: Twelve Data (Free Tier)

1. **Get free API key**: https://twelvedata.com/
2. **Update `.env`**:
   ```env
   VITE_TWELVE_DATA_KEY=your_api_key_here
   ```
3. **Update `dataService.ts`** to use Twelve Data endpoints

**Pros:**
- No CORS issues
- Reliable
- Free tier available

**Cons:**
- Requires API key registration
- Rate limits on free tier

---

### ✅ Solution 4: Use Public CORS Proxies (Temporary Fix)

If you need a quick fix and don't care about reliability:

**Updated CORS proxies in `dataService.ts`:**
```typescript
const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.org/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url: string) => `https://proxy.cors.sh/${url}`,
  (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
];
```

**⚠️ Warning:** These proxies are:
- Unreliable (often down or rate-limited)
- Slow (add latency)
- Not suitable for production
- May stop working at any time

**Use only for development/testing!**

---

## Recommended Approach

### For Development:
Use **Solution 2** (Backend API) - most reliable and feature-rich

### For Production:
Use **Solution 1** (Vercel Deployment) - easiest and free

### For Quick Testing:
Use **Solution 4** (Public CORS Proxies) - but expect failures

---

## Implementation Details

### Files Created/Modified:

1. **`api/proxy.ts`** - Vercel serverless function
   - Proxies requests to Yahoo Finance
   - Handles CORS headers
   - Caches responses (1 minute)

2. **`vercel.json`** - Vercel configuration
   - Routes `/api/proxy` to serverless function
   - Sets CORS headers

3. **`src/services/dataService.ts`** - Updated CORS proxy logic
   - Detects Vercel environment
   - Uses serverless function when available
   - Falls back to public proxies
   - Better error messages

4. **`backend/server-tradingview.js`** - Backend API (already created)
   - Uses TradingView-API
   - More reliable than Yahoo Finance
   - Real-time data support

---

## Testing the Fix

### Test Vercel Deployment:

1. Deploy to Vercel:
   ```bash
   vercel
   ```

2. Access your app at the Vercel URL

3. Open browser console (F12)

4. Navigate to Executive Dashboard

5. Check console logs:
   - Should see: `✓ Successfully fetched via proxy 1`
   - No CORS errors
   - Data should load successfully

### Test Backend API:

1. Start backend:
   ```bash
   cd backend
   npm start
   ```

2. Start frontend:
   ```bash
   npm run dev
   ```

3. Open browser console (F12)

4. Navigate to Executive Dashboard

5. Check console logs:
   - Should see: `📥 Fetching data for GC=F...`
   - No CORS errors
   - Data should load successfully

---

## Troubleshooting

### Issue: Still getting CORS errors after Vercel deployment

**Solution:**
1. Check if serverless function is deployed:
   ```bash
   vercel ls
   ```

2. Check Vercel logs:
   ```bash
   vercel logs
   ```

3. Verify `/api/proxy` endpoint works:
   ```
   https://your-app.vercel.app/api/proxy?symbol=AAPL&range=1d&interval=1d
   ```

### Issue: Backend API not connecting

**Solution:**
1. Check if backend is running:
   ```bash
   curl http://localhost:8000/api/health
   ```

2. Check `.env` file:
   ```env
   VITE_API_BASE=http://localhost:8000
   ```

3. Restart both backend and frontend

### Issue: All CORS proxies returning 403

**Solution:**
This means Yahoo Finance is blocking all public proxies. You MUST use:
- Vercel deployment (Solution 1), OR
- Backend API (Solution 2), OR
- Alternative API (Solution 3)

Public CORS proxies will NOT work reliably.

---

## Performance Comparison

| Solution | Reliability | Speed | Cost | Setup Time |
|----------|-------------|-------|------|------------|
| Vercel Serverless | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free | 5 min |
| Backend API | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free | 10 min |
| Alpha Vantage | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Free tier | 15 min |
| Public CORS Proxies | ⭐ | ⭐⭐ | Free | 0 min |

---

## Next Steps

1. **Choose a solution** based on your needs
2. **Implement the solution** following the steps above
3. **Test thoroughly** to ensure CORS errors are resolved
4. **Monitor performance** and reliability

---

## Support

If you're still having issues:

1. Check browser console for detailed error messages
2. Check network tab for failed requests
3. Verify your chosen solution is properly configured
4. Review the troubleshooting section above

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-XX  
**Status:** ACTIVE
