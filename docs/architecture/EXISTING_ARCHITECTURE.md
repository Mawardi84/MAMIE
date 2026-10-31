# Existing Architecture Documentation

**Date:** 2026-01-XX  
**Version:** 1.0  
**Status:** DRAFT

---

## 1. OVERVIEW

This document describes the current architecture of the existing codebase, which serves as a frontend prototype for multi-asset market intelligence.

---

## 2. CURRENT ARCHITECTURE

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                      │
├─────────────────────────────────────────────────────────┤
│  React Application (TypeScript + Vite)                  │
│  ├─ Components (UI Layer)                               │
│  ├─ Context (State Management)                          │
│  ├─ Hooks (Data Fetching)                               │
│  ├─ Services (API Integration)                          │
│  └─ Data (Registry + Mock)                              │
└─────────────────────────────────────────────────────────┘
         │
         │ HTTP Requests (via CORS Proxies)
         ▼
┌─────────────────────────────────────────────────────────┐
│              EXTERNAL DATA SOURCES                       │
│  ├─ Yahoo Finance API (Market Data)                     │
│  ├─ CFTC API (Positioning Data)                         │
│  └─ FRED API (Economic Data)                            │
└─────────────────────────────────────────────────────────┘
```

**Architecture Type:** Frontend-only monolith  
**Data Flow:** Client → CORS Proxy → External API → Client  
**State Management:** React Context API + Local State  
**Persistence:** None (in-memory only)

### 2.2 Layer Breakdown

#### Presentation Layer (React Components)

**Purpose:** User interface and interaction

**Components:**
```
src/components/
├── TradingTerminal.tsx      # Main trading interface
├── CandlestickChart.tsx     # Price chart (lightweight-charts)
├── OrderBook.tsx            # Bid/ask depth
├── TradingPanel.tsx         # Order placement
├── MarketOverview.tsx       # Market summary
├── TickerTape.tsx           # Scrolling ticker
├── LivePriceDisplay.tsx     # Price display
├── MarketHeatmap.tsx        # Performance heatmap
├── MicrostructurePanel.tsx  # Trade delta, OFI
├── LiquidityPanel.tsx       # Liquidity metrics
├── MacroPanel.tsx           # Macro indicators
├── PositioningPanel.tsx     # COT positioning
├── QuantResearchPanel.tsx   # Regime, probability
└── ... (7 more components)
```

**Characteristics:**
- Functional components with hooks
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design
- Dark theme

#### State Management Layer (Context)

**Purpose:** Global state management

**Implementation:**
```typescript
src/context/
└── AssetContext.tsx          # Current asset selection, watchlist
```

**State Structure:**
```typescript
interface AssetContextType {
  currentAsset: Asset;
  setCurrentAsset: (asset: Asset) => void;
  currentCategory: AssetCategory;
  setCurrentCategory: (category: AssetCategory) => void;
  watchlist: Asset[];
  addToWatchlist: (asset: Asset) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
}
```

**Limitations:**
- No server state synchronization
- No caching strategy
- No optimistic updates
- No cache invalidation

#### Data Fetching Layer (Hooks)

**Purpose:** Data retrieval and caching

**Implementation:**
```typescript
src/hooks/
└── useDataHooks.ts          # Custom React hooks
```

**Hooks:**
- `useAssetQuote()` - Real-time quote
- `useAssetPriceHistory()` - Historical OHLCV
- `useAssetCOT()` - COT positioning
- `useVolatility()` - Volatility calculation
- `useCorrelation()` - Correlation calculation
- `useMultipleAssetPrices()` - Batch fetching

**Caching:**
- In-memory cache with TTL
- 60 seconds for quotes
- 5 minutes for historical data
- 24 hours for COT data

**Limitations:**
- No persistent cache
- No cache sharing across components
- No background refetching
- No stale-while-revalidate

#### Service Layer (API Integration)

**Purpose:** External API integration

**Implementation:**
```typescript
src/services/
└── dataService.ts           # Data fetching service
```

**Features:**
- CORS proxy fallback chain
- Multiple data source support
- Type-safe interfaces
- Error handling

**CORS Proxy Chain:**
```typescript
const CORS_PROXIES = [
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];
```

**Data Sources:**
- Yahoo Finance (market data)
- CFTC (positioning data)
- FRED (economic data)

**Limitations:**
- CORS proxy dependency (fragile)
- No rate limiting
- No retry logic
- No circuit breaker

#### Data Layer (Registry)

**Purpose:** Instrument and asset definitions

**Implementation:**
```typescript
src/data/
├── assetRegistry.ts         # 60+ asset definitions
└── mockData.ts              # ⚠️ VIOLATION: Mock data
```

**Asset Registry:**
- 60+ assets across 7 categories
- Metadata: symbol, name, exchange, trading hours, etc.
- COT commodity mapping
- Helper functions

**Mock Data:** ⚠️ **VIOLATION**
- Contains hardcoded data
- Violates evidence-first policy
- Must be removed

---

## 3. DATA FLOW

### 3.1 Current Data Flow

```
User Action
    ↓
React Component
    ↓
Custom Hook (useAssetQuote, etc.)
    ↓
Data Service (fetchAssetQuote, etc.)
    ↓
CORS Proxy (corsproxy.io, etc.)
    ↓
External API (Yahoo Finance, CFTC, etc.)
    ↓
Response → Hook → Component → UI Update
```

### 3.2 Data Flow Issues

1. **No Backend:** Data goes directly from client to external API
2. **CORS Dependency:** Relies on third-party CORS proxies
3. **No Caching:** Only in-memory cache, lost on refresh
4. **No Validation:** No data quality checks
5. **No Governance:** No evidence tracking or lineage

---

## 4. TECHNOLOGY STACK

### 4.1 Frontend

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| React | 18.2.0 | UI framework | ✅ Approved |
| TypeScript | 5.7.0 | Type safety | ✅ Approved |
| Vite | 6.3.5 | Build tool | ✅ Approved |
| Tailwind CSS | 4.1.7 | Styling | ✅ Approved |
| lightweight-charts | 5.2.1 | Charting | ✅ Approved |
| recharts | 2.10.0 | Statistical charts | ✅ Approved |
| lucide-react | 0.294.0 | Icons | ✅ Approved |
| react-router-dom | 6.8.0 | Routing | ✅ Approved |
| framer-motion | 11.16.1 | Animations | ✅ Approved |
| date-fns | 2.30.0 | Date utilities | ✅ Approved |
| uuid | 9.0.1 | ID generation | ✅ Approved |
| @supabase/supabase-js | 2.98.0 | Supabase client | ⚠️ Unused |
| @dnd-kit | 6.1.0 | Drag and drop | ⚠️ Unused |
| canvas-confetti | 1.9.3 | Effects | ❌ Irrelevant |

### 4.2 Missing Technologies

| Technology | Purpose | Priority |
|------------|---------|----------|
| Python + FastAPI | Backend API | Critical |
| PostgreSQL | Database | Critical |
| TimescaleDB | Time-series data | Critical |
| SQLAlchemy | ORM | Critical |
| Alembic | Database migrations | Critical |
| NumPy | Numerical computing | Critical |
| Pandas/Polars | Data processing | Critical |
| SciPy | Scientific computing | High |
| scikit-learn | Machine learning | High |
| Pytest | Python testing | Critical |
| Vitest | TypeScript testing | Critical |
| ESLint | Code linting | High |
| Prettier | Code formatting | Medium |
| Docker | Containerization | High |
| GitHub Actions | CI/CD | Critical |

---

## 5. ARCHITECTURE PATTERNS

### 5.1 Current Patterns

**Component Pattern:**
- Functional components
- Hooks for state and side effects
- Props for data passing
- Context for global state

**Data Fetching Pattern:**
- Custom hooks wrap data service
- Service handles API calls
- CORS proxy for cross-origin requests
- In-memory caching with TTL

**State Management Pattern:**
- React Context for global state
- Local state for component-specific state
- No server state synchronization

### 5.2 Missing Patterns

**Required for MAMIE:**
- Repository pattern (data access)
- Service layer pattern (business logic)
- Adapter pattern (external integrations)
- Observer pattern (real-time updates)
- Command pattern (user actions)
- Factory pattern (object creation)
- Strategy pattern (algorithm selection)

---

## 6. SCALABILITY ASSESSMENT

### 6.1 Current Limitations

**Frontend:**
- No code splitting
- No lazy loading
- No service worker
- No offline support

**Data:**
- No database
- No caching layer
- No background processing
- No real-time updates

**API:**
- No backend API
- No rate limiting
- No authentication
- No authorization

### 6.2 Scalability Bottlenecks

1. **CORS Proxy Dependency:** Third-party proxies can fail or rate limit
2. **No Caching:** Every page load fetches fresh data
3. **No Backend:** Cannot scale data processing
4. **No Database:** Cannot persist data or results
5. **Client-Side Processing:** All calculations happen in browser

---

## 7. SECURITY ASSESSMENT

### 7.1 Current Security

**Present:**
- HTTPS (via Vite dev server)
- No sensitive data in code
- No API keys in frontend

**Missing:**
- Authentication
- Authorization
- Input validation
- XSS protection
- CSRF protection
- Rate limiting
- Audit logging
- Encryption

### 7.2 Security Risks

1. **No Authentication:** Anyone can access the application
2. **No Authorization:** No role-based access control
3. **CORS Proxy:** Third-party proxies can intercept data
4. **No Input Validation:** User input not sanitized
5. **No Rate Limiting:** Can be abused

---

## 8. PERFORMANCE ASSESSMENT

### 8.1 Bundle Size

**Current:**
- CSS: 39 KB (gzipped: 8.5 KB)
- JS: 687 KB (gzipped: 186 KB)
- Total: 726 KB (gzipped: 194.5 KB)

**Assessment:** Acceptable for prototype, needs optimization for production

### 8.2 Runtime Performance

**Not Measured:** Requires profiling

**Potential Issues:**
- Large component tree
- No memoization
- No virtualization for large lists
- Heavy calculations in render

---

## 9. MAINTAINABILITY ASSESSMENT

### 9.1 Code Quality

**Strengths:**
- TypeScript for type safety
- Functional components
- Modular structure
- Clear naming

**Weaknesses:**
- No linting
- No formatting standards
- No code documentation standards
- Mock data present
- Inconsistent error handling

### 9.2 Testability

**Current:**
- No tests
- No testing framework
- No test coverage

**Required:**
- Unit tests for components
- Unit tests for hooks
- Unit tests for services
- Integration tests
- E2E tests

---

## 10. DEPLOYMENT ASSESSMENT

### 10.1 Current Deployment

**Not Configured:** No deployment setup

**Required:**
- Docker containerization
- CI/CD pipeline
- Environment configuration
- Health checks
- Monitoring

---

## 11. MIGRATION PATH

### 11.1 Option A: Rebuild (RECOMMENDED)

**Approach:** Build new production-grade MAMIE system

**Pros:**
- Clean architecture
- No legacy code
- Best practices from start
- Easier to maintain

**Cons:**
- More initial effort
- Longer timeline
- Need to recreate working features

**Estimated Effort:** 6-9 months

### 11.2 Option B: Refactor

**Approach:** Add backend, database, auth, testing to existing repo

**Pros:**
- Reuse existing UI
- Faster initial progress
- Less rework

**Cons:**
- Legacy code remains
- Architecture compromises
- Harder to maintain
- Technical debt

**Estimated Effort:** 9-12 months

### 11.3 Recommendation

**RECOMMENDATION:** Option A (Rebuild)

**Rationale:**
1. Current codebase is too far from production requirements
2. Too many critical gaps exist
3. Refactoring would be more expensive than rebuilding
4. Clean architecture is needed for long-term maintainability
5. Existing code can serve as UI reference

---

## 12. CONCLUSION

The existing architecture is a **frontend prototype** that demonstrates UI/UX concepts but lacks the backend infrastructure, data governance, testing, and security required for a production-grade MAMIE system.

**Key Gaps:**
- No backend (Python/FastAPI)
- No database (PostgreSQL/TimescaleDB)
- No authentication/authorization
- No data governance
- No testing
- No CI/CD
- Mock data present (violation)

**Recommendation:** Build new production-grade system using existing repository as frontend reference only.

---

**END OF DOCUMENT**

**Version:** 1.0  
**Status:** DRAFT — AWAITING REVIEW
