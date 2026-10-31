# MAMIE Implementation Plan

**Date:** 2026-01-XX  
**Version:** 1.0  
**Status:** DRAFT — AWAITING APPROVAL

---

## 1. EXECUTIVE SUMMARY

This document outlines the implementation plan for building the Multi-Asset Market Intelligence Engine (MAMIE) from scratch, following the architecture specification and addressing all gaps identified in the repository audit.

**Approach:** Build new production-grade system (Option A)  
**Timeline:** 9-12 months (11 phases)  
**Team:** 2-3 full-stack engineers, 1 quantitative developer, 1 DevOps engineer

---

## 2. IMPLEMENTATION STRATEGY

### 2.1 Phased Approach

The implementation follows 11 phases as defined in the MASTER CODING PROMPT:

```
PHASE 00: Repository Audit & Project Foundation          [CURRENT]
    ↓
PHASE 01: Core Platform & Instrument Registry
    ↓
PHASE 02: Data Source & Data Integrity
    ↓
PHASE 03: Indonesian Equity Intelligence
    ↓
PHASE 04: Other Asset-Class Engines
    ↓
PHASE 05: Macro & Cross-Asset Intelligence
    ↓
PHASE 06: Quantitative & Probability Engine
    ↓
PHASE 07: Portfolio & Risk Engine
    ↓
PHASE 08: AI Interpretation Engine
    ↓
PHASE 09: Dashboard & Integration
    ↓
PHASE 10: Security, Testing & Deployment Readiness
```

### 2.2 Decision: Rebuild vs. Refactor

**DECISION:** REBUILD (Option A)

**Rationale:**
- Current codebase is frontend-only prototype
- Critical gaps: no backend, no database, no auth, no testing
- Mock data violates evidence-first policy
- Clean architecture needed for maintainability
- Existing code serves as UI reference only

---

## 3. TECHNOLOGY STACK

### 3.1 Approved Stack

**Frontend:**
- React 18 + TypeScript 5
- Vite 6 (build tool)
- Tailwind CSS 4 (styling)
- lightweight-charts 5 (TradingView charts)
- recharts 2 (statistical charts)
- TanStack Query (server state)
- Zustand (client state)

**Backend:**
- Python 3.11+
- FastAPI (web framework)
- Pydantic (validation)
- SQLAlchemy (ORM)
- Alembic (migrations)

**Database:**
- PostgreSQL 15+
- TimescaleDB (time-series extension)

**Quantitative:**
- NumPy (numerical computing)
- Polars (data processing)
- SciPy (scientific computing)
- scikit-learn (machine learning)
- Statsmodels (statistical models)

**AI:**
- OpenAI API (LLM provider)
- LangChain (orchestration)

**Infrastructure:**
- Docker (containerization)
- GitHub Actions (CI/CD)
- Redis (caching)
- Celery (background tasks)

**Testing:**
- Pytest (Python)
- Vitest (TypeScript)
- React Testing Library
- Playwright (E2E)

**Monitoring:**
- Prometheus + Grafana
- Sentry (error tracking)
- Structured logging

### 3.2 Technology Justification

| Technology | Why | Alternative Considered |
|------------|-----|------------------------|
| FastAPI | Async, fast, Python ecosystem | Flask (slower), Django (heavier) |
| PostgreSQL | Robust, feature-rich | MongoDB (no SQL), MySQL (less features) |
| TimescaleDB | Time-series optimizations | InfluxDB (less flexible), ClickHouse (complex) |
| Polars | Fast, lazy evaluation | Pandas (slower), Dask (complex) |
| TanStack Query | Server state management | Redux (more complex), SWR (less features) |
| Zustand | Simple client state | Redux (boilerplate), Context (performance) |

---

## 4. PROJECT STRUCTURE

### 4.1 Monorepo Structure

```
mamie/
├── backend/                    # Python FastAPI backend
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── core/              # Core config, security
│   │   ├── db/                # Database models, migrations
│   │   ├── domain/            # Business logic
│   │   │   ├── instruments/   # Instrument registry
│   │   │   ├── market_data/   # Market data engine
│   │   │   ├── equities/      # Equity intelligence
│   │   │   ├── commodities/   # Commodity intelligence
│   │   │   ├── fx/            # FX intelligence
│   │   │   ├── crypto/        # Crypto intelligence
│   │   │   ├── fixed_income/  # Fixed income intelligence
│   │   │   ├── indices/       # Indices & derivatives
│   │   │   ├── macro/         # Macro intelligence
│   │   │   ├── cross_asset/   # Cross-asset analysis
│   │   │   ├── quant/         # Quantitative engine
│   │   │   ├── probability/   # Probability engine
│   │   │   ├── portfolio/     # Portfolio & risk
│   │   │   ├── ai/            # AI interpretation
│   │   │   └── governance/    # Evidence & audit
│   │   ├── services/          # External integrations
│   │   └── utils/             # Utilities
│   ├── tests/                 # Pytest tests
│   ├── alembic/               # Database migrations
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                   # React TypeScript frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API client
│   │   ├── stores/            # Zustand stores
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utilities
│   │   └── tests/             # Vitest tests
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docs/                       # Documentation
│   ├── architecture/
│   ├── database/
│   ├── api/
│   ├── data-sources/
│   ├── asset-modules/
│   ├── quantitative/
│   ├── ai-engine/
│   ├── security/
│   ├── testing/
│   ├── deployment/
│   ├── roadmap/
│   └── audit/
│
├── scripts/                    # Utility scripts
├── .github/                    # GitHub Actions
│   └── workflows/
├── docker-compose.yml
├── .env.example
├── README.md
└── LICENSE
```

### 4.2 Database Schema (High-Level)

```
Core Entities:
- instruments (stable ID, symbol, asset class, exchange, etc.)
- instrument_status_history (listing, delisting, suspension)
- corporate_actions (splits, dividends, mergers)
- data_sources (source registry)
- source_licenses (license tracking)
- raw_market_data (immutable raw data)
- market_bars (OHLCV)
- trades (tick data)
- quotes (bid/ask)
- financial_statements (point-in-time)
- macro_releases (economic data)
- evidence_registry (audit trail)
- model_registry (ML models)
- audit_logs (comprehensive logging)
```

---

## 5. PHASE DETAILS

### PHASE 00: Repository Audit & Project Foundation

**Status:** IN PROGRESS  
**Duration:** 1 week  
**Deliverables:**
- ✅ REPOSITORY_AUDIT.md
- ✅ EXISTING_ARCHITECTURE.md
- ⏳ IMPLEMENTATION_PLAN.md (this document)
- ⏳ TECHNICAL_RISK_REGISTER.md
- ⏳ Project structure setup
- ⏳ Development environment
- ⏳ CI/CD pipeline
- ⏳ Coding standards

**Acceptance Criteria:**
- Audit documents approved
- Project structure created
- Development environment working
- CI/CD pipeline operational
- Coding standards documented

**Dependencies:** None

---

### PHASE 01: Core Platform & Instrument Registry

**Status:** NOT STARTED  
**Duration:** 3-4 weeks  
**Deliverables:**
- FastAPI backend setup
- PostgreSQL + TimescaleDB setup
- Database schema (core entities)
- Instrument registry API
- IDX instrument metadata
- Authentication baseline (OAuth 2.0)
- Basic frontend shell
- API documentation

**Acceptance Criteria:**
- Instruments can be created, read, updated, deleted
- Stable instrument IDs (UUID)
- Historical status tracking works
- Authentication working
- API documented
- Tests passing (80%+ coverage)

**Dependencies:** PHASE 00

---

### PHASE 02: Data Source & Data Integrity

**Status:** NOT STARTED  
**Duration:** 3-4 weeks  
**Deliverables:**
- Data source registry
- License registry
- Data ingestion framework
- Raw data storage
- Data quality engine
- Job monitoring
- Source adapters (Yahoo Finance, CFTC, FRED)

**Acceptance Criteria:**
- Sources registered with licenses
- Data ingestion working
- Quality checks implemented
- Invalid data rejected
- Job status monitored
- Tests passing

**Dependencies:** PHASE 01

---

### PHASE 03: Indonesian Equity Intelligence

**Status:** NOT STARTED  
**Duration:** 4-5 weeks  
**Deliverables:**
- IDX universe management
- Stock overview API
- Historical OHLCV interface
- Fundamental data schema
- Corporate action handling
- Sector classification
- Stock screener
- Market breadth

**Acceptance Criteria:**
- Historical instrument mapping works
- Corporate actions handled correctly
- Data gaps marked as "NO DATA AVAILABLE"
- No fabricated data
- Tests passing

**Dependencies:** PHASE 02

---

### PHASE 04: Other Asset-Class Engines

**Status:** NOT STARTED  
**Duration:** 4-5 weeks  
**Deliverables:**
- Commodity intelligence module
- FX intelligence module
- Crypto intelligence module
- Fixed income intelligence module
- Indices & derivatives module

**Acceptance Criteria:**
- Each module independent
- Data contracts consistent
- Domain-specific calculations tested
- Tests passing

**Dependencies:** PHASE 02

---

### PHASE 05: Macro & Cross-Asset Intelligence

**Status:** NOT STARTED  
**Duration:** 3-4 weeks  
**Deliverables:**
- Macro data framework
- Cross-asset correlation engine
- Relative strength analysis
- Lead-lag research
- Regime-dependent analysis

**Acceptance Criteria:**
- Time alignment correct
- Point-in-time data enforced
- Missing data handled
- Tests passing

**Dependencies:** PHASE 03, PHASE 04

---

### PHASE 06: Quantitative & Probability Engine

**Status:** NOT STARTED  
**Duration:** 4-5 weeks  
**Deliverables:**
- Shared quantitative library
- Regime detection engine
- Probability models
- Walk-forward validation
- Calibration reporting

**Acceptance Criteria:**
- No look-ahead bias
- No data leakage
- Reproducible results
- Out-of-sample evaluation
- Tests passing

**Dependencies:** PHASE 05

---

### PHASE 07: Portfolio & Risk Engine

**Status:** NOT STARTED  
**Duration:** 3-4 weeks  
**Deliverables:**
- Portfolio management
- Exposure analysis
- Risk metrics (VaR, CVaR, MDD)
- Stress testing
- Scenario analysis

**Acceptance Criteria:**
- Formulas validated
- Risk outputs traceable
- Tests passing

**Dependencies:** PHASE 06

---

### PHASE 08: AI Interpretation Engine

**Status:** NOT STARTED  
**Duration:** 3-4 weeks  
**Deliverables:**
- LLM provider adapter
- Evidence-based prompting
- Structured report generation
- Hallucination controls
- Token/cost monitoring

**Acceptance Criteria:**
- No data fabrication
- Evidence references valid
- Unsupported claims rejected
- Provider failure handled
- Tests passing

**Dependencies:** PHASE 07

---

### PHASE 09: Dashboard & Integration

**Status:** NOT STARTED  
**Duration:** 4-5 weeks  
**Deliverables:**
- Institutional dashboard
- Market terminal
- AI research interface
- Portfolio risk dashboard
- Data management UI
- Model monitoring

**Acceptance Criteria:**
- All modules integrated
- No simulated data labeled as real
- Error/loading states present
- Responsive design
- Tests passing

**Dependencies:** PHASE 08

---

### PHASE 10: Security, Testing & Deployment Readiness

**Status:** NOT STARTED  
**Duration:** 3-4 weeks  
**Deliverables:**
- Security audit
- Integration testing
- Performance testing
- Backup/recovery test
- Deployment documentation
- Final QA report

**Acceptance Criteria:**
- No critical security findings
- Test report documented
- Deployment reproducible
- Monitoring operational
- Recovery tested

**Dependencies:** PHASE 09

---

## 6. TIMELINE

### 6.1 High-Level Timeline

```
Month 1:    PHASE 00 (Audit & Foundation)
Month 2:    PHASE 01 (Core Platform)
Month 3:    PHASE 02 (Data Source & Integrity)
Month 4-5:  PHASE 03 (Indonesian Equity)
Month 5-6:  PHASE 04 (Other Asset Classes)
Month 7:    PHASE 05 (Macro & Cross-Asset)
Month 7-8:  PHASE 06 (Quantitative & Probability)
Month 9:    PHASE 07 (Portfolio & Risk)
Month 9-10: PHASE 08 (AI Interpretation)
Month 10-11: PHASE 09 (Dashboard & Integration)
Month 12:   PHASE 10 (Security, Testing & Deployment)
```

**Total Duration:** 12 months

### 6.2 Milestones

| Milestone | Target Date | Phase |
|-----------|-------------|-------|
| M1: Audit Complete | Week 1 | PHASE 00 |
| M2: Core Platform Ready | Month 2 | PHASE 01 |
| M3: Data Pipeline Working | Month 3 | PHASE 02 |
| M4: IDX Intelligence MVP | Month 5 | PHASE 03 |
| M5: All Asset Classes | Month 6 | PHASE 04 |
| M6: Cross-Asset Analysis | Month 7 | PHASE 05 |
| M7: Quant Models Validated | Month 8 | PHASE 06 |
| M8: Risk Engine Complete | Month 9 | PHASE 07 |
| M9: AI Reports Working | Month 10 | PHASE 08 |
| M10: Dashboard Integrated | Month 11 | PHASE 09 |
| M11: Production Ready | Month 12 | PHASE 10 |

---

## 7. RESOURCE REQUIREMENTS

### 7.1 Team Structure

**Required Roles:**
- 1x Principal Software Architect (part-time)
- 2x Senior Full-Stack Engineers (full-time)
- 1x Quantitative Developer (full-time)
- 1x DevOps Engineer (part-time)
- 1x QA Engineer (part-time, from PHASE 09)

**Total:** 4.5 FTE

### 7.2 Infrastructure Costs

**Estimated Monthly Costs:**
- Cloud hosting (AWS/GCP): $500-1000
- Database (managed PostgreSQL): $200-400
- Redis: $50-100
- OpenAI API: $200-500 (depends on usage)
- Monitoring: $100-200
- CI/CD: $50-100

**Total:** $1100-2300/month

### 7.3 Development Tools

**Required:**
- GitHub Enterprise (or GitLab)
- Jira/Linear (project management)
- Figma (design)
- Slack/Discord (communication)
- VS Code / PyCharm (IDEs)

---

## 8. RISK MITIGATION

### 8.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Backend complexity | High | High | Start simple, iterate |
| Data quality issues | High | High | Data quality engine early |
| Performance bottlenecks | Medium | High | Profile early |
| Integration complexity | Medium | Medium | Adapter pattern |
| Security vulnerabilities | Medium | Critical | Security audit |

### 8.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Scope creep | High | High | Strict phase gates |
| Timeline overrun | High | Medium | Prioritize MVP |
| Resource constraints | Medium | High | Start with core |
| Data availability | High | High | Document gaps |

---

## 9. QUALITY ASSURANCE

### 9.1 Testing Strategy

**Unit Tests:**
- Backend: Pytest (80%+ coverage)
- Frontend: Vitest (80%+ coverage)

**Integration Tests:**
- API endpoints
- Database operations
- External service mocks

**E2E Tests:**
- Critical user flows
- Cross-browser testing

**Performance Tests:**
- Load testing
- Stress testing
- Query optimization

### 9.2 Code Quality

**Standards:**
- ESLint + Prettier (frontend)
- Black + isort + flake8 (backend)
- TypeScript strict mode
- Type hints (Python)

**Reviews:**
- Pull request reviews required
- Architecture decision records
- Documentation updates

---

## 10. DEPLOYMENT STRATEGY

### 10.1 Environment Strategy

**Environments:**
- Development (local)
- Staging (testing)
- Production (live)

**Promotion:**
- Dev → Staging: Automated on merge to main
- Staging → Production: Manual approval

### 10.2 Deployment Process

```
Code Push
    ↓
CI Pipeline (lint, test, build)
    ↓
Deploy to Staging
    ↓
Automated Tests
    ↓
Manual Approval
    ↓
Deploy to Production
    ↓
Health Checks
    ↓
Monitor
```

---

## 11. SUCCESS CRITERIA

### 11.1 Phase 00 Success

- ✅ Audit documents completed
- ✅ Project structure created
- ✅ Development environment working
- ✅ CI/CD pipeline operational
- ✅ Coding standards documented

### 11.2 Overall Project Success

- All 11 phases completed
- All acceptance criteria met
- No critical bugs in production
- 80%+ test coverage
- Security audit passed
- Performance targets met
- User acceptance achieved

---

## 12. NEXT STEPS

### Immediate Actions (This Week)

1. ✅ Complete REPOSITORY_AUDIT.md
2. ✅ Complete EXISTING_ARCHITECTURE.md
3. ⏳ Complete IMPLEMENTATION_PLAN.md (this document)
4. ⏳ Complete TECHNICAL_RISK_REGISTER.md
5. ⏳ Present to stakeholders for approval
6. ⏳ Upon approval, begin PHASE 01

### PHASE 01 Kickoff (Upon Approval)

1. Setup project structure (monorepo)
2. Initialize backend (FastAPI)
3. Initialize frontend (React + Vite)
4. Setup database (PostgreSQL + TimescaleDB)
5. Create database schema (core entities)
6. Implement instrument registry API
7. Setup authentication (OAuth 2.0)
8. Write tests
9. Document API
10. Deploy to staging

---

## 13. APPROVAL REQUIRED

**DECISION NEEDED:**

**Approve Implementation Plan?**
- [ ] Yes, proceed with PHASE 01
- [ ] No, requires revisions
- [ ] Need more information

**Approve Technology Stack?**
- [ ] Yes, stack is approved
- [ ] No, requires changes
- [ ] Need more information

**Approve Timeline (12 months)?**
- [ ] Yes, timeline is acceptable
- [ ] No, needs adjustment
- [ ] Need more information

**Approve Resource Allocation (4.5 FTE)?**
- [ ] Yes, resources approved
- [ ] No, needs adjustment
- [ ] Need more information

---

**END OF DOCUMENT**

**Version:** 1.0  
**Status:** DRAFT — AWAITING APPROVAL  
**Next Action:** Stakeholder review and approval
