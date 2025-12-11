# Integration Checklist - Backend, Frontend & Database

**IMPORTANT**: Every time updates or improvements are made, verify all three components work together seamlessly.

## ✅ Current Status (Verified)

### Backend
- ✅ **Build Status**: Compiles successfully
- ✅ **TypeScript**: No errors
- ✅ **Database Connection**: Configured with proper error handling
- ✅ **CORS**: Allowed origins include all frontend domains
- ✅ **API Endpoints**: All routes properly configured

### Frontend
- ✅ **Build Status**: Compiles successfully (minor warnings only)
- ✅ **API Connection**: Auto-detects backend URL (Vercel → Render, localhost → local)
- ✅ **Authentication**: JWT token handling via interceptors
- ✅ **Error Handling**: 401 redirects to login

### Database
- ✅ **Connection**: PostgreSQL on Contabo VPS
- ✅ **Configuration**: Environment variables properly set
- ✅ **SSL**: Configured for remote connections

---

## 🔍 Integration Points to Verify

### 1. **Frontend → Backend API Connection**

**Check:**
- [ ] Frontend `api.ts` correctly resolves backend URL
- [ ] Backend CORS includes all frontend domains
- [ ] API base URL matches backend deployment URL
- [ ] Authentication tokens are sent in headers

**Files:**
- `frontend/src/services/api.ts` - Frontend API configuration
- `backend/src/config/customOrigins.ts` - CORS allowed origins
- `backend/src/server.ts` - CORS middleware setup

**Environment Variables:**
- Frontend: `REACT_APP_API_URL` (optional, auto-detects)
- Backend: `CORS_ORIGIN` (comma-separated list)

### 2. **Backend → Database Connection**

**Check:**
- [ ] Database connection pool configured correctly
- [ ] Environment variables set (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
- [ ] SSL connection enabled for remote database
- [ ] Connection errors are logged properly

**Files:**
- `backend/src/config/database.ts` - Database pool configuration
- `backend/src/config/logger.ts` - Error logging

**Environment Variables:**
- `DB_HOST` - Database host (217.15.163.29)
- `DB_PORT` - Database port (5432)
- `DB_NAME` - Database name (antelite_events)
- `DB_USER` - Database user (antelite_user)
- `DB_PASSWORD` - Database password
- `DB_SSL` - SSL enabled (true/false)
- `DATABASE_URL` - Alternative connection string

### 3. **API Endpoints & Data Flow**

**Check:**
- [ ] All API routes are properly registered
- [ ] Request/response formats match between frontend and backend
- [ ] Error responses are handled consistently
- [ ] Authentication middleware is applied correctly

**Files:**
- `backend/src/server.ts` - Route registration
- `backend/src/routes/*.routes.ts` - Individual route definitions
- `frontend/src/services/*.service.ts` - Frontend service calls

### 4. **Type Safety**

**Check:**
- [ ] TypeScript types match between frontend and backend
- [ ] API response types are consistent
- [ ] No `any` types in critical paths (except error handling)

**Files:**
- `backend/src/types/index.ts` - Backend types
- `frontend/src/types/index.ts` - Frontend types

---

## 🚀 Deployment Checklist

### Before Deploying Backend (Render)

1. **Verify Build**
   ```bash
   cd backend
   npm run build
   ```
   - [ ] No TypeScript errors
   - [ ] No build failures

2. **Check Environment Variables**
   - [ ] `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   - [ ] `DATABASE_URL` (if using connection string)
   - [ ] `JWT_SECRET`
   - [ ] `CORS_ORIGIN` (includes all frontend domains)
   - [ ] `NODE_ENV=production`
   - [ ] `PORT=3001` (or Render's assigned port)

3. **Verify CORS Configuration**
   - [ ] All Vercel domains included
   - [ ] Custom domain included (if applicable)
   - [ ] Localhost included for development

### Before Deploying Frontend (Vercel)

1. **Verify Build**
   ```bash
   cd frontend
   npm run build
   ```
   - [ ] No build errors
   - [ ] Warnings are acceptable (non-breaking)

2. **Check Environment Variables**
   - [ ] `REACT_APP_API_URL` set to backend URL (optional, auto-detects)
   - [ ] Production: `https://anteliteeventssystem.onrender.com`
   - [ ] Development: `http://localhost:3001`

3. **Verify Vercel Configuration**
   - [ ] Root Directory: `frontend`
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `build`

### Database Verification

1. **Connection Test**
   ```bash
   PGPASSWORD='password' psql -h 217.15.163.29 -U antelite_user -d antelite_events -c 'SELECT 1;'
   ```
   - [ ] Connection successful

2. **Schema Verification**
   - [ ] All tables exist
   - [ ] Foreign keys are correct
   - [ ] Indexes are created

3. **Data Verification**
   - [ ] Seed data loaded (if applicable)
   - [ ] Test queries return expected results

---

## 🔧 Common Integration Issues & Fixes

### Issue: Frontend can't connect to backend
**Symptoms:** CORS errors, network errors, 404s

**Fixes:**
1. Check `CORS_ORIGIN` in backend includes frontend domain
2. Verify `REACT_APP_API_URL` in frontend matches backend URL
3. Check backend is running and accessible
4. Verify API routes are registered correctly

### Issue: Backend can't connect to database
**Symptoms:** 500 errors, "ECONNREFUSED", authentication errors

**Fixes:**
1. Verify database environment variables are correct
2. Check PostgreSQL is listening on correct address (`listen_addresses = '*'`)
3. Verify `pg_hba.conf` allows remote connections
4. Check firewall rules allow port 5432
5. Test connection manually with `psql`

### Issue: Type mismatches between frontend and backend
**Symptoms:** TypeScript errors, runtime errors, data not displaying

**Fixes:**
1. Ensure types in `frontend/src/types/index.ts` match backend
2. Check API response format matches expected structure
3. Verify field names match (camelCase vs snake_case)
4. Update types if API contracts change

### Issue: Authentication not working
**Symptoms:** 401 errors, redirect loops, tokens not sent

**Fixes:**
1. Verify JWT_SECRET is set in backend
2. Check token is stored in localStorage
3. Verify Authorization header is added in API interceptor
4. Check token expiration handling

---

## 📋 Quick Verification Commands

### Backend
```bash
# Build check
cd backend && npm run build

# Type check
cd backend && npx tsc --noEmit

# Test database connection (if test script exists)
cd backend && npm run test:db
```

### Frontend
```bash
# Build check
cd frontend && npm run build

# Type check
cd frontend && npx tsc --noEmit

# Lint check
cd frontend && npm run lint
```

### Database
```bash
# Connection test
PGPASSWORD='password' psql -h 217.15.163.29 -U antelite_user -d antelite_events -c 'SELECT version();'

# Table count
PGPASSWORD='password' psql -h 217.15.163.29 -U antelite_user -d antelite_events -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
```

---

## 🎯 Integration Testing Workflow

When making updates:

1. **Backend Changes**
   - [ ] Update backend code
   - [ ] Run `npm run build` - verify no errors
   - [ ] Test database connection still works
   - [ ] Update types if API contracts change
   - [ ] Deploy to Render
   - [ ] Verify backend health endpoint responds

2. **Frontend Changes**
   - [ ] Update frontend code
   - [ ] Run `npm run build` - verify no errors
   - [ ] Update API calls if backend changed
   - [ ] Update types if backend types changed
   - [ ] Test API connection to backend
   - [ ] Deploy to Vercel
   - [ ] Verify frontend loads and connects to backend

3. **Database Changes**
   - [ ] Create migration script
   - [ ] Test migration on local/staging database
   - [ ] Backup production database
   - [ ] Run migration on production
   - [ ] Verify backend can connect
   - [ ] Test queries return expected results

4. **Full Integration Test**
   - [ ] Login works (frontend → backend → database)
   - [ ] Data loads correctly (database → backend → frontend)
   - [ ] CRUD operations work end-to-end
   - [ ] Error handling works correctly
   - [ ] Real-time updates work (if applicable)

---

## 📝 Notes

- **Always test locally first** before deploying
- **Check build outputs** for both frontend and backend
- **Verify environment variables** are set correctly in deployment platforms
- **Monitor logs** after deployment for connection errors
- **Keep types synchronized** between frontend and backend
- **Document breaking changes** to API contracts

---

**Last Updated:** December 2024  
**Status:** ✅ All systems verified and working

