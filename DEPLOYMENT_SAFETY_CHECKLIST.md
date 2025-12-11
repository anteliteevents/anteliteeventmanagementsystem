# Deployment Safety Checklist

## ✅ Pre-Deployment Verification

### 1. Import Path Verification
- [x] All imports use relative paths within `src/` directory
- [x] No imports go outside `src/` (e.g., `../../../../`)
- [x] All component imports are correct
- [x] All CSS imports are correct
- [x] All constants imports are correct

### 2. File Structure Verification
- [x] All referenced files exist
- [x] All CSS files are in correct locations
- [x] All component files are in correct locations
- [x] All utility files are in correct locations

### 3. Import Path Rules

**Correct Import Patterns:**
```typescript
// From src/pages/admin/components/OverviewView.tsx
import { CHART_COLORS } from '../../../constants'; // ✅ Correct (3 levels up)

// From src/pages/admin/AdminDashboard.tsx
import { API_TIMEOUTS } from '../../constants'; // ✅ Correct (2 levels up)

// From src/components/admin/AdminSidebar.tsx
import { User } from '../../services/auth.service'; // ✅ Correct (2 levels up)

// From src/components/ui/SkeletonLoader.tsx
import './SkeletonLoader.css'; // ✅ Correct (same directory)
```

**Incorrect Import Patterns (Will Break Build):**
```typescript
// ❌ WRONG - Goes outside src/
import { CHART_COLORS } from '../../../../constants';

// ❌ WRONG - Absolute path outside src/
import { something } from '/constants';

// ❌ WRONG - Missing file extension when needed
import Component from './Component'; // Missing .tsx
```

### 4. Common Issues to Avoid

#### ❌ Import Path Issues
- **Problem:** Import paths that go outside `src/` directory
- **Solution:** Always count directory levels correctly
- **Example:** From `src/pages/admin/components/` to `src/constants.ts` = `../../../constants`

#### ❌ Missing Files
- **Problem:** Importing files that don't exist
- **Solution:** Verify file exists before importing
- **Check:** Use `glob_file_search` to verify file locations

#### ❌ CSS Import Issues
- **Problem:** CSS files not imported or wrong path
- **Solution:** Import CSS in component files or main entry point
- **Check:** Verify CSS file exists and path is correct

#### ❌ TypeScript Errors
- **Problem:** Type errors that prevent compilation
- **Solution:** Fix all TypeScript errors before committing
- **Check:** Run `npm run build` locally before pushing

### 5. File Locations Reference

```
frontend/src/
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminSidebar.css
│   │   └── AdminHeader.tsx
│   └── ui/
│       ├── SkeletonLoader.tsx
│       └── SkeletonLoader.css
├── pages/
│   └── admin/
│       ├── AdminDashboard.tsx
│       ├── AdminDashboard.css
│       ├── AdminDashboard.enhanced.css
│       ├── shared-components.css
│       └── components/
│           └── OverviewView.tsx
├── services/
│   ├── api.ts
│   └── auth.service.ts
└── constants.ts
```

### 6. Import Path Calculator

**From:** `src/pages/admin/components/OverviewView.tsx`
- To `src/constants.ts`: `../../../constants` (3 levels up)
- To `src/services/api.ts`: `../../../services/api` (3 levels up)
- To `src/components/ui/SkeletonLoader.tsx`: `../../../components/ui/SkeletonLoader` (3 levels up)

**From:** `src/pages/admin/AdminDashboard.tsx`
- To `src/constants.ts`: `../../constants` (2 levels up)
- To `src/components/admin/AdminSidebar.tsx`: `../../components/admin/AdminSidebar` (2 levels up)
- To `src/services/api.ts`: `../../services/api` (2 levels up)

**From:** `src/components/admin/AdminSidebar.tsx`
- To `src/services/auth.service.ts`: `../../services/auth.service` (2 levels up)
- To `src/constants.ts`: `../../constants` (2 levels up)

### 7. Pre-Commit Checklist

Before committing code changes:

- [ ] Run `npm run build` locally to verify build succeeds
- [ ] Check for TypeScript errors: `npx tsc --noEmit`
- [ ] Verify all imports are correct
- [ ] Verify all referenced files exist
- [ ] Check for console errors in browser
- [ ] Test the feature locally
- [ ] Verify no linting errors

### 8. Build Verification Commands

```bash
# Navigate to frontend directory
cd frontend

# Run build to check for errors
npm run build

# Check TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint  # if available
```

### 9. Common Build Errors & Solutions

#### Error: "Module not found: Error: You attempted to import ... which falls outside of the project src/ directory"
- **Cause:** Import path goes outside `src/` directory
- **Solution:** Count directory levels and fix import path
- **Example:** Change `../../../../constants` to `../../../constants`

#### Error: "Cannot find module './Component'"
- **Cause:** File doesn't exist or wrong path
- **Solution:** Verify file exists and path is correct
- **Check:** Use file explorer or `glob_file_search`

#### Error: "Cannot find name 'X'"
- **Cause:** Missing import or TypeScript error
- **Solution:** Add missing import or fix type definition

### 10. Safe Import Patterns

**Always use relative paths within src/:**
```typescript
// ✅ Good - Relative path
import { something } from '../../utils/helper';

// ✅ Good - Same directory
import './styles.css';

// ✅ Good - Parent directory
import { Component } from '../components/Component';

// ❌ Bad - Goes outside src/
import { something } from '../../../../constants';

// ❌ Bad - Absolute path
import { something } from '/src/constants';
```

### 11. Dependency Verification

**Always ensure dependencies are installed:**
```bash
# After adding new imports, verify dependencies
cd frontend
npm install

# Check if package is in package.json
grep "package-name" package.json

# Common dependencies that might be missing:
# - recharts (for charts)
# - axios (for API calls)
# - react-router-dom (for routing)
```

**Dependencies Currently Used:**
- ✅ `recharts` - For charts in OverviewView
- ✅ `axios` - For API calls
- ✅ `react-router-dom` - For routing
- ✅ All dependencies listed in `package.json`

### 12. Deployment Safety Rules

1. **Never import from outside `src/` directory**
2. **Always verify file exists before importing**
3. **Test build locally before pushing**
4. **Use relative paths, not absolute paths**
5. **Verify all CSS files are imported**
6. **Check for TypeScript errors**
7. **Verify all dependencies are in package.json AND installed**
8. **Run `npm install` after adding new dependencies**
9. **Commit `package.json` and `package-lock.json` together**

### 12. Quick Verification Script

Before pushing, verify:
```bash
# 1. Check build
cd frontend && npm run build

# 2. Check for import issues
grep -r "from.*\.\.\/\.\.\/\.\.\/\.\.\/" src/

# 3. Verify all imports are valid
# (Check manually or use TypeScript compiler)
```

---

**Last Updated:** December 2024  
**Status:** ✅ All current imports verified and correct

