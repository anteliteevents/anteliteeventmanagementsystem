# Deployment Integration Guide

## Quick Reference: Ensuring Backend, Frontend & Database Work Together

### 🎯 Golden Rule
**Every update must verify:**
1. ✅ Backend builds and deploys successfully
2. ✅ Frontend builds and deploys successfully  
3. ✅ Database connection works from backend
4. ✅ Frontend can communicate with backend
5. ✅ All three work together end-to-end

---

## 🔄 Standard Update Workflow

### Step 1: Make Changes
- Update code in backend, frontend, or both
- Update database schema if needed

### Step 2: Local Verification
```bash
# Backend
cd backend
npm run build          # Must pass
npm start              # Test locally

# Frontend  
cd frontend
npm run build          # Must pass
npm start              # Test locally

# Test Integration
# - Login works
# - Data loads
# - API calls succeed
```

### Step 3: Check Integration Points

#### Frontend → Backend
- [ ] `frontend/src/services/api.ts` - API URL correct
- [ ] `backend/src/config/customOrigins.ts` - Frontend domain included
- [ ] Backend CORS middleware configured

#### Backend → Database
- [ ] `backend/src/config/database.ts` - Connection config correct
- [ ] Environment variables set (DB_HOST, DB_PORT, etc.)
- [ ] Database accessible from backend server

### Step 4: Deploy Backend (Render)
1. Push to GitHub
2. Verify Render build succeeds
3. Check Render logs for errors
4. Test backend health endpoint

### Step 5: Deploy Frontend (Vercel)
1. Push to GitHub
2. Verify Vercel build succeeds
3. Check Vercel logs for errors
4. Test frontend loads

### Step 6: End-to-End Test
1. Open frontend in browser
2. Login
3. Navigate through features
4. Verify data loads correctly
5. Test key operations (create, read, update, delete)

---

## 🚨 Critical Integration Points

### 1. API URL Resolution
**Frontend** (`frontend/src/services/api.ts`):
```typescript
// Auto-detects:
// - Vercel → https://anteliteeventssystem.onrender.com
// - Localhost → http://localhost:3001
// - Or uses REACT_APP_API_URL if set
```

**Backend** (`backend/src/config/customOrigins.ts`):
```typescript
// Must include ALL frontend domains:
// - https://anteliteeventssystem.vercel.app
// - https://anteliteeventmanagementsystem.vercel.app
// - https://eventsystem.antelite.digital
// - http://localhost:3000
```

### 2. Database Connection
**Backend** (`backend/src/config/database.ts`):
```typescript
// Uses environment variables:
// - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
// - Or DATABASE_URL connection string
// - SSL enabled for remote connections
```

**Render Environment Variables:**
```
DB_HOST=217.15.163.29
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=antelite_user
DB_PASSWORD=bkmgjAsoc6AmblMO
DB_SSL=true
CORS_ORIGIN=https://anteliteeventssystem.vercel.app,https://anteliteeventmanagementsystem.vercel.app,https://eventsystem.antelite.digital,http://localhost:3000
JWT_SECRET=your-secret
NODE_ENV=production
PORT=3001
```

### 3. Authentication Flow
1. Frontend: User logs in → POST `/api/auth/login`
2. Backend: Validates credentials → Returns JWT token
3. Frontend: Stores token in localStorage
4. Frontend: Adds token to all API requests via interceptor
5. Backend: Validates token on protected routes

---

## ✅ Pre-Deployment Checklist

### Backend
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] All environment variables set in Render
- [ ] CORS includes all frontend domains
- [ ] Database connection tested
- [ ] Health endpoint responds

### Frontend
- [ ] `npm run build` succeeds
- [ ] No build errors (warnings OK)
- [ ] `REACT_APP_API_URL` set in Vercel (optional)
- [ ] API service correctly configured
- [ ] All imports resolve correctly

### Database
- [ ] PostgreSQL running
- [ ] Database accessible from Render
- [ ] All tables exist
- [ ] Migrations applied (if any)
- [ ] Seed data loaded (if needed)

---

## 🔍 Post-Deployment Verification

### Backend Health Check
```bash
curl https://anteliteeventssystem.onrender.com/health
# Should return: {"status":"ok"}
```

### Frontend Load Check
1. Open frontend URL
2. Check browser console for errors
3. Verify API calls are made to correct backend
4. Test login functionality

### Integration Test
1. Login → Should work
2. Load dashboard → Should show data
3. Navigate features → Should load correctly
4. Check network tab → API calls should succeed

---

## 🐛 Troubleshooting Integration Issues

### Frontend shows "Network Error"
- Check backend is running
- Verify CORS configuration
- Check API URL in frontend
- Verify backend URL is accessible

### Backend shows "Database Connection Error"
- Check database environment variables
- Verify PostgreSQL is running
- Check firewall rules
- Test connection manually with `psql`

### "CORS Error" in browser
- Add frontend domain to `CORS_ORIGIN` in backend
- Redeploy backend
- Clear browser cache

### Data not loading
- Check backend logs for errors
- Verify database has data
- Check API endpoint responses
- Verify frontend is calling correct endpoints

---

## 📚 Key Files Reference

### Frontend
- `frontend/src/services/api.ts` - API configuration
- `frontend/src/services/auth.service.ts` - Authentication
- `frontend/src/types/index.ts` - Type definitions

### Backend
- `backend/src/config/database.ts` - Database connection
- `backend/src/config/customOrigins.ts` - CORS configuration
- `backend/src/server.ts` - Main server setup
- `backend/src/types/index.ts` - Type definitions

### Database
- `database/schema.sql` - Main schema
- `database/module-tables.sql` - Additional tables
- `database/complete-features-seeds.sql` - Demo data

---

**Remember:** Always verify all three components work together after any update!

