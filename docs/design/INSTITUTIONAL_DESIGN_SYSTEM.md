# MAMIE Institutional Design System

**Version:** 1.0  
**Last Updated:** 2026-01-XX  
**Status:** ACTIVE

---

## 1. DESIGN TOKENS

### 1.1 Color Palette

#### Background Colors
```css
/* Primary backgrounds */
--color-bg-primary: #0B1220;      /* Deep Navy - Main background */
--color-bg-secondary: #111827;    /* Secondary background */
--color-bg-surface: #172033;      /* Panel surface */
--color-bg-elevated: #1E293B;     /* Elevated surface (modals, dropdowns) */

/* Border colors */
--color-border-default: #29364A;  /* Default border */
--color-border-subtle: #1E293B;   /* Subtle border */
--color-border-strong: #3B82F6;   /* Strong border (focus, active) */
```

#### Accent Colors
```css
--color-accent-primary: #3B82F6;  /* Electric Blue - Primary accent */
--color-accent-secondary: #06B6D4; /* Cyan - Secondary accent */
--color-accent-tertiary: #8B5CF6;  /* Purple - Tertiary accent */
```

#### Semantic Colors
```css
/* Status colors */
--color-success: #10B981;         /* Positive, bullish, approved */
--color-danger: #EF4444;          /* Negative, bearish, rejected */
--color-warning: #F59E0B;         /* Warning, caution */
--color-info: #3B82F6;            /* Information, neutral */

/* Text colors */
--color-text-primary: #F3F4F6;    /* Primary text */
--color-text-secondary: #9CA3AF;  /* Secondary text */
--color-text-tertiary: #6B7280;   /* Tertiary text */
--color-text-disabled: #4B5563;   /* Disabled text */
```

#### Data Visualization Colors
```css
/* Chart colors - sequential */
--color-chart-1: #3B82F6;
--color-chart-2: #06B6D4;
--color-chart-3: #8B5CF6;
--color-chart-4: #F59E0B;
--color-chart-5: #10B981;

/* Chart colors - diverging */
--color-chart-positive: #10B981;
--color-chart-negative: #EF4444;
--color-chart-neutral: #6B7280;
```

### 1.2 Typography

#### Font Families
```css
/* Primary font - UI text */
--font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace font - data, code, terminal */
--font-family-mono: 'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace;
```

#### Font Sizes
```css
--font-size-xs: 0.75rem;    /* 12px - Labels, captions */
--font-size-sm: 0.875rem;   /* 14px - Body text, secondary */
--font-size-base: 1rem;     /* 16px - Default body */
--font-size-lg: 1.125rem;   /* 18px - Emphasized text */
--font-size-xl: 1.25rem;    /* 20px - Section headers */
--font-size-2xl: 1.5rem;    /* 24px - Page headers */
--font-size-3xl: 1.875rem;  /* 30px - Large headers */
--font-size-4xl: 2.25rem;   /* 36px - Hero text */
```

#### Font Weights
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

#### Line Heights
```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

#### Letter Spacing
```css
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
```

### 1.3 Spacing System

Based on 8px grid:
```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
```

### 1.4 Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem;  /* 2px - Subtle rounding */
--radius-base: 0.25rem; /* 4px - Default */
--radius-md: 0.375rem;  /* 6px - Medium */
--radius-lg: 0.5rem;    /* 8px - Large */
--radius-xl: 0.75rem;   /* 12px - Extra large */
--radius-full: 9999px;  /* Fully rounded */
```

### 1.5 Shadows & Elevation

```css
/* Elevation levels */
--shadow-none: none;
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

### 1.6 Transitions

```css
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-slow: 300ms;

--easing-default: cubic-bezier(0.4, 0, 0.2, 1);
--easing-in: cubic-bezier(0.4, 0, 1, 1);
--easing-out: cubic-bezier(0, 0, 0.2, 1);
--easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 2. COMPONENT LIBRARY

### 2.1 Base Components

#### Button
```tsx
<Button variant="primary" size="md">Primary Button</Button>
<Button variant="secondary" size="md">Secondary Button</Button>
<Button variant="ghost" size="md">Ghost Button</Button>
<Button variant="danger" size="md">Danger Button</Button>
```

**Variants:**
- `primary` - Electric blue background, white text
- `secondary` - Transparent background, blue border
- `ghost` - Transparent, no border
- `danger` - Red background, white text

**Sizes:**
- `sm` - Small (padding: 6px 12px)
- `md` - Medium (padding: 8px 16px)
- `lg` - Large (padding: 12px 24px)

#### Card
```tsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

**Props:**
- `elevation` - 'none' | 'sm' | 'md' | 'lg'
- `padding` - 'none' | 'sm' | 'md' | 'lg'

#### Badge
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="danger">Error</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
```

#### Input
```tsx
<Input type="text" placeholder="Enter value" />
<Input type="number" placeholder="0.00" />
<Input type="search" placeholder="Search..." />
```

#### Select
```tsx
<Select options={options} value={value} onChange={handleChange} />
```

#### Table
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### 2.2 Data Display Components

#### MetricCard
```tsx
<MetricCard
  label="Total Value"
  value="$1,250,000"
  change={+1.5}
  changeLabel="vs yesterday"
/>
```

#### StatCard
```tsx
<StatCard
  title="Volatility"
  value="12.5%"
  trend="up"
  status="warning"
/>
```

#### DataGrid
```tsx
<DataGrid
  columns={columns}
  data={data}
  pagination={true}
  sortable={true}
/>
```

### 2.3 Chart Components

#### PriceChart
```tsx
<PriceChart
  data={ohlcData}
  type="candlestick"
  timeframe="1D"
  volume={true}
/>
```

#### LineChart
```tsx
<LineChart
  data={timeSeriesData}
  lines={[
    { dataKey: 'value', color: '#3B82F6', label: 'Price' }
  ]}
/>
```

#### HeatmapChart
```tsx
<HeatmapChart
  data={correlationMatrix}
  colorScale="diverging"
/>
```

### 2.4 Layout Components

#### Sidebar
```tsx
<Sidebar>
  <SidebarSection title="OVERVIEW">
    <SidebarItem icon={DashboardIcon} label="Executive Dashboard" />
    <SidebarItem icon={MarketIcon} label="Market Overview" />
  </SidebarSection>
</Sidebar>
```

#### TopBar
```tsx
<TopBar>
  <TopBarSearch />
  <TopBarInstrumentSelector />
  <TopBarNotifications />
  <TopBarUserMenu />
</TopBar>
```

#### Workspace
```tsx
<Workspace>
  <WorkspaceHeader>
    <WorkspaceTitle>Market Terminal</WorkspaceTitle>
    <WorkspaceActions>
      <Button>Export</Button>
    </WorkspaceActions>
  </WorkspaceHeader>
  <WorkspaceContent>
    {/* Content */}
  </WorkspaceContent>
</Workspace>
```

### 2.5 Feedback Components

#### Alert
```tsx
<Alert variant="info">Information message</Alert>
<Alert variant="success">Success message</Alert>
<Alert variant="warning">Warning message</Alert>
<Alert variant="danger">Error message</Alert>
```

#### Toast
```tsx
<Toast message="Data saved successfully" type="success" />
```

#### Skeleton
```tsx
<Skeleton width="100%" height="200px" />
```

#### EmptyState
```tsx
<EmptyState
  icon={ChartIcon}
  title="No data available"
  description="Select an instrument to view chart"
/>
```

---

## 3. LAYOUT PATTERNS

### 3.1 Page Layout

```
┌─────────────────────────────────────────────────────────┐
│ TopBar                                                  │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │  Workspace                                   │
│          │  ┌────────────────────────────────────────┐ │
│ 240px    │  │ WorkspaceHeader                        │ │
│ fixed    │  ├────────────────────────────────────────┤ │
│          │  │                                        │ │
│          │  │ WorkspaceContent                       │ │
│          │  │                                        │ │
│          │  │                                        │ │
│          │  └────────────────────────────────────────┘ │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### 3.2 Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│ Global Market Snapshot                                  │
├──────────────────────┬──────────────────────────────────┤
│ Market Regime        │ Asset Performance Matrix         │
│ Monitor              │                                  │
├──────────────────────┼──────────────────────────────────┤
│ Macro Intelligence   │ Liquidity Monitor                │
├──────────────────────┼──────────────────────────────────┤
│ Risk Monitor         │ Research Highlights              │
└──────────────────────┴──────────────────────────────────┘
```

### 3.3 Market Terminal Layout

```
┌─────────────────────────────────────────────────────────┐
│ Instrument Information Bar                              │
├────────────────────────────┬────────────────────────────┤
│                            │ Analytical Panels          │
│ Main Chart                 │ ┌────────────────────────┐ │
│ (Candlestick + Volume)     │ │ Market Structure       │ │
│                            │ ├────────────────────────┤ │
│                            │ │ Momentum               │ │
│                            │ ├────────────────────────┤ │
│                            │ │ Volatility             │ │
├────────────────────────────┼────────────────────────┤ │
│ Data Table                 │ Liquidity              │ │
└────────────────────────────┴────────────────────────────┘
```

---

## 4. INTERACTION PATTERNS

### 4.1 Navigation

- **Sidebar:** Persistent, collapsible on tablet/mobile
- **Breadcrumbs:** Show hierarchy for nested pages
- **Quick Switch:** Cmd+K for instrument search
- **Keyboard Shortcuts:** Document all shortcuts

### 4.2 Data Updates

- **Real-time:** Flash animation on price changes
- **Loading:** Skeleton screens, not spinners
- **Error:** Inline error messages, not alerts
- **Empty:** Helpful empty states with CTAs

### 4.3 Filtering & Search

- **Debounced:** 300ms delay for search inputs
- **Faceted:** Multiple filter dimensions
- **Persistent:** Remember filter state
- **Clear:** Easy to clear all filters

### 4.4 Charts

- **Tooltips:** Show on hover, not click
- **Crosshair:** Synchronized across charts
- **Zoom:** Mouse wheel + drag to zoom
- **Pan:** Click and drag to pan
- **Reset:** Double-click to reset view

---

## 5. DATA PRESENTATION STANDARDS

### 5.1 Numbers

- **Prices:** 2 decimal places (e.g., $1,234.56)
- **Percentages:** 2 decimal places (e.g., +1.23%)
- **Volumes:** Abbreviated (e.g., 1.2M, 456K)
- **Large numbers:** Thousand separators (e.g., 1,234,567)
- **Negative values:** Red color, minus sign (e.g., -1.23%)

### 5.2 Dates & Times

- **Dates:** YYYY-MM-DD format
- **Times:** HH:MM:SS (24-hour)
- **Timestamps:** ISO 8601 with timezone
- **Relative:** "2 hours ago", "yesterday"

### 5.3 Status Indicators

Always use multiple indicators:
- **Color:** Green/Red/Amber/Blue
- **Icon:** ✓ / ✗ / ⚠ / ℹ
- **Text:** "Active" / "Error" / "Warning" / "Info"
- **Badge:** Visual badge with status

### 5.4 Missing Data

Never show fake data. Use:
- `N/A` - Not applicable
- `NOT_CONFIGURED` - Not set up yet
- `DATA_UNAVAILABLE` - Data source issue
- `LOADING...` - Data being fetched

---

## 6. ACCESSIBILITY GUIDELINES

### 6.1 Color Contrast

- **Normal text:** 4.5:1 minimum contrast ratio
- **Large text:** 3:1 minimum contrast ratio
- **UI components:** 3:1 minimum contrast ratio

### 6.2 Keyboard Navigation

- **Tab order:** Logical, visible focus indicators
- **Shortcuts:** Document all keyboard shortcuts
- **Skip links:** Skip to main content
- **Escape:** Close modals/dropdowns

### 6.3 Screen Readers

- **ARIA labels:** All interactive elements
- **Live regions:** Announce dynamic updates
- **Alt text:** All images and icons
- **Headings:** Proper hierarchy (h1-h6)

### 6.4 Motion

- **Reduced motion:** Respect `prefers-reduced-motion`
- **Animations:** Purposeful, not decorative
- **Duration:** 200-300ms for transitions

---

## 7. RESPONSIVE DESIGN

### 7.1 Breakpoints

```css
/* Mobile */
@media (max-width: 767px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1279px) { }

/* Desktop */
@media (min-width: 1280px) { }

/* Large Desktop */
@media (min-width: 1920px) { }
```

### 7.2 Mobile Adaptations

- **Sidebar:** Bottom navigation or hamburger menu
- **Tables:** Horizontal scroll or card layout
- **Charts:** Simplified, touch-friendly
- **Forms:** Stacked layout, larger inputs

### 7.3 Tablet Adaptations

- **Sidebar:** Collapsible
- **Tables:** Responsive with horizontal scroll
- **Charts:** Full width, touch interactions
- **Forms:** Two-column where appropriate

---

## 8. PERFORMANCE GUIDELINES

### 8.1 Loading

- **Initial load:** < 3 seconds
- **Page transition:** < 500ms
- **Chart render:** < 500ms
- **Data fetch:** < 1 second

### 8.2 Optimization

- **Code splitting:** Lazy load routes
- **Image optimization:** WebP, lazy loading
- **Memoization:** React.memo, useMemo, useCallback
- **Virtualization:** Large lists and tables

### 8.3 Caching

- **API responses:** 5 minutes for market data
- **Static assets:** 1 year with cache busting
- **Service worker:** Offline support for critical features

---

## 9. TESTING STANDARDS

### 9.1 Unit Tests

- **Coverage:** 80% minimum
- **Components:** All interactive components
- **Utilities:** All helper functions
- **Hooks:** All custom hooks

### 9.2 Integration Tests

- **User flows:** Critical user journeys
- **API integration:** Mock API responses
- **State management:** Context and hooks

### 9.3 E2E Tests

- **Critical paths:** Login, navigation, data display
- **Cross-browser:** Chrome, Firefox, Safari
- **Responsive:** Desktop, tablet, mobile

### 9.4 Accessibility Tests

- **Automated:** axe-core, Lighthouse
- **Manual:** Keyboard navigation, screen reader
- **Contrast:** All text meets WCAG 2.1 AA

---

## 10. DOCUMENTATION STANDARDS

### 10.1 Component Documentation

Every component must have:
- **Description:** What it does
- **Props:** All props with types and descriptions
- **Examples:** Usage examples
- **Accessibility:** ARIA attributes, keyboard support

### 10.2 Code Documentation

- **JSDoc:** All functions and components
- **Comments:** Complex logic explained
- **README:** Project overview, setup, usage

### 10.3 Design Documentation

- **Design system:** This document
- **Component library:** Storybook or similar
- **Style guide:** Visual examples

---

**Design System Status:** ✅ ACTIVE  
**Version:** 1.0  
**Next Review:** Quarterly
