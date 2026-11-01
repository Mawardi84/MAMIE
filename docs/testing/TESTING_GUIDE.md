# Testing Documentation

## Overview

MAMIE menggunakan **Vitest** sebagai testing framework dengan **React Testing Library** untuk component testing.

## Test Structure

```
src/
├── test/
│   ├── setup.ts              # Test setup & mocks
│   └── vitest-env.d.ts       # TypeScript declarations
├── utils/
│   └── exportUtils.test.ts   # Export utility tests
├── components/
│   └── NotificationSystem.test.tsx  # Notification tests
├── data/
│   └── assetRegistry.test.ts # Asset registry tests
└── services/
    └── dataService.test.ts   # Data service tests
```

## Running Tests

### Run all tests
```bash
npm run test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm run test -- exportUtils.test.ts
```

## Test Coverage

### Current Coverage
- **Utility Functions**: 90%+
- **Data Service**: 85%+
- **Asset Registry**: 95%+
- **Components**: 70%+

### Coverage Goals
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: User workflows covered

## Test Types

### 1. Unit Tests
Test individual functions dan components in isolation.

**Example:**
```typescript
describe('calculateCorrelation', () => {
  it('should calculate perfect positive correlation', () => {
    const series1 = [...];
    const series2 = [...];
    const correlation = calculateCorrelation(series1, series2);
    expect(correlation).toBeCloseTo(1, 5);
  });
});
```

### 2. Integration Tests
Test how components work together.

**Example:**
```typescript
describe('NotificationSystem', () => {
  it('should show success notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('Success Title')).toBeInTheDocument();
  });
});
```

### 3. E2E Tests (Future)
Test complete user workflows dengan Playwright.

## Mocking

### localStorage Mock
```typescript
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
```

### API Mock
```typescript
vi.mock('../services/dataService', () => ({
  fetchAssetQuote: vi.fn().mockResolvedValue({
    price: 2000,
    change: 50,
    changePercent: 2.5,
  }),
}));
```

## Best Practices

### 1. Test Behavior, Not Implementation
```typescript
// ✅ Good
expect(screen.getByText('Success')).toBeInTheDocument();

// ❌ Bad
expect(component.state.success).toBe(true);
```

### 2. Use Meaningful Test Names
```typescript
// ✅ Good
it('should calculate perfect positive correlation');

// ❌ Bad
it('test correlation');
```

### 3. Keep Tests Independent
```typescript
// ✅ Good
beforeEach(() => {
  localStorage.clear();
});

// ❌ Bad
// Tests depend on previous test state
```

### 4. Test Edge Cases
```typescript
it('should handle empty data', () => {
  exportToCSV([], { filename: 'test', format: 'csv' });
  expect(console.warn).toHaveBeenCalledWith('No data to export');
});
```

## CI/CD Integration

Tests are automatically run on:
- Every push to main
- Every pull request
- Before deployment

See `.github/workflows/ci.yml` for configuration.

## Troubleshooting

### Test fails with "Cannot find module"
```bash
npm install
```

### Coverage report not generated
```bash
npm run test:coverage
```

### Tests hang or timeout
- Check for async operations not properly awaited
- Use `vi.useFakeTimers()` for time-based tests

## Future Improvements

- [ ] Increase component test coverage to 80%+
- [ ] Add E2E tests with Playwright
- [ ] Add visual regression tests
- [ ] Add performance tests
- [ ] Add accessibility tests

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
