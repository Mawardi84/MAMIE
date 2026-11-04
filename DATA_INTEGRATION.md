# XAU/USD Quantitative Research Platform - Data Integration Guide

## 📊 Real-Time Data Sources

Platform ini sekarang menggunakan **data real-time** dari API publik gratis. Berikut adalah sumber data yang diintegrasikan:

### 1. Yahoo Finance API (Primary Price Data)
**Endpoint**: `https://query1.finance.yahoo.com/v8/finance/chart/`

**Data yang tersedia**:
- ✅ **XAU/USD Spot** (`XAUUSD=X`) - Real-time gold spot price
- ✅ **Gold Futures** (`GC=F`) - COMEX gold futures historical data
- ✅ **DXY - US Dollar Index** (`DX-Y.NYB`) - Dollar strength indicator
- ✅ **VIX** (`^VIX`) - Volatility index
- ✅ **Silver Futures** (`SI=F`) - Silver price for correlation analysis
- ✅ **US 10Y Treasury** (`^TNX`) - 10-year yield

**Update Frequency**: 
- Spot price: Real-time (refresh every 60 seconds)
- Historical data: Daily/weekly/monthly bars

**Coverage**:
- Intraday: 1m, 5m, 15m, 1h intervals
- Daily: Up to 20+ years
- Weekly/Monthly: Full history

### 2. CFTC Commitment of Traders (COT) Reports
**Endpoint**: `https://publicreporting.cftc.gov/resource/6dca-aqww.json`

**Data yang tersedia**:
- ✅ **Non-Commercial (Speculative) Positions** - Long/Short/Spreading
- ✅ **Commercial (Hedger) Positions** - Long/Short/Spreading
- ✅ **Producer/Merchant Positions**
- ✅ **Swap Dealer Positions**
- ✅ **Total Reportable Positions**

**Update Frequency**: Weekly (released Friday at 3:30 PM ET for Tuesday data)

**History**: 20+ years of weekly data

### 3. FRED (Federal Reserve Economic Data)
**Endpoint**: `https://api.stlouisfed.org/fred/series/observations`

**Data yang tersedia**:
- ✅ **Federal Funds Rate** (`FEDFUNDS`)
- ✅ **CPI - Consumer Price Index** (`CPIAUCSL`)
- ✅ **Real Yields** (calculated from Treasury - CPI)
- ✅ **GDP** (`GDP`)
- ✅ **Unemployment Rate** (`UNRATE`)

**API Key**: Free registration required at https://fred.stlouisfed.org/docs/api/api_key.html
- Use `DEMO_KEY` for testing (limited to 500 requests/day)
- Get your own key for production use

**Update Frequency**: Monthly/Quarterly depending on indicator

---

## 🔧 Implementation Details

### Data Service Layer (`src/services/dataService.ts`)

```typescript
// Core functions:
- fetchGoldSpotPrice()          // Real-time XAU/USD
- fetchGoldPriceData()          // Historical OHLCV
- fetchCOTData()                // CFTC positioning
- fetchDXYData()                // Dollar index
- fetchVIXData()                // Volatility index
- fetchUS10YData()              // Treasury yields
- fetchSilverData()             // Silver prices
- calculateRealizedVolatility() // 20-day rolling vol
- calculateCorrelation()        // Pearson correlation
```

### React Hooks (`src/hooks/useDataHooks.ts`)

Custom hooks for data fetching with automatic caching and refresh:

```typescript
useGoldSpotPrice()      // Updates every 60 seconds
useGoldPriceHistory()   // Daily/weekly/monthly bars
useCOTData()           // Weekly COT reports (24h cache)
useDXYData()           // Dollar index history
useVIXData()           // VIX history
useSilverData()        // Silver history
useVolatility()        // Calculated realized vol
useCorrelation()       // Calculated correlations
```

### Caching Strategy

- **Spot Price**: 60 seconds (1 minute)
- **Historical Data**: 5 minutes
- **COT Data**: 24 hours (weekly updates)
- **Macro Data**: 1 hour

Cache implemented using in-memory Map with TTL.

---

## ⚠️ CORS Considerations

### Browser-Based API Calls

Some APIs may have CORS restrictions when called directly from the browser:

**Yahoo Finance**: ✅ Works directly from browser
**CFTC API**: ✅ Works directly from browser  
**FRED API**: ✅ Works with API key

### Production Deployment

For production use, consider implementing a backend proxy:

```javascript
// Example: Express.js proxy
app.get('/api/gold', async (req, res) => {
  const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/XAUUSD=X');
  const data = await response.json();
  res.json(data);
});
```

Benefits of backend proxy:
- Bypass CORS restrictions
- Add authentication/rate limiting
- Aggregate multiple API calls
- Implement server-side caching
- Add data validation/transformation

---

## 📈 Data Quality & Validation

### Automated Checks

1. **Price Sanity**: Reject prices outside reasonable range ($1000-$5000 for gold)
2. **Volume Validation**: Ensure volume > 0
3. **Timestamp Validation**: Check for gaps in time series
4. **Correlation Bounds**: Verify correlations are between -1 and 1

### Error Handling

- Graceful degradation when APIs fail
- Fallback to cached data
- User-friendly error messages
- Retry mechanisms with exponential backoff

---

## 🔄 Data Refresh Schedule

| Data Type | Refresh Interval | Cache Duration | Source |
|-----------|------------------|----------------|--------|
| Gold Spot | 60 seconds | 1 minute | Yahoo Finance |
| Gold History | On demand | 5 minutes | Yahoo Finance |
| COT Reports | Weekly (Friday) | 24 hours | CFTC |
| DXY | On demand | 5 minutes | Yahoo Finance |
| VIX | On demand | 5 minutes | Yahoo Finance |
| Silver | On demand | 5 minutes | Yahoo Finance |
| US 10Y | On demand | 5 minutes | Yahoo Finance |

---

## 🧮 Calculated Metrics

### Realized Volatility
```typescript
// 20-day rolling annualized volatility
Formula: sqrt(variance(log_returns)) * sqrt(252) * 100
```

### Correlation
```typescript
// Pearson correlation coefficient
Formula: cov(X,Y) / (std(X) * std(Y))
```

### COT Net Positioning
```typescript
// Speculative net position
Formula: NonCommercial_Long - NonCommercial_Short
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure FRED API Key (Optional)
Edit `src/services/dataService.ts`:
```typescript
export async function fetchFREDData(
  seriesId: string,
  apiKey: string = 'YOUR_FRED_API_KEY'  // Replace DEMO_KEY
): Promise<MacroData[]> {
  // ...
}
```

Get your free API key: https://fred.stlouisfed.org/docs/api/api_key.html

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 📊 Dashboard Modules

### 1. Main Dashboard
- Real-time gold spot price
- 1-month price chart
- Realized volatility chart
- COT positioning summary
- Macro correlations (DXY, Silver, VIX)

### 2. Liquidity Analysis
- Market depth visualization
- Volume profile analysis
- Absorption detection
- Liquidity vacuum identification

### 3. Order Flow
- Aggressive buy/sell volume
- Cumulative delta (CVD)
- Delta-price divergence
- Flow decomposition

### 4. COMEX ↔ Spot Integration
- Basis spread analysis
- Z-score normalization
- COT positioning breakdown
- Arbitrage opportunity detection

### 5. Probability Models
- Return distribution analysis
- Regime transition matrix
- Scenario probability assessment
- GARCH/HMM model outputs

### 6. Backtesting
- Equity curve
- Monthly returns distribution
- Rolling performance metrics
- Statistical validation tests

### 7. AI Engine
- Processing pipeline architecture
- Research phase tracking
- System boundaries & limitations
- Technical stack overview

### 8. Data Sources
- Free-first strategy visualization
- Tier 1/2/3 data source details
- Module integration map
- Acquisition status tracker

---

## 🔒 Rate Limits & Best Practices

### Yahoo Finance
- **Limit**: ~2000 requests/hour (unofficial)
- **Best Practice**: Cache aggressively, batch requests

### CFTC API
- **Limit**: 1000 requests/hour
- **Best Practice**: Cache for 24 hours (weekly data)

### FRED API
- **Limit**: 500 requests/day (DEMO_KEY), 120 requests/minute (registered)
- **Best Practice**: Register for API key, cache monthly data

---

## 🐛 Troubleshooting

### "Cannot read properties of null" Error
**Cause**: Using raw `<rect>` elements in recharts Bar components  
**Solution**: Use `<Cell>` component instead (already fixed)

### CORS Errors
**Cause**: Browser blocking cross-origin requests  
**Solution**: 
1. Use APIs that support CORS (Yahoo Finance, CFTC)
2. Implement backend proxy for production
3. Use CORS proxy for development (not recommended for production)

### Data Not Loading
**Check**:
1. Internet connection
2. API endpoint availability
3. Browser console for errors
4. Rate limit exceeded

---

## 📚 API Documentation

- **Yahoo Finance**: https://www.yahoofinanceapi.com/
- **CFTC COT**: https://www.cftc.gov/MarketReports/CommitteesofTraders/index.htm
- **FRED API**: https://fred.stlouisfed.org/docs/api/fred/

---

## 🎯 Future Enhancements

1. **WebSocket Integration**: Real-time streaming data
2. **Backend Proxy**: Centralized API management
3. **Database Storage**: Historical data persistence
4. **Alert System**: Price/volatility alerts
5. **Advanced Analytics**: Machine learning models
6. **Multi-Asset Support**: Silver, oil, crypto correlations
7. **Custom Dashboards**: User-configurable views
8. **Export Functionality**: CSV/PDF reports

---

## 📝 License & Attribution

Data provided by:
- Yahoo Finance (market data)
- CFTC (COT reports)
- FRED (macroeconomic data)

This platform is for **research and educational purposes only**. Not financial advice.

---

## 🤝 Support

For issues or questions:
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Review rate limits
4. Check cache status

---

**Last Updated**: 2026-01-XX  
**Version**: 2.1.0  
**Status**: ✅ Production Ready with Real Data
