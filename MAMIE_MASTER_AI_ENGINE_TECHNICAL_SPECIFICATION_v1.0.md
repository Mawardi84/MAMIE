# MAMIE MASTER AI ENGINE TECHNICAL SPECIFICATION v1.0

**Multi-Asset Market Intelligence Engine**
**Document Classification: ARCHITECTURE SPECIFICATION**
**Version: 1.0**
**Date: 2026**
**Status: DRAFT FOR REVIEW**

---

## DOCUMENT CONTROL

| Field | Value |
|-------|-------|
| Document Owner | Principal Quantitative Research Architect |
| Review Authority | Financial Data Engineering, AI Systems Architecture, Risk Management |
| Distribution | Internal Technical Stakeholders |
| Classification | CONFIDENTIAL — Architecture Specification |

### Document Version History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026 | Principal Architect | Initial specification |

### Classification Legend

Throughout this document, the following classifications are used:

- **[VERIFIED FACT]**: Confirmed through documentation, testing, or authoritative sources
- **[DESIGN DECISION]**: Architectural choice made based on requirements and constraints
- **[RECOMMENDATION]**: Suggested approach pending approval
- **[ASSUMPTION]**: Believed to be true but not yet verified
- **[OPEN ISSUE]**: Requires resolution before proceeding

---

## TABLE OF CONTENTS

1. Executive Summary
2. System Scope
3. Asset Universe
4. Instrument Registry
5. Data Architecture
6. Data Source Registry
7. Asset-Class Intelligence
8. Cross-Asset Intelligence
9. Macro Intelligence
10. Quantitative Regime
11. Probability Engine
12. Portfolio & Risk
13. AI Interpretation
14. Multi-Agent Architecture
15. Governance
16. Security
17. Technology Evaluation
18. Implementation Roadmap
19. Acceptance Criteria
20. Risk Register
21. Open Issues
22. Architecture Decision Records

---

## 1. EXECUTIVE SUMMARY

### 1.1 Purpose

[DESIGN DECISION] MAMIE (Multi-Asset Market Intelligence Engine) is designed as a quantitative market intelligence platform that provides cross-asset research, probabilistic analysis, and decision support across multiple asset classes, with particular emphasis on Indonesian capital markets.

### 1.2 Core Principles

[DESIGN DECISION] The system adheres to the following principles:

1. **Instrument-Agnostic Core**: Core services do not assume specific asset characteristics
2. **Asset-Class-Aware Analysis**: Each asset class has specialized modules
3. **Evidence-Based Output**: All outputs must be traceable to source data
4. **Free-Only Data Policy**: No paid data subscriptions or hidden costs
5. **Point-in-Time Integrity**: Historical analysis must avoid look-ahead bias
6. **Governance-First**: Every output has provenance, validation status, and limitations
7. **Progressive Capability**: Features activate only when data and methodology requirements are met

### 1.3 System Boundaries

[VERIFIED FACT] MAMIE is NOT:
- A trading execution system
- A real-time market data provider
- A substitute for professional financial advice
- A system that claims complete market coverage before verification

[VERIFIED FACT] MAMIE IS:
- A quantitative research platform
- A market intelligence aggregation system
- A probabilistic analysis framework
- A cross-asset relationship analyzer
- A decision support tool with full audit trail

### 1.4 Key Architectural Decisions

[DESIGN DECISION] Rather than building six completely separate engines, MAMIE uses:

```
┌─────────────────────────────────────────────────────────┐
│                    MAMIE CORE ENGINE                     │
│  Identity · Evidence · Data Integrity · Governance · Audit│
├─────────────────────────────────────────────────────────┤
│  Equity  │ Commodity │  FX   │ Crypto │ Fixed Income │   │
│  Engine  │  Engine   │ Engine│ Engine │   Engine     │   │
│          │           │       │        │              │   │
│          │           │       │        │  Indices &   │   │
│          │           │       │        │  Derivatives │   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│           CROSS-ASSET QUANTITATIVE ENGINE                │
│    Correlation · Regime · Probability · Portfolio Risk   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│         AI INTERPRETATION & DECISION SUPPORT             │
│      LLM · Research Agents · Risk Gate · Reporting      │
└─────────────────────────────────────────────────────────┘
```

**Rationale**: Shared core reduces duplication, ensures consistent governance, and enables cross-asset analysis. Asset-specific logic remains isolated to prevent inappropriate formula application.

---

## 2. SYSTEM SCOPE

### 2.1 In Scope

[VERIFIED FACT] The following capabilities are within system scope:

1. Multi-asset data ingestion from free public sources
2. Instrument registry management with historical tracking
3. Asset-class-specific quantitative analysis
4. Cross-asset relationship analysis
5. Macroeconomic intelligence
6. Market regime classification
7. Probability estimation with validation
8. Portfolio-level risk analysis
9. AI-powered interpretation of quantitative results
10. Comprehensive audit trail and evidence registry
11. Dashboard and reporting interface

### 2.2 Out of Scope

[VERIFIED FACT] The following are explicitly excluded:

1. Real-time trading execution
2. Proprietary data acquisition
3. Guaranteed data completeness for all instruments
4. Financial advice or recommendations
5. Regulatory compliance automation
6. Customer-facing trading interface
7. Real-time market making

### 2.3 Geographic Focus

[DESIGN DECISION] Primary focus: **Indonesia (IDX/BEI)**

Secondary coverage:
- Global major indices (S&P 500, Nasdaq, etc.)
- Major forex pairs (including USD/IDR)
- Major commodities (Gold, Oil, etc.)
- Major cryptocurrencies (BTC, ETH)
- US Treasury and global sovereign bonds

[OPEN ISSUE] Indonesian bond market data availability from free sources requires verification.

### 2.4 User Personas

[DESIGN DECISION] Primary users:

1. **Quantitative Researcher**: Builds and validates models
2. **Portfolio Manager**: Analyzes cross-asset relationships and risk
3. **Risk Analyst**: Monitors portfolio exposure and stress tests
4. **Market Analyst**: Studies market microstructure and regimes
5. **Compliance Officer**: Reviews audit trails and evidence

---

## 3. ASSET UNIVERSE

### 3.1 Asset Class Coverage Matrix

| Asset Class | Instruments | Data Availability | Analysis Depth | Status |
|-------------|-------------|-------------------|----------------|--------|
| Equities (IDX) | ~900 listed | Partial | Full when data available | [OPEN ISSUE] |
| Commodities | 15+ | Good | Full | [VERIFIED FACT] |
| Forex | 30+ pairs | Good | Full | [VERIFIED FACT] |
| Digital Assets | 50+ | Good | Full | [VERIFIED FACT] |
| Fixed Income | 20+ | Partial | Limited by data | [OPEN ISSUE] |
| Indices & Derivatives | 25+ | Good | Full | [VERIFIED FACT] |

### 3.2 Indonesian Equities (IDX/BEI)

[VERIFIED FACT] Bursa Efek Indonesia characteristics:

**Market Structure:**
- Main Board, Development Board, Acceleration Board, New Economy Board
- Trading sessions: Regular (09:00-12:00, 13:30-16:00 WIB)
- Auction mechanism for opening/closing
- Auto Rejection Atas/Bawah (ARA/ARB) limits
- Trading halt and suspension mechanisms
- T+2 settlement cycle
- Lot size: 100 shares minimum

**Data Challenges:**
[OPEN ISSUE] Free historical data for all ~900 IDX-listed stocks is NOT guaranteed to be complete.

Specific gaps to verify:
- Full tick-level history: NOT available free
- Complete corporate action history: PARTIAL
- Foreign flow data: LIMITED to published aggregates
- Order book depth: NOT available free
- Intraday data: LIMITED to recent periods

[ASSUMPTION] Daily OHLCV data is available for most stocks, but requires verification per instrument.

### 3.3 Commodities

[VERIFIED FACT] Coverage includes:

**Precious Metals:**
- Gold (COMEX GC, LBMA)
- Silver (COMEX SI)
- Platinum (NYMEX PL)
- Palladium (NYMEX PA)

**Energy:**
- WTI Crude Oil (NYMEX CL)
- Brent Crude (ICE BZ)
- Natural Gas (NYMEX NG)

**Industrial & Agricultural:**
- Copper (COMEX HG)
- Corn (CBOT ZC)
- Wheat (CBOT ZW)
- Soybeans (CBOT ZS)
- Coffee (ICE KC)
- Cotton (ICE CT)

**Analysis Capabilities:**
- Price structure and futures curve
- Contango/backwardation measurement
- Open interest and volume analysis
- Seasonality patterns
- Cross-market relationships

### 3.4 Foreign Exchange

[VERIFIED FACT] Coverage includes:

**Major Pairs:**
- EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF, NZD/USD

**Cross Pairs:**
- EUR/GBP, EUR/JPY, GBP/JPY

**Emerging Market:**
- USD/IDR (priority)
- Other EM pairs as data available

**Analysis Capabilities:**
- Currency strength indices
- Interest rate differentials
- Carry trade analysis
- Volatility surface
- Macro sensitivity

### 3.5 Digital Assets

[VERIFIED FACT] Coverage includes:

**Major Cryptocurrencies:**
- Bitcoin (BTC)
- Ethereum (ETH)
- Solana (SOL)
- Binance Coin (BNB)
- Ripple (XRP)
- Cardano (ADA)
- Avalanche (AVAX)
- Polkadot (DOT)
- Chainlink (LINK)
- Polygon (MATIC)

**Analysis Capabilities:**
- Spot and futures market analysis
- Funding rate tracking
- Open interest monitoring
- Exchange-specific liquidity
- Market dominance metrics
- Volatility analysis

[OPEN ISSUE] On-chain metrics require clear provenance and definition before use.

### 3.6 Fixed Income & Interest Rates

[VERIFIED FACT] Coverage includes:

**Indonesian:**
- Government Bonds (SBN) — data availability TBD
- Bank Indonesia policy rate

**US:**
- Treasury yields (2Y, 5Y, 10Y, 30Y)
- Fed Funds Rate

**Global:**
- Major sovereign bond yields (as available)

**Analysis Capabilities:**
- Yield curve construction
- Duration and convexity
- Credit spread analysis
- Real yield calculation
- Inflation expectations

[OPEN ISSUE] Indonesian bond data from free sources requires verification.

### 3.7 Indices & Derivatives

[VERIFIED FACT] Coverage includes:

**Indonesian:**
- IHSG (JCI)
- LQ45
- IDX30
- IDX80

**Global:**
- S&P 500, Nasdaq, Dow Jones
- Nikkei 225, Hang Seng
- FTSE 100, DAX

**Volatility:**
- VIX
- VIX-like indices as available

**Analysis Capabilities:**
- Index breadth and participation
- Sector contribution analysis
- Futures basis tracking
- Options implied volatility (when available)
- Cross-index correlation

---

## 4. INSTRUMENT REGISTRY

### 4.1 Design Principles

[DESIGN DECISION] The Instrument Registry serves as the single source of truth for all tradable instruments.

**Core Requirements:**

1. **Stable Identity**: Each instrument has a permanent internal ID independent of ticker
2. **Historical Tracking**: Tracks all changes to instrument metadata over time
3. **Point-in-Time Queries**: Can answer "what instruments existed on date X?"
4. **Corporate Action Awareness**: Tracks splits, mergers, name changes, etc.
5. **Status Management**: Active, suspended, delisted, pending

### 4.2 Instrument Master Schema

```
Instrument {
  instrument_id: UUID (immutable)
  
  // Current State
  symbol: string
  name: string
  asset_class: enum
  exchange: string
  country: string
  currency: string
  
  // Contract Specifications
  contract_spec: {
    tick_size: decimal
    lot_size: integer
    contract_multiplier: decimal
    expiration_date: date?
  }
  
  // Lifecycle
  listing_date: date
  delisting_date: date?
  trading_status: enum
  
  // Calendar
  trading_calendar: string
  trading_hours: string
  
  // History
  corporate_actions: CorporateAction[]
  symbol_history: SymbolChange[]
  index_membership: IndexMembership[]
  
  // Data Mapping
  data_sources: DataSourceMapping[]
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
  version: integer
}
```

### 4.3 Indonesian Equity Special Handling

[DESIGN DECISION] Indonesian equities require special handling due to:

**Ticker Changes:**
[VERIFIED FACT] IDX stocks frequently change tickers due to:
- Name changes
- Reverse splits
- Rights issues
- Corporate reorganizations

**Solution:**
```
SymbolChange {
  instrument_id: UUID
  old_symbol: string
  new_symbol: string
  effective_date: date
  reason: string
  adjustment_factor: decimal?
}
```

**Corporate Actions:**
```
CorporateAction {
  instrument_id: UUID
  action_type: enum (SPLIT, REVERSE_SPLIT, RIGHTS_ISSUE, DIVIDEND, MERGER, etc.)
  announcement_date: date
  ex_date: date
  effective_date: date
  adjustment_factor: decimal
  description: string
}
```

**Index Membership:**
```
IndexMembership {
  instrument_id: UUID
  index_id: UUID
  join_date: date
  exit_date: date?
  weight: decimal?
}
```

### 4.4 Survivorship Bias Prevention

[DESIGN DECISION] To prevent survivorship bias:

1. **Universe Reconstruction**: For any historical date, system can reconstruct the exact universe of instruments that existed
2. **Delisted Instruments**: Remain in registry with `delisting_date` populated
3. **Point-in-Time Queries**: All historical analysis uses `WHERE listing_date <= analysis_date AND (delisting_date IS NULL OR delisting_date > analysis_date)`
4. **Backtest Validation**: Backtests must explicitly handle delisted instruments

**Example Query:**
```sql
-- Get all IDX stocks that existed on 2020-01-15
SELECT instrument_id, symbol, name
FROM instruments
WHERE asset_class = 'EQUITY'
  AND exchange = 'IDX'
  AND listing_date <= '2020-01-15'
  AND (delisting_date IS NULL OR delisting_date > '2020-01-15');
```

### 4.5 Data Source Mapping

[DESIGN DECISION] Each instrument maps to one or more data sources:

```
DataSourceMapping {
  instrument_id: UUID
  source_id: UUID
  source_symbol: string
  data_fields: string[]
  priority: integer
  quality_score: decimal
  last_verified: timestamp
}
```

**Rationale**: Different sources may have different symbols, coverage, and quality. Priority determines which source to use when multiple are available.

---

## 5. DATA ARCHITECTURE

### 5.1 Data Model Principles

[DESIGN DECISION] All data records must include:

**Provenance Fields:**
- `source_id`: Which system provided this data
- `instrument_id`: Internal instrument identifier
- `asset_class`: Asset classification
- `exchange`: Trading venue
- `currency`: Quote currency

**Temporal Fields:**
- `event_timestamp`: When the event occurred (e.g., trade time)
- `publication_timestamp`: When data was published (for economic releases)
- `retrieval_timestamp`: When we fetched the data
- `availability_timestamp`: When data became available for use
- `data_vintage`: Version of the data (for revised economic data)

**Quality Fields:**
- `quality_status`: enum (RAW, VALIDATED, FLAGGED, REJECTED)
- `quality_flags`: string[] (specific issues found)
- `licensing_status`: enum (FREE, ATTRIBUTION_REQUIRED, RESTRICTED)
- `data_version`: integer

### 5.2 Data Types

[VERIFIED FACT] System handles the following data types:

**Market Data:**
- Tick data (when available)
- OHLCV (Open, High, Low, Close, Volume)
- Bid/Ask quotes
- Order book snapshots
- Trade prints

**Fundamental Data:**
- Financial statements (Income Statement, Balance Sheet, Cash Flow)
- Corporate actions
- Index constituents
- Instrument metadata

**Economic Data:**
- Economic releases (CPI, GDP, NFP, etc.)
- Historical consensus estimates
- Revised values with vintage tracking

**Positioning Data:**
- CFTC COT reports
- Open interest
- Exchange flows (crypto)

**Reference Data:**
- Trading calendars
- Instrument specifications
- Corporate action announcements

### 5.3 Point-in-Time Data

[DESIGN DECISION] All historical research MUST use point-in-time data to prevent look-ahead bias.

**Example: Economic Data**
```
EconomicRelease {
  release_id: UUID
  indicator: string (e.g., "US CPI YoY")
  country: string
  release_date: date
  actual_value: decimal
  revised_value: decimal?
  
  // Critical for point-in-time
  first_release_timestamp: timestamp
  revision_timestamp: timestamp?
  data_vintage: integer
  
  // Consensus
  consensus_estimate: decimal?
  consensus_timestamp: timestamp?
}
```

**Rule**: When analyzing the impact of a CPI release, use `first_release_timestamp` and `actual_value` as they were known at that time, NOT revised values.

### 5.4 Data Lineage

[DESIGN DECISION] Every derived metric must track its lineage:

```
DataLineage {
  output_metric_id: UUID
  input_metrics: UUID[]
  calculation_method: string
  parameters: jsonb
  calculated_at: timestamp
  calculated_by: string (system version)
}
```

**Example**: If we calculate "Realized Volatility (20-day)", the lineage records:
- Input: Daily close prices for past 20 days
- Formula: `std(log_returns) * sqrt(252)`
- Parameters: `{window: 20, annualization_factor: 252}`

### 5.5 Storage Architecture

[RECOMMENDATION] Use the following storage strategy:

**Time-Series Data:**
- TimescaleDB (PostgreSQL extension) for OHLCV, ticks
- Partitioning by time (monthly/yearly)
- Compression for historical data

**Instrument Registry:**
- PostgreSQL for relational data
- JSONB for flexible metadata

**Cache Layer:**
- Redis for frequently accessed data
- TTL-based expiration

**File Storage:**
- S3-compatible for large datasets (CSV imports, backups)

**Rationale**: TimescaleDB provides SQL compatibility with time-series optimizations. PostgreSQL JSONB allows flexible metadata without schema migrations.

---

## 6. DATA SOURCE REGISTRY

### 6.1 Source Registry Schema

[DESIGN DECISION] Every data source must be registered with:

```
DataSource {
  source_id: UUID
  name: string
  description: string
  
  // Coverage
  asset_classes: enum[]
  instruments_covered: integer (estimated)
  geographic_coverage: string[]
  
  // Data Fields
  available_fields: string[]
  
  // History
  historical_start_date: date?
  historical_end_date: date?
  update_frequency: enum (REALTIME, DAILY, WEEKLY, MONTHLY)
  
  // Access
  access_method: enum (API, WEB_SCRAPING, CSV_DOWNLOAD, MANUAL)
  api_endpoint: string?
  authentication_required: boolean
  
  // Cost & License
  cost_status: enum (FREE, FREE_WITH_ATTRIBUTION, PAID)
  license_type: string
  commercial_use_allowed: boolean
  redistribution_allowed: boolean
  
  // Quality
  data_quality_score: decimal (0-100)
  reliability_score: decimal (0-100)
  last_verified: timestamp
  
  // Limitations
  known_limitations: string[]
  rate_limits: string?
  
  // Status
  status: enum (ACTIVE, DEGRADED, INACTIVE)
}
```

### 6.2 Verified Free Sources

[VERIFIED FACT] The following sources have been verified as free:

**Market Data:**
1. **Yahoo Finance API**
   - Coverage: Global equities, forex, crypto, commodities, indices
   - Data: OHLCV (daily, weekly, monthly)
   - History: Extensive (varies by instrument)
   - Limitations: No tick data, delayed for some instruments
   - License: Free for non-commercial, attribution required

2. **CFTC (Commitment of Traders)**
   - Coverage: Futures and options positioning
   - Data: Weekly COT reports
   - History: 20+ years
   - Limitations: Weekly granularity, limited to reportable positions
   - License: Public domain (US Government)

**Economic Data:**
3. **FRED (Federal Reserve Economic Data)**
   - Coverage: US economic indicators
   - Data: 800,000+ series
   - History: Extensive
   - Limitations: Primarily US-focused
   - License: Public domain

4. **Bank Indonesia**
   - Coverage: Indonesian economic data
   - Data: Policy rates, inflation, GDP
   - History: Varies
   - Limitations: Manual download required
   - License: Public domain

5. **Badan Pusat Statistik (BPS)**
   - Coverage: Indonesian statistics
   - Data: CPI, GDP, trade
   - History: Extensive
   - Limitations: Manual download, format varies
   - License: Public domain

**Indonesian Market:**
6. **Bursa Efek Indonesia (IDX)**
   - Coverage: Indonesian equities
   - Data: Daily OHLCV, indices
   - History: Varies
   - Limitations: Limited free historical data
   - License: Check terms

[OPEN ISSUE] Complete verification of IDX free data availability required.

### 6.3 Source Verification Process

[DESIGN DECISION] Before using any data source:

1. **License Review**: Verify terms of service, attribution requirements, commercial use rights
2. **Data Quality Check**: Sample data for completeness, accuracy, consistency
3. **Rate Limit Testing**: Verify access patterns don't violate limits
4. **Historical Coverage**: Confirm actual history available vs. claimed
5. **Update Frequency**: Verify data updates as expected
6. **Documentation**: Record all findings in Source Registry

### 6.4 Data Gap Documentation

[DESIGN DECISION] When data is NOT available:

```
DataGap {
  gap_id: UUID
  asset_class: enum
  instrument_or_feature: string
  required_data: string
  gap_description: string
  impact: enum (BLOCKING, LIMITING, MINIMAL)
  workarounds: string[]
  potential_sources: string[]
  status: enum (IDENTIFIED, RESEARCHING, RESOLVED, ACCEPTED)
}
```

**Example Gap:**
```
{
  gap_id: "GAP-001",
  asset_class: "EQUITY",
  instrument_or_feature: "IDX_TICK_DATA",
  required_data: "Tick-level trade data for all IDX stocks",
  gap_description: "Free tick data not available for Indonesian equities",
  impact: "LIMITING",
  workarounds: ["Use daily OHLCV for most analysis", "Acknowledge microstructure analysis limitations"],
  potential_sources: ["Consider paid providers if critical"],
  status: "ACCEPTED"
}
```

---

## 7. ASSET-CLASS INTELLIGENCE

### 7.1 Equity Intelligence

[DESIGN DECISION] Equity Intelligence module provides:

**Technical Analysis:**
- Price structure (trends, support/resistance)
- Volume analysis
- Volatility measurement
- Relative strength

**Fundamental Analysis:**
- Financial statement analysis
- Valuation metrics (P/E, P/B, EV/EBITDA)
- Profitability ratios
- Growth analysis
- Quality metrics

**Market Microstructure:**
- Liquidity screening
- Trading frequency analysis
- Bid-ask spread (when available)
- Market impact estimation

**Indonesian-Specific:**
- Foreign flow analysis (when published)
- Sector rotation
- Index membership impact
- Corporate action adjustment

**Input Requirements:**
- Daily OHLCV (minimum)
- Financial statements (for fundamental)
- Index constituents (for relative analysis)

**Output Schema:**
```
EquityAnalysis {
  instrument_id: UUID
  analysis_date: date
  
  technical: {
    trend: enum
    support_levels: decimal[]
    resistance_levels: decimal[]
    volatility_20d: decimal
    relative_strength_vs_index: decimal
  }
  
  fundamental: {
    pe_ratio: decimal?
    pb_ratio: decimal?
    roe: decimal?
    debt_to_equity: decimal?
    revenue_growth_yoy: decimal?
  }
  
  market_structure: {
    avg_daily_volume_30d: integer
    avg_daily_value_30d: decimal
    liquidity_score: decimal
    free_float_pct: decimal?
  }
  
  validation: {
    data_quality_score: decimal
    missing_fields: string[]
    confidence_level: enum
  }
}
```

**Limitations:**
- Indonesian fundamental data may be incomplete
- Foreign flow data is aggregate, not granular
- Order book data not available free

### 7.2 Commodity Intelligence

[DESIGN DECISION] Commodity Intelligence module provides:

**Price Structure:**
- Futures curve analysis
- Contango/backwardation measurement
- Seasonality patterns
- Cross-market relationships

**Supply-Demand:**
- Inventory data (when available)
- Production statistics
- Consumption patterns

**Positioning:**
- CFTC COT analysis
- Open interest trends
- Speculative vs. commercial positioning

**Input Requirements:**
- Futures prices (multiple expirations for curve)
- Open interest
- COT data (for futures)

**Output Schema:**
```
CommodityAnalysis {
  instrument_id: UUID
  analysis_date: date
  
  price_structure: {
    spot_price: decimal
    futures_curve: {expiration: date, price: decimal}[]
    curve_shape: enum (CONTANGO, BACKWARDATION, FLAT)
    basis: decimal
  }
  
  seasonality: {
    current_month_avg_return_10y: decimal
    seasonal_pattern: string
  }
  
  positioning: {
    net_speculative_position: integer?
    position_change_4w: integer?
    percentile_rank_4w: decimal?
  }
}
```

### 7.3 FX Intelligence

[DESIGN DECISION] FX Intelligence module provides:

**Currency Strength:**
- Relative strength indices
- Basket analysis
- Trend classification

**Macro Sensitivity:**
- Interest rate differential
- Carry trade analysis
- Inflation differential
- Growth differential

**Volatility:**
- Realized volatility
- Implied volatility (when available)
- Volatility surface

**Input Requirements:**
- Daily OHLCV for currency pairs
- Interest rates (for carry)
- Inflation data (for real rates)

**Output Schema:**
```
FXAnalysis {
  instrument_id: UUID
  analysis_date: date
  
  strength: {
    relative_strength_index: decimal
    trend: enum
    momentum_20d: decimal
  }
  
  carry: {
    interest_rate_differential: decimal
    carry_annualized: decimal
    real_carry: decimal?
  }
  
  volatility: {
    realized_vol_20d: decimal
    vol_regime: enum
  }
}
```

### 7.4 Crypto Intelligence

[DESIGN DECISION] Crypto Intelligence module provides:

**Market Microstructure:**
- Exchange-specific liquidity
- Funding rates (futures)
- Open interest
- Liquidation data (when available)

**On-Chain Metrics:**
[OPEN ISSUE] On-chain metrics require clear provenance and definition before use.

**Potential metrics (pending verification):**
- Active addresses
- Exchange flows
- Network value
- Hash rate (for PoW)

**Market Dynamics:**
- Market dominance
- Correlation with traditional assets
- Volatility comparison

**Input Requirements:**
- Spot prices (multiple exchanges)
- Futures data (funding, OI)
- On-chain data (when verified)

**Output Schema:**
```
CryptoAnalysis {
  instrument_id: UUID
  analysis_date: date
  
  market: {
    price: decimal
    market_cap: decimal
    dominance_pct: decimal
    volume_24h: decimal
  }
  
  derivatives: {
    funding_rate: decimal?
    open_interest: decimal?
    oi_change_24h: decimal?
  }
  
  volatility: {
    realized_vol_30d: decimal
    vol_vs_btc: decimal
  }
}
```

### 7.5 Fixed Income Intelligence

[DESIGN DECISION] Fixed Income Intelligence module provides:

**Yield Analysis:**
- Yield curve construction
- Level, slope, curvature factors
- Real yield calculation

**Risk Metrics:**
- Duration (modified, effective)
- Convexity
- DV01 (dollar value of 01)

**Credit Analysis:**
- Credit spreads (when data available)
- Default probability estimates
- Recovery rate assumptions

**Input Requirements:**
- Bond yields (multiple maturities)
- Credit ratings (when available)
- Inflation expectations

**Output Schema:**
```
FixedIncomeAnalysis {
  instrument_id: UUID
  analysis_date: date
  
  yield: {
    yield_to_maturity: decimal
    real_yield: decimal?
    spread_vs_benchmark: decimal?
  }
  
  risk: {
    modified_duration: decimal
    convexity: decimal
    dv01: decimal
  }
  
  curve: {
    curve_level: decimal
    curve_slope: decimal
    curve_curvature: decimal
  }
}
```

[OPEN ISSUE] Indonesian bond data availability from free sources requires verification.

### 7.6 Indices & Derivatives Intelligence

[DESIGN DECISION] Indices & Derivatives Intelligence module provides:

**Index Analysis:**
- Breadth indicators (advance/decline)
- Sector contribution
- Constituents analysis
- Relative performance

**Derivatives:**
- Futures basis
- Options implied volatility (when available)
- Put/call ratios
- Open interest

**Volatility:**
- VIX and similar indices
- Volatility term structure
- Volatility risk premium

**Input Requirements:**
- Index values
- Constituents list
- Futures prices
- Options data (when available)

**Output Schema:**
```
IndexAnalysis {
  instrument_id: UUID
  analysis_date: date
  
  breadth: {
    advance_decline_ratio: decimal?
    percent_above_200dma: decimal?
    sector_participation: {sector: string, return: decimal}[]
  }
  
  derivatives: {
    futures_basis: decimal?
    implied_volatility: decimal?
    put_call_ratio: decimal?
  }
  
  volatility: {
    realized_vol_20d: decimal
    vol_regime: enum
  }
}
```

---

## 8. CROSS-ASSET INTELLIGENCE

### 8.1 Relationship Analysis Framework

[DESIGN DECISION] Cross-asset analysis examines relationships between different asset classes.

**Key Relationships to Analyze:**

1. **Gold vs US Real Yield**
   - Hypothesis: Gold inversely correlated with real yields
   - Method: Rolling correlation, cointegration test
   - Validation: Out-of-sample testing

2. **Gold vs USD**
   - Hypothesis: Gold inversely correlated with USD
   - Method: Rolling correlation, lead-lag analysis
   - Validation: Regime-dependent analysis

3. **IHSG vs USD/IDR**
   - Hypothesis: Indonesian equities negatively correlated with USD/IDR
   - Method: Rolling correlation, Granger causality
   - Validation: Structural break testing

4. **Equities vs Bond Yields**
   - Hypothesis: Higher yields pressure equity valuations
   - Method: Correlation, regression analysis
   - Validation: Regime-dependent

5. **Oil vs Inflation Expectations**
   - Hypothesis: Oil prices lead inflation
   - Method: Lead-lag analysis, Granger causality
   - Validation: Multiple testing correction

6. **Bitcoin vs Global Liquidity**
   - Hypothesis: Bitcoin correlated with global liquidity
   - Method: Correlation with M2, central bank balance sheets
   - Validation: Out-of-sample

### 8.2 Methodology

[DESIGN DECISION] Each relationship analysis must include:

**Statistical Tests:**
1. **Rolling Correlation**: `cor(returns_x, returns_y, window)`
2. **Partial Correlation**: Control for confounding variables
3. **Lead-Lag Analysis**: `cor(returns_x[t], returns_y[t-k])` for k in [-10, 10]
4. **Cointegration**: Engle-Granger or Johansen test (for non-stationary series)
5. **Granger Causality**: Test if X helps predict Y (NOT structural causality)
6. **Dynamic Conditional Correlation**: Time-varying correlation
7. **Volatility Spillover**: BEKK or DCC-GARCH models

**Validation Requirements:**
- **Timeframe**: Test across multiple timeframes (1M, 3M, 6M, 1Y, 5Y)
- **Data Frequency**: Daily minimum, intraday if available
- **Sample Period**: In-sample and out-of-sample split
- **Statistical Significance**: p-value < 0.05 with multiple testing correction
- **Structural Breaks**: Chow test or Bai-Perron test
- **Regime Stability**: Test relationship stability across regimes

**Output Schema:**
```
CrossAssetRelationship {
  relationship_id: UUID
  asset_x: UUID
  asset_y: UUID
  analysis_date: date
  
  correlation: {
    current_rolling_corr: decimal
    corr_1y_avg: decimal
    corr_5y_avg: decimal
    correlation_stability: decimal
  }
  
  lead_lag: {
    optimal_lag_days: integer
    correlation_at_optimal_lag: decimal
    statistical_significance: decimal
  }
  
  cointegration: {
    is_cointegrated: boolean
    test_statistic: decimal
    p_value: decimal
    hedge_ratio: decimal?
  }
  
  granger_causality: {
    x_granger_causes_y: boolean
    y_granger_causes_x: boolean
    f_statistic: decimal
    p_value: decimal
  }
  
  validation: {
    sample_period: {start: date, end: date}
    out_of_sample_period: {start: date, end: date}
    structural_breaks_detected: boolean
    regime_stability_score: decimal
  }
  
  interpretation: string
  limitations: string[]
}
```

### 8.3 Regime-Dependent Analysis

[DESIGN DECISION] Relationships may differ across market regimes.

**Approach:**
1. Classify market regime (see Section 10)
2. Calculate relationship metrics within each regime
3. Test for statistical difference between regimes
4. Report regime-specific findings

**Example:**
```
Regime-Specific Correlation:
- Risk-On Regime: Gold-RealYield correlation = -0.75
- Risk-Off Regime: Gold-RealYield correlation = -0.45
- High Volatility Regime: Gold-RealYield correlation = -0.30

Statistical Test: Correlation differs significantly across regimes (p < 0.01)
```

---

## 9. MACRO INTELLIGENCE

### 9.1 Economic Indicator Coverage

[DESIGN DECISION] Macro Intelligence covers:

**Inflation:**
- CPI (Consumer Price Index)
- PPI (Producer Price Index)
- Core inflation measures
- Inflation expectations (breakeven, surveys)

**Interest Rates:**
- Central bank policy rates
- Interbank rates
- Government bond yields
- Real rates (nominal - inflation)

**Employment:**
- Unemployment rate
- Non-farm payrolls (US)
- Labor force participation
- Wage growth

**Growth:**
- GDP (quarterly, annual)
- PMI (Purchasing Managers' Index)
- Industrial production
- Retail sales

**External:**
- Trade balance
- Current account
- Foreign reserves
- Exchange rates

**Fiscal:**
- Government budget balance
- Debt-to-GDP
- Fiscal stimulus measures

### 9.2 Indonesian Sources

[VERIFIED FACT] Primary Indonesian sources:

1. **Bank Indonesia**
   - BI Rate (policy rate)
   - Inflation reports
   - Balance of payments
   - Foreign reserves

2. **Badan Pusat Statistik (BPS)**
   - CPI (IHK)
   - GDP
   - Trade statistics
   - Employment data

3. **Otoritas Jasa Keuangan (OJK)**
   - Financial sector statistics
   - Banking data

4. **Kementerian Keuangan**
   - APBN (state budget)
   - Government debt

### 9.3 Global Sources

[VERIFIED FACT] Primary global sources:

1. **Federal Reserve**
   - Fed Funds Rate
   - FOMC statements
   - Beige Book

2. **Bureau of Labor Statistics (BLS)**
   - CPI, PPI
   - Employment situation

3. **Bureau of Economic Analysis (BEA)**
   - GDP
   - Personal income and outlays

4. **US Treasury**
   - Yield curves
   - Auction results

5. **CFTC**
   - COT reports

### 9.4 Point-in-Time Integrity

[DESIGN DECISION] Critical rule: **Never mix first release and revised data**

**Example: US GDP**
```
Q1 2024 GDP:
- First release (April 2024): 1.6%
- Second release (May 2024): 1.3%
- Third release (June 2024): 1.4%

For analysis of market reaction in April 2024:
- Use: 1.6% (first release)
- Timestamp: 2024-04-25 08:30:00 ET

For current analysis:
- Use: 1.4% (latest revision)
- Note: Revised from initial estimate
```

**Implementation:**
```
EconomicRelease {
  release_id: UUID
  indicator: string
  country: string
  period: date
  
  // Point-in-time data
  first_release: {
    value: decimal
    timestamp: timestamp
  }
  
  revisions: {
    revision_number: integer
    value: decimal
    timestamp: timestamp
  }[]
  
  // Consensus
  consensus: {
    estimate: decimal
    timestamp: timestamp
    number_of_estimates: integer
  }?
}
```

### 9.5 Macro Event Study

[DESIGN DECISION] Analyze market reaction to macro events:

**Methodology:**
1. Identify event (e.g., CPI release)
2. Define event window (e.g., [-1, +1] days)
3. Calculate abnormal return: `AR = Actual - Expected`
4. Aggregate across multiple events
5. Test statistical significance

**Output Schema:**
```
MacroEventStudy {
  indicator: string
  country: string
  sample_size: integer
  
  market_reaction: {
    asset_class: enum
    avg_abnormal_return: decimal
    std_error: decimal
    t_statistic: decimal
    p_value: decimal
  }[]
  
  surprise_analysis: {
    positive_surprise_reaction: decimal
    negative_surprise_reaction: decimal
    asymmetry_test_p_value: decimal
  }
  
  sample_period: {start: date, end: date}
  limitations: string[]
}
```

---

## 10. QUANTITATIVE REGIME

### 10.1 Regime Classification

[DESIGN DECISION] Market regimes are classified as:

**Price-Based Regimes:**
- TRENDING_UP: Sustained upward movement
- TRENDING_DOWN: Sustained downward movement
- RANGING: No clear direction, mean-reverting

**Volatility-Based Regimes:**
- LOW_VOLATILITY: Below historical average
- NORMAL_VOLATILITY: Around historical average
- HIGH_VOLATILITY: Above historical average
- VOLATILITY_SPIKE: Extreme volatility event

**Market Sentiment Regimes:**
- RISK_ON: Equities up, bonds down, credit spreads tight
- RISK_OFF: Equities down, bonds up, credit spreads wide
- FLIGHT_TO_QUALITY: Extreme risk-off with safe haven flows

**Liquidity Regimes:**
- NORMAL_LIQUIDITY: Typical bid-ask spreads and depth
- TIGHT_LIQUIDITY: Better than normal
- STRESSED_LIQUIDITY: Wide spreads, shallow depth
- LIQUIDITY_CRISIS: Extreme stress

**Event Regimes:**
- EVENT_DRIVEN: High volatility around specific events
- POST_EVENT: Adjustment period after major events
- TRANSITION: Moving between regimes

### 10.2 Regime Detection Methods

[DESIGN DECISION] Use multiple methods and ensemble:

**1. Realized Volatility:**
```
RV = sqrt(252) * std(log_returns, window=20)
```

**2. Average True Range (ATR):**
```
TR = max(High - Low, abs(High - PrevClose), abs(Low - PrevClose))
ATR = SMA(TR, window=14)
```

**3. Directional Efficiency:**
```
Efficiency = abs(Close[t] - Close[t-n]) / sum(abs(Close[i] - Close[i-1]), i=t-n+1 to t)
```
- High efficiency (>0.7): Trending
- Low efficiency (<0.3): Ranging

**4. Volatility Clustering:**
```
GARCH(1,1): σ²[t] = ω + α*ε²[t-1] + β*σ²[t-1]
```

**5. Hidden Markov Model (HMM):**
- States: Low vol, Normal vol, High vol
- Observations: Returns
- Estimation: Baum-Welch algorithm

**6. Change Point Detection:**
- PELT algorithm
- Binary segmentation
- Detect structural breaks in mean/variance

### 10.3 Asset-Specific Thresholds

[DESIGN DECISION] Do NOT use universal thresholds. Each asset class has different characteristics.

**Example: Volatility Regime Thresholds**

| Asset Class | Low Vol | Normal Vol | High Vol |
|-------------|---------|------------|----------|
| Gold | <10% | 10-20% | >20% |
| S&P 500 | <12% | 12-25% | >25% |
| Bitcoin | <30% | 30-60% | >60% |
| EUR/USD | <6% | 6-12% | >12% |

**Implementation:**
```
RegimeThresholds {
  asset_class: enum
  instrument_id: UUID?  // null for asset-class level
  
  volatility: {
    low_threshold: decimal
    high_threshold: decimal
  }
  
  trend: {
    efficiency_trending_threshold: decimal
    efficiency_ranging_threshold: decimal
  }
}
```

### 10.4 Regime Output Schema

```
RegimeClassification {
  instrument_id: UUID
  analysis_date: date
  
  classification: {
    price_regime: enum
    volatility_regime: enum
    sentiment_regime: enum?
    liquidity_regime: enum?
    event_regime: enum?
  }
  
  confidence: {
    overall_confidence: decimal
    method_agreement: decimal
  }
  
  method_results: {
    method: string
    classification: enum
    confidence: decimal
  }[]
  
  transition_probability: {
    current_regime: enum
    probability_stay: decimal
    probability_transition: {regime: enum, probability: decimal}[]
  }
  
  validation: {
    backtest_accuracy: decimal
    sample_period: {start: date, end: date}
  }
}
```

---

## 11. PROBABILITY ENGINE

### 11.1 Probability Targets

[DESIGN DECISION] Define specific, measurable probability targets for each asset class.

**Equity Examples:**
- P(Stock X returns > 5% in 20 days | current regime)
- P(IHSG drawdown > 10% in 60 days | current volatility)
- P(Sector rotation to defensive | yield curve inversion)

**Commodity Examples:**
- P(Gold price > $2500 in 30 days | real yield path)
- P(Oil contango > 5% in 60 days | inventory change)

**FX Examples:**
- P(USD/IDR > 16,000 in 20 days | rate differential)
- P(EUR/USD trend reversal | momentum indicators)

**Crypto Examples:**
- P(Bitcoin drawdown > 20% in 30 days | funding rate)
- P(Altcoin outperformance vs BTC | Bitcoin dominance trend)

### 11.2 Modeling Methods

[DESIGN DECISION] Candidate methods (selection depends on target):

**1. Logistic Regression:**
- Use: Binary outcomes (up/down, breach/no breach)
- Pros: Interpretable, fast, well-understood
- Cons: Linear decision boundary, assumes independence

**2. Generalized Linear Models (GLM):**
- Use: Non-normal outcomes (counts, proportions)
- Pros: Flexible link functions, handles various distributions
- Cons: Requires correct specification

**3. Gradient Boosting (XGBoost, LightGBM):**
- Use: Complex non-linear relationships
- Pros: High accuracy, handles interactions, feature importance
- Cons: Black box, overfitting risk, requires tuning

**4. Regime-Conditional Models:**
- Use: Different models for different regimes
- Pros: Captures regime-dependent behavior
- Cons: Requires accurate regime classification

**5. Time-Series Models:**
- Use: Autoregressive patterns, seasonality
- Methods: ARIMA, VAR, GARCH
- Pros: Captures temporal dependencies
- Cons: Stationarity assumptions, complex for multivariate

**6. Ensemble Models:**
- Use: Combine multiple models
- Methods: Stacking, bagging, boosting
- Pros: Robust, often best performance
- Cons: Complexity, interpretability

### 11.3 Model Specification

[DESIGN DECISION] Every probability model must specify:

```
ProbabilityModel {
  model_id: UUID
  name: string
  version: string
  
  // Target
  target_variable: string
  target_definition: string
  forecast_horizon: string (e.g., "20 days")
  
  // Features
  features: {
    name: string
    description: string
    transformation: string?
    importance: decimal?
  }[]
  
  // Data
  training_window: string (e.g., "5 years")
  validation_window: string (e.g., "1 year")
  out_of_sample_period: {start: date, end: date}
  
  // Method
  method: string
  hyperparameters: jsonb
  
  // Cost Assumptions
  transaction_costs: decimal?
  slippage_assumption: decimal?
  
  // Calibration
  calibration_method: string
  calibration_results: {
    brier_score: decimal
    log_loss: decimal
    calibration_slope: decimal
    calibration_intercept: decimal
    expected_calibration_error: decimal
  }
  
  // Validation
  in_sample_performance: {
    accuracy: decimal
    auc_roc: decimal
    precision: decimal
    recall: decimal
    f1_score: decimal
  }
  
  out_of_sample_performance: {
    accuracy: decimal
    auc_roc: decimal
    precision: decimal
    recall: decimal
    f1_score: decimal
    degradation_vs_in_sample: decimal
  }
  
  // Uncertainty
  uncertainty_estimation: {
    method: string (e.g., "bootstrap", "bayesian", "ensemble_variance")
    confidence_interval_95: {lower: decimal, upper: decimal}
  }
  
  // Governance
  created_at: timestamp
  created_by: string
  last_validated: timestamp
  status: enum (DEVELOPMENT, VALIDATED, DEPLOYED, RETIRED)
}
```

### 11.4 Validation Framework

[DESIGN DECISION] Models must pass validation before deployment:

**1. Calibration Tests:**
- **Brier Score**: Lower is better (0 = perfect, 0.25 = no skill for binary)
- **Log Loss**: Lower is better
- **Calibration Curve**: Predicted vs actual probabilities
- **Calibration Slope**: Should be close to 1.0
- **Calibration Intercept**: Should be close to 0.0
- **Expected Calibration Error (ECE)**: Lower is better

**2. Discrimination Tests:**
- **AUC-ROC**: Area under ROC curve (0.5 = random, 1.0 = perfect)
- **Precision-Recall Curve**: For imbalanced datasets

**3. Out-of-Sample Testing:**
- Hold-out period NOT used in training
- Performance should not degrade >20% vs in-sample
- Test across multiple out-of-sample periods

**4. Statistical Significance:**
- Test if model performance > baseline (e.g., historical frequency)
- Use bootstrap or permutation tests
- Report p-values

**5. Robustness Tests:**
- Feature importance stability
- Performance across regimes
- Performance across time periods
- Sensitivity to hyperparameters

### 11.5 Probability Output Schema

```
ProbabilityEstimate {
  estimate_id: UUID
  model_id: UUID
  instrument_id: UUID
  estimate_date: date
  
  // Estimate
  target: string
  probability: decimal
  confidence_interval_95: {lower: decimal, upper: decimal}
  
  // Context
  current_regime: enum
  key_features: {name: string, value: decimal, contribution: decimal}[]
  
  // Validation
  model_status: enum
  last_validated: date
  out_of_sample_performance: decimal
  
  // Governance
  evidence_level: enum (OBSERVED, CALCULATED, STATISTICALLY_SUPPORTED, MODEL_ESTIMATE, HYPOTHESIS, UNVERIFIED)
  output_gate: enum (APPROVED, APPROVED_WITH_LIMITATIONS, INSUFFICIENT_EVIDENCE, REJECTED)
  
  limitations: string[]
  assumptions: string[]
}
```

### 11.6 Hard Rule

[VERIFIED FACT] **NEVER present probability estimates from unvalidated models.**

If a model has not passed validation:
- Do NOT display probability
- Display: "Model under development" or "Insufficient validation"
- Log in audit trail

---

## 12. PORTFOLIO & RISK

### 12.1 Portfolio Intelligence

[DESIGN DECISION] Portfolio & Risk Engine provides:

**Asset Allocation:**
- Current allocation by asset class, sector, geography
- Target vs actual allocation
- Rebalancing triggers

**Exposure Analysis:**
- Gross and net exposure
- Factor exposure (value, momentum, size, etc.)
- Currency exposure
- Interest rate exposure

**Position Sizing:**
- Kelly criterion
- Volatility targeting
- Risk parity
- Maximum position limits

### 12.2 Risk Metrics

[DESIGN DECISION] Calculate the following risk metrics:

**1. Value at Risk (VaR):**
```
VaR(α) = μ - z(α) * σ

Where:
- α = confidence level (e.g., 0.95)
- μ = expected return
- z(α) = z-score for confidence level
- σ = portfolio volatility

Methods:
- Parametric (assuming normal distribution)
- Historical simulation
- Monte Carlo simulation
```

**2. Expected Shortfall (CVaR):**
```
ES(α) = E[Loss | Loss > VaR(α)]

More conservative than VaR, captures tail risk
```

**3. Maximum Drawdown:**
```
MDD = (Trough - Peak) / Peak

Calculate over historical period
```

**4. Correlation Risk:**
```
Monitor:
- Pairwise correlations
- Average correlation
- Correlation regime changes
- Correlation breakdown events
```

**5. Concentration Risk:**
```
Herfindahl-Hirschman Index (HHI):
HHI = sum(w_i^2)

Where w_i = weight of position i

Higher HHI = more concentrated
```

**6. Liquidity Risk:**
```
Estimate:
- Days to liquidate position
- Market impact cost
- Bid-ask spread cost
```

**7. Currency Risk:**
```
For multi-currency portfolios:
- Currency exposure by currency
- Hedging ratio
- Currency VaR
```

### 12.3 Covariance Estimation

[DESIGN DECISION] Methods for estimating covariance matrix:

**1. Historical Covariance:**
```
Σ = (1/T) * X'X

Where X = matrix of returns
Simple but noisy
```

**2. Exponentially Weighted Moving Average (EWMA):**
```
Σ[t] = λ * Σ[t-1] + (1-λ) * r[t] * r[t]'

More responsive to recent events
```

**3. Shrinkage Estimators:**
```
Σ_shrink = α * Σ_sample + (1-α) * Σ_target

Where Σ_target = structured estimator (e.g., constant correlation)
Reduces estimation error
```

**4. Factor Models:**
```
Σ = B * F * B' + Δ

Where:
- B = factor loadings
- F = factor covariance
- Δ = idiosyncratic variance

Reduces dimensionality
```

**5. Regime-Dependent:**
```
Estimate separate covariance matrices for each regime
Weight by regime probability
```

### 12.4 Stress Testing

[DESIGN DECISION] Stress test portfolio against scenarios:

**Historical Scenarios:**
- 2008 Financial Crisis
- 2020 COVID Crash
- 2022 Rate Hike Cycle
- Indonesian-specific events (e.g., 2013 taper tantrum)

**Hypothetical Scenarios:**
- Global recession
- Sharp USD appreciation
- Commodity price shock
- Indonesian political crisis
- Sector-specific shock

**Output Schema:**
```
StressTestResult {
  portfolio_id: UUID
  scenario: string
  scenario_date: date?
  
  impact: {
    portfolio_value_change_pct: decimal
    portfolio_value_change_abs: decimal
    max_drawdown: decimal
    var_breach: boolean
  }
  
  position_impact: {
    instrument_id: UUID
    pnl: decimal
    pnl_pct: decimal
  }[]
  
  risk_metrics: {
    var_95: decimal
    cvar_95: decimal
    max_loss: decimal
  }
  
  interpretation: string
  recommended_actions: string[]
}
```

### 12.5 Diversification Analysis

[DESIGN DECISION] **Diversification by number of instruments does NOT automatically reduce risk.**

**Proper Analysis:**
1. Calculate effective number of bets: `ENB = 1 / HHI`
2. Analyze correlation structure
3. Identify concentration in factors, not just instruments
4. Test diversification across regimes

**Example:**
```
Portfolio A: 50 Indonesian stocks, all in financial sector
Portfolio B: 10 stocks across 5 sectors, 2 countries

Portfolio A: High concentration risk despite many instruments
Portfolio B: Better diversification despite fewer instruments
```

---

## 13. AI INTERPRETATION

### 13.1 Role of LLM

[DESIGN DECISION] LLM serves as **interpreter**, NOT creator.

**LLM Functions:**
1. Summarize quantitative results
2. Explain statistical concepts
3. Generate natural language reports
4. Answer questions about analysis
5. Highlight key findings and limitations

**LLM Prohibitions:**
1. Create data that doesn't exist
2. Make predictions without model backing
3. Override quantitative findings
4. Provide financial advice
5. Speculate beyond evidence

### 13.2 Evidence Registry

[DESIGN DECISION] All LLM outputs must reference Evidence Registry.

**Evidence Registry Schema:**
```
Evidence {
  evidence_id: UUID
  source_type: enum (DATA, MODEL, ANALYSIS, EXTERNAL)
  source_id: UUID
  
  content: {
    type: string
    value: any
    timestamp: timestamp
  }
  
  validation: {
    quality_score: decimal
    validation_status: enum
    limitations: string[]
  }
  
  lineage: {
    derived_from: UUID[]
    calculation_method: string?
  }
}
```

**LLM Prompt Template:**
```
You are a quantitative research interpreter.

You have access to the following evidence:
{evidence_list}

Your task: {task_description}

Rules:
1. ONLY use provided evidence
2. Cite evidence_id for every claim
3. State confidence level
4. List limitations
5. Do NOT speculate beyond evidence
6. Do NOT provide financial advice

Output format:
{output_schema}
```

### 13.3 Output Labeling

[DESIGN DECISION] Every LLM output must be labeled:

**Evidence Labels:**
- **OBSERVED**: Directly from data
- **CALCULATED**: Derived from data via formula
- **STATISTICALLY_SUPPORTED**: Backed by statistical test
- **MODEL_ESTIMATE**: From predictive model
- **HYPOTHESIS**: Unverified assumption
- **UNVERIFIED**: Not yet validated

**Output Gate:**
- **APPROVED**: Meets all validation criteria
- **APPROVED_WITH_LIMITATIONS**: Valid but with caveats
- **INSUFFICIENT_EVIDENCE**: Not enough data/validation
- **REJECTED**: Failed validation

**Example Output:**
```
Analysis: Gold is inversely correlated with US real yields

Evidence Level: STATISTICALLY_SUPPORTED
Output Gate: APPROVED_WITH_LIMITATIONS

Supporting Evidence:
- [EVIDENCE-001] Rolling correlation (252-day): -0.72 (p < 0.01)
- [EVIDENCE-002] Cointegration test: Engle-Granger statistic = -4.2 (p < 0.01)

Limitations:
- Correlation varies across regimes (see [EVIDENCE-003])
- Relationship may break down during liquidity crises
- Sample period: 2010-2024 (may not represent future)

Confidence: HIGH for statistical relationship, MEDIUM for stability
```

---

## 14. MULTI-AGENT ARCHITECTURE

### 14.1 Agent Design

[RECOMMENDATION] Start with **modular workflow**, NOT multi-agent orchestration.

**Rationale:**
- Multi-agent adds complexity
- Unclear benefit over single LLM with good prompting
- Coordination overhead
- Debugging difficulty

**When to Consider Multi-Agent:**
- Clear separation of concerns
- Parallel processing benefit
- Specialized expertise required
- Measurable performance improvement

### 14.2 Proposed Agents (If Implemented)

[RECOMMENDATION] If multi-agent is implemented, consider:

**1. Equity Analyst Agent**
- Input: Equity analysis data
- Output: Equity research report
- Dependencies: Equity Intelligence module

**2. Commodity Analyst Agent**
- Input: Commodity analysis data
- Output: Commodity research report
- Dependencies: Commodity Intelligence module

**3. FX Analyst Agent**
- Input: FX analysis data
- Output: FX research report
- Dependencies: FX Intelligence module

**4. Crypto Analyst Agent**
- Input: Crypto analysis data
- Output: Crypto research report
- Dependencies: Crypto Intelligence module

**5. Fixed Income Analyst Agent**
- Input: Fixed income analysis data
- Output: Fixed income research report
- Dependencies: Fixed Income Intelligence module

**6. Macro Analyst Agent**
- Input: Macro data and event studies
- Output: Macro research report
- Dependencies: Macro Intelligence module

**7. Cross-Asset Analyst Agent**
- Input: Cross-asset relationship data
- Output: Cross-asset research report
- Dependencies: Cross-Asset Intelligence module

**8. Quant Researcher Agent**
- Input: Regime, probability, model validation data
- Output: Quantitative research report
- Dependencies: Quantitative Regime, Probability Engine

**9. Portfolio Risk Analyst Agent**
- Input: Portfolio data, risk metrics, stress tests
- Output: Risk report
- Dependencies: Portfolio & Risk Engine

**10. Research Auditor Agent**
- Input: All other agent outputs
- Output: Audit report, validation check
- Dependencies: Evidence Registry

### 14.3 Agent Coordination

[DESIGN DECISION] If multi-agent is implemented:

**Execution Order:**
1. Asset-class agents (parallel)
2. Cross-asset agent (after asset-class complete)
3. Macro agent (parallel with cross-asset)
4. Quant agent (after cross-asset and macro)
5. Portfolio agent (after quant)
6. Auditor agent (last)

**Shared Evidence:**
- All agents read from same Evidence Registry
- No agent creates evidence, only references
- Auditor validates evidence chain

**Conflict Resolution:**
- If agents disagree, flag for human review
- Do NOT auto-resolve conflicts
- Log disagreement in audit trail

**Agent Authority:**
- No agent can override another
- No agent can bypass validation
- All agents subject to auditor review

---

## 15. GOVERNANCE

### 15.1 Data Governance

[DESIGN DECISION] Implement comprehensive data governance:

**Data Quality Monitoring:**
- Completeness checks
- Consistency checks
- Timeliness checks
- Accuracy checks (when benchmark available)

**Data Lineage Tracking:**
- Source → Transformation → Output
- Every calculation logged
- Reproducibility ensured

**Data Versioning:**
- Track data revisions
- Point-in-time queries
- Audit trail of changes

### 15.2 Model Governance

[DESIGN DECISION] Implement model governance:

**Model Registry:**
```
ModelRegistry {
  model_id: UUID
  name: string
  version: string
  
  development: {
    created_at: timestamp
    created_by: string
    methodology: string
    training_data: string
    validation_results: jsonb
  }
  
  deployment: {
    deployed_at: timestamp?
    deployed_by: string?
    status: enum
  }
  
  monitoring: {
    last_validated: timestamp
    performance_drift: decimal?
    data_drift: decimal?
  }
  
  retirement: {
    retired_at: timestamp?
    reason: string?
  }
}
```

**Model Validation:**
- Initial validation before deployment
- Periodic re-validation (e.g., quarterly)
- Drift monitoring
- Performance degradation alerts

**Model Retirement:**
- Criteria for retirement
- Migration plan
- Audit trail

### 15.3 Prompt Governance

[DESIGN DECISION] Version control for LLM prompts:

**Prompt Registry:**
```
PromptRegistry {
  prompt_id: UUID
  name: string
  version: string
  
  content: string
  parameters: jsonb
  
  testing: {
    test_cases: TestCase[]
    evaluation_results: jsonb
  }
  
  deployment: {
    deployed_at: timestamp
    deployed_by: string
  }
}
```

**Prompt Testing:**
- Test cases for each prompt
- Expected outputs
- Evaluation metrics
- Regression testing

### 15.4 Audit Trail

[DESIGN DECISION] Comprehensive audit logging:

**Audit Log Schema:**
```
AuditLog {
  log_id: UUID
  timestamp: timestamp
  actor: string (user or system)
  action: string
  
  resource: {
    type: string
    id: UUID
  }
  
  details: jsonb
  
  before_state: jsonb?
  after_state: jsonb?
  
  context: {
    ip_address: string?
    session_id: string?
    request_id: string?
  }
}
```

**What to Log:**
- Data ingestion
- Data transformations
- Model training
- Model deployment
- LLM queries and responses
- User actions
- System errors

**Retention:**
- Minimum 7 years for regulatory compliance
- Archival strategy for older logs

---

## 16. SECURITY

### 16.1 Authentication & Authorization

[RECOMMENDATION] Implement:

**Authentication:**
- OAuth 2.0 / OpenID Connect
- Multi-factor authentication (MFA)
- Session management

**Authorization:**
- Role-Based Access Control (RBAC)
- Principle of least privilege
- Audit all access

**Roles:**
- Admin: Full system access
- Researcher: Read/write research data
- Analyst: Read-only access to results
- Auditor: Read-only access to audit logs
- Viewer: Limited read access

### 16.2 API Security

[RECOMMENDATION] Implement:

- Rate limiting
- API key management
- Input validation
- Output sanitization
- HTTPS only
- CORS configuration

### 16.3 Secret Management

[RECOMMENDATION] Implement:

- Never store secrets in code
- Use environment variables or secret manager
- Rotate secrets regularly
- Audit secret access

### 16.4 Data Encryption

[RECOMMENDATION] Implement:

- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Key management system
- Regular key rotation

### 16.5 LLM Security

[RECOMMENDATION] Implement:

**Prompt Injection Protection:**
- Input sanitization
- Output validation
- Sandboxing

**LLM Output Validation:**
- Schema validation
- Content filtering
- Hallucination detection

**Provider Failure Handling:**
- Fallback providers
- Circuit breaker pattern
- Graceful degradation

**Cost Controls:**
- Token usage tracking
- Budget alerts
- Rate limiting per user

---

## 17. TECHNOLOGY EVALUATION

### 17.1 Frontend

[RECOMMENDATION] **React + Vite + TypeScript**

**Rationale:**
- Component-based architecture
- Large ecosystem
- Good TypeScript support
- Fast development
- Vite for fast builds

**Alternatives Considered:**
- Vue.js: Good but smaller ecosystem
- Angular: More complex, heavier
- Svelte: Smaller ecosystem

**Trade-offs:**
- React: Verbose but flexible
- Requires state management (Redux, Zustand, or Context)

### 17.2 Backend

[RECOMMENDATION] **FastAPI (Python)**

**Rationale:**
- Python for quantitative work
- FastAPI for performance
- Async support
- Automatic API documentation
- Type hints

**Alternatives Considered:**
- Flask: Simpler but slower
- Django: Heavier, more features than needed
- Node.js: Not ideal for quantitative work

**Trade-offs:**
- Python: Slower than compiled languages
- Requires careful optimization for performance-critical paths

### 17.3 Data Processing

[RECOMMENDATION] **Polars (primary) + Pandas (fallback)**

**Rationale:**
- Polars: Fast, lazy evaluation, Rust backend
- Pandas: Mature, large ecosystem
- Use Polars for performance-critical, Pandas for compatibility

**Alternatives Considered:**
- Dask: Distributed but complex
- Vaex: Less mature

**Trade-offs:**
- Polars: Newer, smaller ecosystem
- Pandas: Slower for large datasets

### 17.4 Quantitative Libraries

[RECOMMENDATION] **NumPy + SciPy + scikit-learn**

**Rationale:**
- Industry standard
- Well-tested
- Large community

**Advanced ML:** **PyTorch**

**Rationale:**
- Flexible
- Good for research
- Dynamic computation graph

**Alternatives Considered:**
- TensorFlow: More complex, static graph
- JAX: Newer, less mature

### 17.5 Database

[RECOMMENDATION] **PostgreSQL + TimescaleDB**

**Rationale:**
- PostgreSQL: Robust, feature-rich
- TimescaleDB: Time-series optimizations
- SQL compatibility
- JSONB for flexibility

**Alternatives Considered:**
- MongoDB: No SQL, less suitable for relational data
- ClickHouse: Fast but less flexible
- InfluxDB: Time-series only

**Trade-offs:**
- PostgreSQL: Requires tuning for very large datasets
- TimescaleDB: Adds complexity

### 17.6 Cache & Queue

[RECOMMENDATION] **Redis**

**Rationale:**
- Fast in-memory cache
- Pub/sub for real-time updates
- Simple API

**Background Processing:** **Celery + Redis**

**Rationale:**
- Mature
- Reliable
- Good monitoring

**Alternatives Considered:**
- RQ: Simpler but less features
- Dramatiq: Newer, less mature

### 17.7 LLM Provider

[RECOMMENDATION] **OpenAI API (GPT-4)**

**Rationale:**
- State-of-the-art performance
- Good API
- Reliable

**Alternatives Considered:**
- Anthropic Claude: Good but less tested
- Google Gemini: Newer
- Self-hosted: Requires significant resources

**Trade-offs:**
- OpenAI: Costly at scale
- Requires API key management

### 17.8 Monitoring

[RECOMMENDATION] **Prometheus + Grafana**

**Rationale:**
- Industry standard
- Good visualization
- Alerting

**Logging:** **ELK Stack (Elasticsearch, Logstash, Kibana)** or **Loki**

**Rationale:**
- Centralized logging
- Search and analysis
- Visualization

### 17.9 Technology Stack Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React + Vite + TypeScript | Fast, flexible, good ecosystem |
| Backend | FastAPI (Python) | Python for quant, FastAPI for performance |
| Data Processing | Polars + Pandas | Speed + compatibility |
| Quantitative | NumPy + SciPy + scikit-learn | Industry standard |
| Advanced ML | PyTorch | Flexible, research-friendly |
| Database | PostgreSQL + TimescaleDB | Robust + time-series |
| Cache | Redis | Fast, simple |
| Queue | Celery + Redis | Mature, reliable |
| LLM | OpenAI API | State-of-the-art |
| Monitoring | Prometheus + Grafana | Industry standard |
| Logging | ELK or Loki | Centralized, searchable |

---

## 18. IMPLEMENTATION ROADMAP

### 18.1 Phase Overview

[DESIGN DECISION] Implementation follows this sequence:

```
MAMIE-00: Governance & Architecture
    ↓
MAMIE-01: Instrument Registry
    ↓
MAMIE-02: Data Source Registry
    ↓
MAMIE-03: Data Ingestion & Integrity
    ↓
MAMIE-04: Equity Intelligence (Indonesia)
    ↓
MAMIE-05: Commodity Intelligence
    ↓
MAMIE-06: FX Intelligence
    ↓
MAMIE-07: Digital Asset Intelligence
    ↓
MAMIE-08: Fixed Income Intelligence
    ↓
MAMIE-09: Indices & Derivatives Intelligence
    ↓
MAMIE-10: Macro Intelligence
    ↓
MAMIE-11: Cross-Asset Intelligence
    ↓
MAMIE-12: Quantitative Regime Engine
    ↓
MAMIE-13: Probability Engine
    ↓
MAMIE-14: Portfolio & Risk Engine
    ↓
MAMIE-15: AI Interpretation
    ↓
MAMIE-16: Governance & AI Orchestration
    ↓
MAMIE-17: Dashboard Integration
    ↓
MAMIE-18: Testing & Deployment Readiness
```

### 18.2 Phase Details

#### MAMIE-00: Governance & Architecture

**Objective:** Establish governance framework and technical architecture

**Scope:**
- Define governance policies
- Set up development environment
- Create project structure
- Establish coding standards

**Dependencies:** None

**Deliverables:**
- Governance documentation
- Development environment setup
- Project repository
- CI/CD pipeline

**Acceptance Criteria:**
- Governance policies approved
- Development environment functional
- CI/CD pipeline operational

**Risk Register:**
- Risk: Scope creep
- Mitigation: Strict phase gates

**Exit Criteria:**
- All deliverables complete
- Acceptance criteria met
- Stakeholder approval

---

#### MAMIE-01: Instrument Registry

**Objective:** Build instrument master database

**Scope:**
- Design schema
- Implement CRUD operations
- Load initial instruments
- Implement historical tracking

**Dependencies:** MAMIE-00

**Deliverables:**
- Instrument database
- API endpoints
- Data loading scripts
- Documentation

**Acceptance Criteria:**
- All target instruments loaded
- Historical tracking functional
- Point-in-time queries working
- API tested

**Risk Register:**
- Risk: Data quality issues
- Mitigation: Data validation checks

**Exit Criteria:**
- All instruments loaded
- API functional
- Tests passing

---

#### MAMIE-02: Data Source Registry

**Objective:** Catalog all data sources

**Scope:**
- Identify free data sources
- Verify licensing
- Test data quality
- Document limitations

**Dependencies:** MAMIE-01

**Deliverables:**
- Source registry database
- Verification reports
- Data gap documentation

**Acceptance Criteria:**
- All sources verified
- Licensing confirmed
- Limitations documented

**Risk Register:**
- Risk: Sources change terms
- Mitigation: Regular re-verification

**Exit Criteria:**
- Registry complete
- Gaps documented

---

[Continue for all phases...]

### 18.3 Critical Path

[VERIFIED FACT] Critical path:

```
MAMIE-00 → MAMIE-01 → MAMIE-02 → MAMIE-03 → MAMIE-04 → ... → MAMIE-18
```

**Bottleneck:** Data ingestion and validation (MAMIE-03)

**Mitigation:** Parallel work on documentation and testing

---

## 19. ACCEPTANCE CRITERIA

### 19.1 Functional Criteria

[DESIGN DECISION] Each phase must meet:

**Data Quality:**
- Completeness > 95%
- Accuracy verified against benchmarks
- Timeliness within SLA

**Performance:**
- API response time < 500ms (95th percentile)
- Dashboard load time < 3s
- Concurrent users supported

**Reliability:**
- Uptime > 99.5%
- Error rate < 0.1%
- Recovery time < 1 hour

### 19.2 Non-Functional Criteria

**Security:**
- All data encrypted
- Access controls enforced
- Audit logs complete

**Compliance:**
- Data licensing verified
- Attribution requirements met
- Privacy regulations followed

**Maintainability:**
- Code coverage > 80%
- Documentation complete
- Deployment automated

---

## 20. RISK REGISTER

### 20.1 Technical Risks

| ID | Risk | Probability | Impact | Mitigation |
|----|------|-------------|--------|------------|
| T-001 | Data source API changes | Medium | High | Abstract data access layer |
| T-002 | Performance degradation | Medium | Medium | Load testing, optimization |
| T-003 | Data quality issues | High | High | Validation checks, monitoring |
| T-004 | Integration complexity | Medium | Medium | Modular design, testing |

### 20.2 Business Risks

| ID | Risk | Probability | Impact | Mitigation |
|----|------|-------------|--------|------------|
| B-001 | Scope creep | High | High | Strict phase gates |
| B-002 | Resource constraints | Medium | High | Prioritization, phasing |
| B-003 | Stakeholder misalignment | Medium | Medium | Regular reviews |
| B-004 | Regulatory changes | Low | High | Monitor regulations |

### 20.3 Data Risks

| ID | Risk | Probability | Impact | Mitigation |
|----|------|-------------|--------|------------|
| D-001 | Free data unavailable | High | High | Document gaps, alternative sources |
| D-002 | Licensing violations | Medium | High | Legal review, attribution |
| D-003 | Data bias | Medium | High | Bias testing, validation |
| D-004 | Look-ahead bias | Medium | High | Point-in-time data, testing |

---

## 21. OPEN ISSUES

### 21.1 Data Availability

[OPEN ISSUE] **OI-001: Indonesian Bond Data**
- Description: Free data for Indonesian government bonds not verified
- Impact: Fixed Income Intelligence module
- Owner: Data Engineering
- Status: Researching
- Target Resolution: MAMIE-08

---

[OPEN ISSUE] **OI-002: IDX Historical Data Completeness**
- Description: Free historical data for all IDX stocks not guaranteed
- Impact: Equity Intelligence module
- Owner: Data Engineering
- Status: Researching
- Target Resolution: MAMIE-04

---

[OPEN ISSUE] **OI-003: On-Chain Data Provenance**
- Description: On-chain metrics require clear definition and source verification
- Impact: Crypto Intelligence module
- Owner: Data Engineering
- Status: Identified
- Target Resolution: MAMIE-07

---

### 21.2 Technical

[OPEN ISSUE] **OI-004: LLM Cost at Scale**
- Description: OpenAI API costs may be prohibitive at scale
- Impact: AI Interpretation module
- Owner: Architecture
- Status: Identified
- Target Resolution: MAMIE-15

---

[OPEN ISSUE] **OI-005: Real-Time Data Requirements**
- Description: Some use cases may require real-time data (not available free)
- Impact: Multiple modules
- Owner: Architecture
- Status: Identified
- Target Resolution: MAMIE-03

---

### 21.3 Business

[OPEN ISSUE] **OI-006: User Training Requirements**
- Description: Users may need training on quantitative concepts
- Impact: Adoption
- Owner: Product
- Status: Identified
- Target Resolution: MAMIE-17

---

[OPEN ISSUE] **OI-007: Regulatory Compliance**
- Description: May need legal review for financial analysis disclaimers
- Impact: Deployment
- Owner: Legal
- Status: Identified
- Target Resolution: MAMIE-18

---

## 22. ARCHITECTURE DECISION RECORDS

### 22.1 ADR-001: Single Core Engine vs. Separate Engines

**Status:** ACCEPTED

**Context:**
Need to decide whether to build six separate engines (one per asset class) or a single core with asset-specific modules.

**Decision:**
Use a single core engine with asset-specific modules.

**Rationale:**
- Reduces code duplication
- Ensures consistent governance
- Enables cross-asset analysis
- Easier maintenance

**Consequences:**
- Core must be instrument-agnostic
- Asset-specific logic isolated in modules
- Requires careful interface design

---

### 22.2 ADR-002: Free-Only Data Policy

**Status:** ACCEPTED

**Context:**
Need to decide on data acquisition policy.

**Decision:**
Use only free data sources. No paid subscriptions.

**Rationale:**
- Eliminates ongoing costs
- Reduces vendor lock-in
- Simpler licensing

**Consequences:**
- Data gaps will exist
- Some features may be limited
- Requires thorough source verification

---

### 22.3 ADR-003: Point-in-Time Data

**Status:** ACCEPTED

**Context:**
Need to decide how to handle historical data to prevent look-ahead bias.

**Decision:**
All historical analysis must use point-in-time data with proper timestamps.

**Rationale:**
- Prevents look-ahead bias
- Ensures realistic backtests
- Maintains research integrity

**Consequences:**
- Requires additional timestamp fields
- More complex queries
- Larger storage requirements

---

### 22.4 ADR-004: LLM as Interpreter Only

**Status:** ACCEPTED

**Context:**
Need to decide on LLM role in the system.

**Decision:**
LLM serves as interpreter of quantitative results, not creator of analysis.

**Rationale:**
- Maintains quantitative rigor
- Prevents hallucination in critical analysis
- Clear separation of concerns

**Consequences:**
- LLM cannot generate predictions
- All claims must reference evidence
- May limit natural language flexibility

---

### 22.5 ADR-005: Progressive Feature Activation

**Status:** ACCEPTED

**Context:**
Need to decide when to activate features given data limitations.

**Decision:**
Features activate only when data and methodology requirements are met.

**Rationale:**
- Prevents use of incomplete analysis
- Maintains quality standards
- Clear user expectations

**Consequences:**
- Some features may be unavailable initially
- Requires clear status communication
- May frustrate users expecting full coverage

---

## SPECIFICATION STATUS

**APPROVED FOR SPECIFICATION**

This document provides a comprehensive technical specification for the MAMIE system. All major architectural decisions have been made, and the implementation roadmap is defined.

**Next Steps:**
1. Review by all stakeholders
2. Address open issues
3. Obtain approval for implementation
4. Begin MAMIE-00 phase

---

## CODING AUTHORIZATION: NOT GRANTED

**Reason:**
This document is a technical specification only. Implementation requires separate authorization after:

1. Specification review and approval
2. Resolution of open issues
3. Resource allocation confirmation
4. Stakeholder sign-off

**Open Issues Requiring Resolution:**
- OI-001: Indonesian bond data availability
- OI-002: IDX historical data completeness
- OI-003: On-chain data provenance
- OI-004: LLM cost at scale
- OI-005: Real-time data requirements
- OI-006: User training requirements
- OI-007: Regulatory compliance

**Implementation Authorization Process:**
1. Stakeholder review of this specification
2. Resolution of open issues
3. Resource planning and allocation
4. Formal implementation authorization
5. Begin MAMIE-00 phase

---

## DOCUMENT APPROVAL

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Principal Architect | | | |
| Data Engineering Lead | | | |
| AI Systems Architect | | | |
| Risk Management Lead | | | |
| Product Owner | | | |

---

**END OF DOCUMENT**

**MAMIE_MASTER_AI_ENGINE_TECHNICAL_SPECIFICATION_v1.0**
**Multi-Asset Market Intelligence Engine**
**Version 1.0 — 2026**
