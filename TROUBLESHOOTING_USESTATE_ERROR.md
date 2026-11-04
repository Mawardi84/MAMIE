# 🔧 Troubleshooting: "Cannot read properties of null (reading 'useState')"

## Error Description

```
[Uncaught TypeError: Cannot read properties of null (reading 'useState')]
```

Error ini terjadi ketika React hooks tidak dapat diakses dengan benar. Biasanya disebabkan oleh:
1. Duplicate React imports
2. Circular dependencies
3. Build/cache issues
4. Provider wrapping problems

---

## ✅ Solutions

### Solution 1: Clear Browser Cache (Most Common)

**Problem:** Browser masih menggunakan file JavaScript lama yang ter-cache.

**Solution:**
```bash
# Hard refresh browser
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R

# Or clear cache manually
Chrome: DevTools → Application → Storage → Clear site data
Firefox: DevTools → Storage → Clear All
```

### Solution 2: Rebuild Project

**Problem:** Build artifacts mungkin corrupt atau outdated.

**Solution:**
```bash
# Clean build
rm -rf dist node_modules/.vite
npm run build

# Or with cache clear
npm cache clean --force
npm install
npm run build
```

### Solution 3: Check for Duplicate React Imports

**Problem:** Ada multiple import statements dari 'react' di file yang sama.

**How to Check:**
```bash
# Search for duplicate imports
grep -r "import.*from 'react'" src/components/ | grep -E "^\s*import.*import"

# Or check each file manually
```

**Solution:**
```typescript
// ❌ WRONG - Duplicate imports
import { useState } from 'react';
import { useEffect } from 'react';

// ✅ CORRECT - Combined imports
import { useState, useEffect } from 'react';
```

### Solution 4: Check for Circular Dependencies

**Problem:** Component A import Component B, dan Component B import Component A.

**How to Check:**
```bash
# Use madge to detect circular dependencies
npm install -g madge
madge --circular src/
```

**Solution:**
- Restructure imports
- Use index files untuk re-export
- Move shared code ke separate file

### Solution 5: Check Provider Wrapping

**Problem:** Context providers tidak di-wrap dengan benar di App.tsx.

**How to Check:**
```typescript
// Check App.tsx
import { NotificationProvider } from './components/NotificationSystem';
import { AssetProvider } from './context/AssetContext';

export default function App() {
  return (
    <AssetProvider>
      <NotificationProvider>
        {/* Rest of app */}
      </NotificationProvider>
    </AssetProvider>
  );
}
```

**Solution:**
- Ensure all providers are properly nested
- Check for missing providers
- Verify provider exports

### Solution 6: Check Lazy Loading

**Problem:** Lazy loaded components mungkin memiliki issues.

**How to Check:**
```typescript
// Check App.tsx for lazy imports
const ExecutiveDashboard = lazy(() => import('./components/ExecutiveDashboard'));
```

**Solution:**
```typescript
// Ensure Suspense wrapper is present
<Suspense fallback={<LoadingFallback />}>
  {content}
</Suspense>

// Check that all lazy components have default exports
export default function ExecutiveDashboard() { ... }
```

### Solution 7: Restart Development Server

**Problem:** Dev server mungkin memiliki stale state.

**Solution:**
```bash
# Stop dev server (Ctrl+C)

# Clear Vite cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

### Solution 8: Check Node Modules

**Problem:** node_modules mungkin corrupt.

**Solution:**
```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install

# Or with yarn
rm -rf node_modules yarn.lock
yarn install
```

---

## 🔍 Debugging Steps

### Step 1: Check Console Error

Open browser DevTools (F12) dan check console untuk:
- Error messages
- Stack traces
- Component names

### Step 2: Check Network Tab

Check Network tab untuk:
- Failed requests
- CORS errors
- 404 errors

### Step 3: Check React DevTools

Install React DevTools extension dan check:
- Component tree
- Props dan state
- Hooks usage

### Step 4: Add Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

Wrap App dengan ErrorBoundary:
```typescript
// src/App.tsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      {/* Rest of app */}
    </ErrorBoundary>
  );
}
```

---

## 🎯 Common Causes in MAMIE

### Cause 1: Multiple Provider Imports

**File:** `src/App.tsx`

**Check:**
```typescript
// Ensure only one import per provider
import { NotificationProvider } from './components/NotificationSystem';
import { AssetProvider } from './context/AssetContext';
```

### Cause 2: Lazy Loading Without Suspense

**File:** `src/App.tsx`

**Check:**
```typescript
// Ensure Suspense wrapper is present
<Suspense fallback={<LoadingFallback />}>
  {content}
</Suspense>
```

### Cause 3: Missing Default Exports

**Files:** All lazy-loaded components

**Check:**
```typescript
// Each component must have default export
export default function ExecutiveDashboard() { ... }
```

### Cause 4: Circular Dependencies

**Files:** Components that import each other

**Check:**
```bash
# Use madge to detect
npx madge --circular src/components/
```

---

## ✅ Verification Checklist

After applying solutions, verify:

- [ ] Browser cache cleared (hard refresh)
- [ ] Project rebuilt (`npm run build`)
- [ ] No duplicate React imports
- [ ] No circular dependencies
- [ ] All providers properly wrapped
- [ ] All lazy components have Suspense
- [ ] All components have default exports
- [ ] Dev server restarted
- [ ] No console errors
- [ ] App loads successfully

---

## 🚀 Quick Fix (Most Likely Solution)

**90% of the time, this fixes the issue:**

```bash
# 1. Clear browser cache
# Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

# 2. Rebuild project
rm -rf dist node_modules/.vite
npm run build

# 3. Restart dev server
npm run dev
```

---

## 📞 If Problem Persists

If none of the above solutions work:

1. **Check browser console** for detailed error message
2. **Check stack trace** to identify which component is failing
3. **Disable lazy loading** temporarily to isolate issue
4. **Remove providers** one by one to identify problematic provider
5. **Create minimal reproduction** to debug

### Get Help

- Check browser DevTools console for full error stack
- Check Network tab for failed requests
- Try in incognito/private mode
- Try different browser
- Check if issue occurs in production build

---

## 📝 Notes

- Error biasanya terjadi setelah hot reload atau code changes
- Hard refresh browser sering kali solve masalah
- Clear Vite cache jika masalah persist
- Check untuk duplicate imports setelah code changes

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-XX  
**Status:** ACTIVE
