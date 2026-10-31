# Instrument Registry Design

**Document Type:** Database Design  
**Phase:** PHASE 01  
**Status:** DRAFT

---

## Overview

This document describes the instrument registry design for MAMIE (Multi-Asset Market Intelligence Engine). The registry provides a universal framework for managing financial instruments across multiple asset classes with stable identifiers and historical tracking.

## Design Principles

1. **Stable Identifiers**: Each instrument has a UUID-based `instrument_id` that never changes
2. **Symbol Flexibility**: Tickers/symbols can change without affecting the instrument identity
3. **Historical Tracking**: All status changes and identifier mappings are preserved
4. **Multi-Asset Support**: Single schema supports equities, commodities, forex, crypto, fixed income, indices, and derivatives
5. **Data Governance**: Verification status tracking for all instruments

## Schema Design

### Core Tables

#### 1. asset_classes
Defines categories of financial instruments.

```sql
CREATE TABLE asset_classes (
    asset_class_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    supported_instrument_types TEXT[],
    validation_rules JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Default Values:**
- equity: Stocks, ETFs
- commodity: Futures, spots
- fx: Currency pairs
- crypto: Digital assets
- fixed_income: Bonds, treasuries
- index: Market indices
- derivative: Options, futures, swaps

#### 2. exchanges
Trading venues where instruments are listed.

```sql
CREATE TABLE exchanges (
    exchange_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    mic_code VARCHAR(20),  -- ISO 10383 Market Identifier Code
    country VARCHAR(10) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    trading_sessions JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Key Exchanges:**
- XIDX: Indonesia Stock Exchange
- XNYS: New York Stock Exchange
- XNAS: NASDAQ
- XCEC: COMEX
- XNYM: NYMEX

#### 3. issuers
Entities that issue securities (for equities, bonds).

```sql
CREATE TABLE issuers (
    issuer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(300) NOT NULL,
    country VARCHAR(10) NOT NULL,
    sector VARCHAR(100),
    industry VARCHAR(100),
    website VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. instruments (CORE TABLE)
Universal instrument registry with stable IDs.

```sql
CREATE TABLE instruments (
    instrument_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_class_id VARCHAR(50) NOT NULL REFERENCES asset_classes(asset_class_id),
    instrument_type VARCHAR(50) NOT NULL,
    primary_symbol VARCHAR(50) NOT NULL,
    instrument_name VARCHAR(300) NOT NULL,
    exchange_id UUID REFERENCES exchanges(exchange_id),
    currency VARCHAR(10) NOT NULL,
    country VARCHAR(10) NOT NULL,
    issuer_id UUID REFERENCES issuers(issuer_id),
    
    -- Status & Lifecycle
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    effective_from DATE NOT NULL,
    effective_to DATE,
    
    -- Data Governance
    data_verification_status VARCHAR(30) DEFAULT 'NOT_VERIFIED',
    data_source_id UUID,
    
    -- Instrument-Specific Metadata
    tick_size DECIMAL(20, 10),
    lot_size INTEGER,
    contract_multiplier DECIMAL(20, 10),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_instruments_symbol ON instruments(primary_symbol);
CREATE INDEX idx_instruments_asset_class ON instruments(asset_class_id);
CREATE INDEX idx_instruments_exchange ON instruments(exchange_id);
CREATE INDEX idx_instruments_status ON instruments(status);
CREATE INDEX idx_instruments_country ON instruments(country);
```

**Key Design Decisions:**
- `instrument_id` is the primary key (UUID)
- `primary_symbol` is NOT unique (same symbol can exist on different exchanges)
- `effective_from` and `effective_to` track the validity period
- `data_verification_status` tracks data quality

#### 5. instrument_identifiers
Multiple identifiers for the same instrument (ticker, ISIN, FIGI, etc.).

```sql
CREATE TABLE instrument_identifiers (
    identifier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instrument_id UUID NOT NULL REFERENCES instruments(instrument_id),
    identifier_type VARCHAR(30) NOT NULL,  -- TICKER, ISIN, FIGI, etc.
    identifier_value VARCHAR(100) NOT NULL,
    source VARCHAR(100),
    valid_from DATE,
    valid_to DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_identifiers_instrument ON instrument_identifiers(instrument_id);
CREATE INDEX idx_identifiers_value ON instrument_identifiers(identifier_value);
CREATE INDEX idx_identifiers_type ON instrument_identifiers(identifier_type);
```

**Use Cases:**
- Track historical ticker changes
- Map between different identifier systems
- Support multiple exchange symbols for same instrument

#### 6. instrument_status_history
Tracks all status changes for audit trail.

```sql
CREATE TABLE instrument_status_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instrument_id UUID NOT NULL REFERENCES instruments(instrument_id),
    status VARCHAR(20) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_status_history_instrument ON instrument_status_history(instrument_id);
CREATE INDEX idx_status_history_effective ON instrument_status_history(effective_from);
```

**Status Values:**
- ACTIVE: Currently trading
- IPO: Initial public offering
- SUSPENDED: Trading suspended
- DELISTED: Removed from exchange
- EXPIRED: Contract expired (futures, options)
- MATURED: Bond matured
- INACTIVE: Not currently trading

#### 7. corporate_actions
Corporate events that affect instruments.

```sql
CREATE TABLE corporate_actions (
    action_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instrument_id UUID NOT NULL REFERENCES instruments(instrument_id),
    action_type VARCHAR(30) NOT NULL,
    announcement_date DATE NOT NULL,
    ex_date DATE NOT NULL,
    effective_date DATE NOT NULL,
    adjustment_factor DECIMAL(20, 10),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_corp_actions_instrument ON corporate_actions(instrument_id);
CREATE INDEX idx_corp_actions_effective ON corporate_actions(effective_date);
```

**Action Types:**
- STOCK_SPLIT: Stock split (e.g., 2:1, 10:1)
- REVERSE_SPLIT: Reverse stock split
- CASH_DIVIDEND: Cash dividend payment
- STOCK_DIVIDEND: Stock dividend
- RIGHTS_ISSUE: Rights issue
- BONUS_SHARES: Bonus shares
- MERGER: Company merger
- ACQUISITION: Company acquisition
- OTHER: Other corporate actions

#### 8. data_sources
Registry of data providers with license tracking.

```sql
CREATE TABLE data_sources (
    source_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(200) NOT NULL,
    source_url VARCHAR(500),
    access_method VARCHAR(30) NOT NULL,  -- API, WEB_SCRAPING, CSV_DOWNLOAD, MANUAL
    license_status VARCHAR(30) DEFAULT 'NOT_VERIFIED',
    attribution_required BOOLEAN DEFAULT FALSE,
    storage_permission BOOLEAN DEFAULT FALSE,
    redistribution_permission BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Relationships

```
asset_classes (1) ←→ (N) instruments
exchanges (1) ←→ (N) instruments
issuers (1) ←→ (N) instruments
instruments (1) ←→ (N) instrument_identifiers
instruments (1) ←→ (N) instrument_status_history
instruments (1) ←→ (N) corporate_actions
```

## Data Governance

### Verification Status

All instruments track their data verification status:

- **VERIFIED**: Data has been verified against authoritative sources
- **PARTIALLY_VERIFIED**: Some data points verified, others not
- **NOT_VERIFIED**: Data has not been verified
- **NOT_CONFIGURED**: Data source not yet configured

### Point-in-Time Queries

The schema supports point-in-time queries to avoid look-ahead bias:

```sql
-- Get all instruments that were active on a specific date
SELECT * FROM instruments
WHERE effective_from <= '2024-01-15'
  AND (effective_to IS NULL OR effective_to >= '2024-01-15')
  AND status = 'ACTIVE';
```

### Historical Ticker Tracking

Historical ticker changes are tracked via `instrument_identifiers`:

```sql
-- Get all historical tickers for an instrument
SELECT identifier_value, valid_from, valid_to
FROM instrument_identifiers
WHERE instrument_id = '...'
  AND identifier_type = 'TICKER'
ORDER BY valid_from;
```

## Migration Strategy

### Phase 01 (Current)
- Implement schema in TypeScript with localStorage persistence
- Provide API abstraction layer for future backend migration
- Maintain backward compatibility with existing Asset interface

### Phase 02 (Future)
- Migrate to PostgreSQL database
- Implement database migrations with Alembic
- Add data seeding scripts
- Implement full API endpoints

### Phase 03 (Future)
- Add TimescaleDB for time-series data
- Implement data ingestion pipelines
- Add data quality monitoring

## Security Considerations

1. **UUID Primary Keys**: Prevent enumeration attacks
2. **Foreign Key Constraints**: Ensure referential integrity
3. **Audit Trail**: All changes tracked in status history
4. **Data Governance**: Verification status tracking
5. **Access Control**: To be implemented in future phases

## Performance Considerations

1. **Indexes**: Created on frequently queried columns
2. **Pagination**: Search results support pagination
3. **Caching**: To be implemented with Redis in future phases
4. **Partitioning**: Consider time-based partitioning for large datasets

## Testing Strategy

1. **Unit Tests**: Test all CRUD operations
2. **Integration Tests**: Test relationships and constraints
3. **Data Quality Tests**: Verify data governance rules
4. **Performance Tests**: Test search and filtering performance

## Future Enhancements

1. **Full-Text Search**: Add PostgreSQL full-text search
2. **Geospatial Support**: Add location-based queries
3. **Real-Time Updates**: Add WebSocket support for live updates
4. **Bulk Operations**: Add bulk import/export capabilities
5. **Audit Logging**: Add comprehensive audit trail

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-XX  
**Author:** MAMIE Development Team
