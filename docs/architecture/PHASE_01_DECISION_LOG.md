# PHASE 01 Decision Log

**Phase:** 01 — Core Platform & Universal Instrument Registry  
**Date:** 2026-01-XX

---

## Decision 1: Frontend-Only Implementation

**Date:** 2026-01-XX  
**Status:** ACCEPTED

### Context
PHASE 01 specification calls for a Universal Instrument Registry. The repository audit (PHASE 00) revealed that the current repository is frontend-only with no backend or database.

### Decision
Implement the instrument registry using TypeScript with localStorage persistence, rather than building a full backend with PostgreSQL.

### Rationale
1. **No Breaking Changes**: Adding a backend would require significant infrastructure changes
2. **Scope Alignment**: PHASE 01 scope is "Core Platform & Instrument Registry" - the focus is on schema design and API contracts
3. **API Abstraction**: The implementation uses an API abstraction layer that can be easily replaced with HTTP endpoints in PHASE 02
4. **Proof of Concept**: Frontend implementation proves the design works before investing in backend infrastructure
5. **Incremental Approach**: Follows the principle of building what is verified

### Alternatives Considered
1. **Full Backend Implementation**: Build FastAPI + PostgreSQL in PHASE 01
   - Rejected: Too much scope creep, would delay PHASE 01 completion
2. **Skip PHASE 01**: Go directly to PHASE 02 with full backend
   - Rejected: Need to validate schema design before implementing backend
3. **Hybrid Approach**: Frontend registry + simple backend
   - Rejected: Adds complexity without clear benefit

### Consequences
- ✅ Faster PHASE 01 completion
- ✅ Easier to iterate on schema design
- ⚠️ Data is not persistent across devices
- ⚠️ No production-grade persistence
- ⚠️ Backend implementation required in PHASE 02

### Migration Path
PHASE 02 will implement PostgreSQL backend and migrate localStorage data.

---

## Decision 2: UUID-Based Instrument IDs

**Date:** 2026-01-XX  
**Status:** ACCEPTED

### Context
The specification requires stable instrument IDs that don't change when symbols change.

### Decision
Use UUID v4 for instrument_id as the primary key.

### Rationale
1. **Stability**: UUIDs never change, even if symbols change
2. **Global Uniqueness**: No coordination needed for ID generation
3. **Security**: Prevents enumeration attacks
4. **Distributed**: Can be generated on frontend or backend
5. **Standard**: Industry standard for unique identifiers

### Alternatives Considered
1. **Auto-increment integers**: Rejected - not stable across systems, predictable
2. **Symbol-based IDs**: Rejected - symbols can change
3. **Composite keys (symbol + exchange)**: Rejected - complex, symbols can change

### Consequences
- ✅ Stable identifiers
- ✅ No coordination needed
- ⚠️ Larger storage footprint (36 chars vs 4-8 bytes for integers)
- ⚠️ Less readable in URLs

---

## Decision 3: Symbol Not Unique Constraint

**Date:** 2026-01-XX  
**Status:** ACCEPTED

### Context
The same ticker symbol can exist on different exchanges (e.g., "ABC" on NYSE and "ABC" on IDX are different companies).

### Decision
Do NOT enforce unique constraint on primary_symbol. Allow same symbol on different exchanges.

### Rationale
1. **Real-World Accuracy**: Same symbols exist on different exchanges
2. **Flexibility**: Supports multi-exchange instruments
3. **Instrument ID**: Uniqueness is enforced via instrument_id, not symbol

### Alternatives Considered
1. **Unique constraint on symbol**: Rejected - would prevent legitimate use cases
2. **Unique constraint on (symbol, exchange)**: Considered but rejected - instrument_id is sufficient

### Consequences
- ✅ Accurate representation of real-world instruments
- ✅ Flexible for multi-exchange scenarios
- ⚠️ Must use instrument_id for lookups, not symbol

---

## Decision 4: localStorage for Persistence

**Date:** 2026-01-XX  
**Status:** ACCEPTED (with limitations)

### Context
Need a persistence mechanism for the instrument registry in PHASE 01.

### Decision
Use localStorage for data persistence in PHASE 01, with plans to migrate to PostgreSQL in PHASE 02.

### Rationale
1. **Simplicity**: No backend infrastructure required
2. **Speed**: Fast implementation and iteration
3. **Browser-Native**: No external dependencies
4. **Sufficient for PHASE 01**: PHASE 01 is about schema design, not production deployment

### Alternatives Considered
1. **IndexedDB**: Rejected - more complex API, overkill for PHASE 01
2. **PostgreSQL**: Rejected - requires backend, out of scope for PHASE 01
3. **In-memory only**: Rejected - data would be lost on refresh

### Consequences
- ✅ Fast implementation
- ✅ No backend required
- ⚠️ Data limited to ~5-10MB per browser
- ⚠️ Data not shared across devices
- ⚠️ Data cleared if browser cache cleared
- ⚠️ Not suitable for production

### Migration Path
PHASE 02 will implement PostgreSQL and provide migration script.

---

## Decision 5: API Abstraction Layer

**Date:** 2026-01-XX  
**Status:** ACCEPTED

### Context
Need to ensure easy migration from localStorage to backend API in PHASE 02.

### Decision
Implement an API abstraction layer with a clear interface contract.

### Rationale
1. **Separation of Concerns**: Business logic separated from data access
2. **Easy Migration**: Can swap localStorage implementation with HTTP implementation
3. **Testing**: Can mock API for testing
4. **Future-Proof**: Ready for backend implementation

### Implementation
```typescript
interface InstrumentRegistryApi {
  getInstruments(): Promise<ApiResponse<Instrument[]>>;
  createInstrument(instrument): Promise<ApiResponse<Instrument>>;
  // ... other methods
}

class LocalStorageApi implements InstrumentRegistryApi {
  // Current implementation
}

// Future: class HttpApi implements InstrumentRegistryApi
```

### Consequences
- ✅ Easy migration path
- ✅ Testable architecture
- ⚠️ Slight overhead from abstraction
- ⚠️ Need to maintain interface contract

---

## Decision 6: Backward Compatibility with Asset Interface

**Date:** 2026-01-XX  
**Status:** ACCEPTED

### Context
Existing code uses the `Asset` interface. Need to add instrument registry without breaking existing code.

### Decision
Keep the existing `Asset` interface unchanged. Implement instrument registry as a parallel system.

### Rationale
1. **No Breaking Changes**: Existing 8 research modules continue to work
2. **Incremental Adoption**: Can migrate modules to instrument registry gradually
3. **Risk Mitigation**: Reduces risk of breaking existing functionality

### Alternatives Considered
1. **Replace Asset with Instrument**: Rejected - breaking change, would break all modules
2. **Extend Asset interface**: Considered but rejected - would mix concerns

### Consequences
- ✅ No breaking changes
- ✅ Existing modules continue to work
- ⚠️ Two parallel systems (Asset and Instrument)
- ⚠️ Need migration plan for future phases

### Migration Path
Future phases will gradually migrate from Asset to Instrument interface.

---

## Decision 7: Test Framework Selection

**Date:** 2026-01-XX  
**Status:** ACCEPTED

### Context
Need a testing framework for the instrument registry.

### Decision
Use Vitest for testing.

### Rationale
1. **Vite Integration**: Native support for Vite projects
2. **TypeScript Support**: Excellent TypeScript support
3. **Fast**: Fast test execution
4. **Modern**: Modern testing features
5. **Compatible**: Compatible with React Testing Library

### Alternatives Considered
1. **Jest**: Rejected - slower, more configuration needed
2. **Mocha**: Rejected - less modern, less features
3. **Playwright**: Rejected - overkill for unit tests

### Consequences
- ✅ Fast test execution
- ✅ Good TypeScript support
- ⚠️ Need to configure Vitest
- ⚠️ Team may need to learn Vitest

---

## Summary of Decisions

| # | Decision | Status | Risk |
|---|----------|--------|------|
| 1 | Frontend-only implementation | ACCEPTED | Low |
| 2 | UUID-based instrument IDs | ACCEPTED | Low |
| 3 | Symbol not unique constraint | ACCEPTED | Low |
| 4 | localStorage for persistence | ACCEPTED | Medium |
| 5 | API abstraction layer | ACCEPTED | Low |
| 6 | Backward compatibility | ACCEPTED | Low |
| 7 | Vitest for testing | ACCEPTED | Low |

**Overall Risk Level:** LOW

All decisions are low-risk and align with PHASE 01 scope. Medium-risk decisions (localStorage) are mitigated by clear migration path to PHASE 02.

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-XX  
**Author:** MAMIE Development Team
