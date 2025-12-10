# Render Environment Variables - EXACT FIX

## ❌ ERRORS FOUND

### Error 1: Wrong Password in DB_PASSWORD
- **Current:** `ASDasd12345$$$%%%` ❌
- **Should be:** `bkmgjAsoc6AmblMO` ✅

### Error 2: Wrong Password in DATABASE_URL
- **Current:** `postgresql://antelite_user:ASDasd12345$$$%%%@217.15.163.29:5432/antelite_events` ❌
- **Should be:** `postgresql://antelite_user:bkmgjAsoc6AmblMO@217.15.163.29:5432/antelite_events` ✅

### Error 3: Missing NODE_ENV
- **Add:** `NODE_ENV=production`

---

## ✅ CORRECTED VALUES (Copy These)

**Go to Render Dashboard → Your Service → Environment tab**

**Update/Add these variables:**

```
CORS_ORIGIN=https://anteliteeventssystem.vercel.app,https://anteliteeventssystem-2s8af5wgz-anteliteevents-projects.vercel.app,http://localhost:3000
DATABASE_URL=postgresql://antelite_user:bkmgjAsoc6AmblMO@217.15.163.29:5432/antelite_events
DB_HOST=217.15.163.29
DB_NAME=antelite_events
DB_PASSWORD=bkmgjAsoc6AmblMO
DB_PORT=5432
DB_SSL=false
DB_USER=antelite_user
JWT_SECRET=e1df7e2f1f41cee5ba0ff6b6170ec0daf766751e05447304654d0cfc2a618e7aa3ea517cfe8aba9b76b6881465220b9f4e813f19706a3346eb496aaa80162020
NODE_ENV=production
PORT=3001
```

---

## 🔧 Step-by-Step Fix

### 1. Update DB_PASSWORD
- Find: `DB_PASSWORD`
- Click: Edit
- Change value to: `bkmgjAsoc6AmblMO`
- Save

### 2. Update DATABASE_URL
- Find: `DATABASE_URL`
- Click: Edit
- Change value to: `postgresql://antelite_user:bkmgjAsoc6AmblMO@217.15.163.29:5432/antelite_events`
- Save

### 3. Add NODE_ENV (if missing)
- Click: "Add Environment Variable"
- Key: `NODE_ENV`
- Value: `production`
- Save

### 4. Save All Changes

### 5. Redeploy
- Go to: **Manual Deploy** tab
- Click: **Deploy latest commit**
- Wait: ~5 minutes

### 6. Check Logs
- Go to: **Logs** tab
- Look for: `✅ Database connected`
- Should NOT see: `password authentication failed`

---

## ✅ What's Correct (Don't Change)

These are already correct:
- ✅ `CORS_ORIGIN` - Correct
- ✅ `DB_HOST` - Correct
- ✅ `DB_NAME` - Correct
- ✅ `DB_PORT` - Correct
- ✅ `DB_SSL` - Correct
- ✅ `DB_USER` - Correct
- ✅ `JWT_SECRET` - Correct
- ✅ `PORT` - Correct

---

## 🎯 Summary

**Only 2 things to fix:**
1. `DB_PASSWORD`: `ASDasd12345$$$%%%` → `bkmgjAsoc6AmblMO`
2. `DATABASE_URL`: Change password in URL to `bkmgjAsoc6AmblMO`

**Optional:**
3. Add `NODE_ENV=production`

**Then redeploy and it will work!**

