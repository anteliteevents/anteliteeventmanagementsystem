# Complete Setup Guide - Fix Everything
## Make Backend, Database, and Frontend Work Together

**Date:** December 2024  
**Status:** 🔧 Step-by-Step Fix Guide

---

## Overview

This guide will fix all issues to make the entire system work:
1. ✅ Fix PostgreSQL external access
2. ✅ Update Render backend environment variables
3. ✅ Set Vercel frontend environment variables
4. ✅ Verify all connections
5. ✅ Test login functionality

---

## Step 1: Fix PostgreSQL External Access

### On Your Contabo Server (SSH)

**Option A: Run the script (Recommended)**

```bash
# Upload and run the fix script
scp database/fix-postgresql-external-access.sh root@217.15.163.29:/tmp/
ssh root@217.15.163.29 "chmod +x /tmp/fix-postgresql-external-access.sh && /tmp/fix-postgresql-external-access.sh"
```

**Option B: Manual fix**

```bash
ssh root@217.15.163.29

# Find config file
find /etc/postgresql -name postgresql.conf

# Edit the file (replace X with your PostgreSQL version)
nano /etc/postgresql/15/main/postgresql.conf
# Or: vi /etc/postgresql/15/main/postgresql.conf

# Find and change:
# FROM: #listen_addresses = 'localhost'
# TO:   listen_addresses = '*'

# Save and exit (Ctrl+X, Y, Enter for nano)

# Restart PostgreSQL
systemctl restart postgresql

# Verify
ss -tlnp | grep :5432
# Should show: 0.0.0.0:5432 (not just 127.0.0.1:5432)

# Test connection
PGPASSWORD='bkmgjAsoc6AmblMO' psql -h 217.15.163.29 -U antelite_user -d antelite_events -c 'SELECT current_user;'
```

**Expected Result:**
- PostgreSQL listening on `0.0.0.0:5432`
- Connection test succeeds

---

## Step 2: Update Render Backend Environment Variables

### Go to Render Dashboard

1. **Login:** https://dashboard.render.com
2. **Select:** Your backend service
3. **Go to:** Environment tab
4. **Add/Update these variables:**

```env
DB_HOST=217.15.163.29
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=antelite_user
DB_PASSWORD=bkmgjAsoc6AmblMO
DB_SSL=false
JWT_SECRET=e1df7e2f1f41cee5ba0ff6b6170ec0daf766751e05447304654d0cfc2a618e7aa3ea517cfe8aba9b76b6881465220b9f4e813f19706a3346eb496aaa80162020
CORS_ORIGIN=https://anteliteeventssystem.vercel.app,https://anteliteeventssystem-2s8af5wgz-anteliteevents-projects.vercel.app,http://localhost:3000
PORT=3001
NODE_ENV=production
```

5. **Remove old Supabase variables:**
   - Delete `DATABASE_URL` if it points to Supabase
   - Update `DB_HOST` if it's still pointing to Supabase

6. **Save Changes**

7. **Redeploy:**
   - Go to **Manual Deploy** tab
   - Click **Deploy latest commit**
   - Wait for deployment to complete

### Verify Backend Connection

**Check Render Logs:**
- Go to **Logs** tab
- Look for:
  ```
  🔌 Database Config: { host: '217.15.163.29', ... }
  ✅ Database connected
  ```

**Test Backend Health:**
```bash
curl https://anteliteeventssystem.onrender.com/health
```

**Test Login Endpoint:**
```bash
curl -X POST https://anteliteeventssystem.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin88759551@antelite.digital","password":"94lUYIQ1csnXs1x"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "...",
    "user": {...}
  }
}
```

---

## Step 3: Set Vercel Frontend Environment Variables

### Go to Vercel Dashboard

1. **Login:** https://vercel.com/dashboard
2. **Select:** Your project (`anteliteeventssystem`)
3. **Go to:** Settings → Environment Variables
4. **Add/Update:**

```env
REACT_APP_API_URL=https://anteliteeventssystem.onrender.com
REACT_APP_SOCKET_URL=https://anteliteeventssystem.onrender.com
```

5. **Save Changes**

6. **Redeploy:**
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete

### Verify Frontend Configuration

**After redeploy, check:**
1. Open https://anteliteeventssystem.vercel.app
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Check Network tab when logging in
5. Verify request goes to: `https://anteliteeventssystem.onrender.com/api/auth/login`

---

## Step 4: Test End-to-End

### Test Login

1. **Go to:** https://anteliteeventssystem.vercel.app/login
2. **Enter credentials:**
   - Email: `admin88759551@antelite.digital`
   - Password: `94lUYIQ1csnXs1x`
3. **Click Login**

**Expected Result:**
- ✅ Login succeeds
- ✅ Redirects to dashboard
- ✅ No errors in console

**If errors:**
- Check browser console (F12) for errors
- Check Network tab for failed requests
- Check Render logs for backend errors

---

## Step 5: Verification Checklist

### Database ✅
- [ ] PostgreSQL listening on `0.0.0.0:5432`
- [ ] Can connect from external network
- [ ] Database `antelite_events` exists
- [ ] User `antelite_user` exists with correct password

### Backend ✅
- [ ] Render environment variables updated
- [ ] Backend service redeployed
- [ ] Logs show "✅ Database connected"
- [ ] Health endpoint returns OK
- [ ] Login endpoint works (tested with curl)

### Frontend ✅
- [ ] Vercel environment variables set
- [ ] Frontend redeployed
- [ ] API calls go to correct backend URL
- [ ] Login page loads
- [ ] Login functionality works

---

## Troubleshooting

### Issue: Still Getting "Route not found"

**Check:**
1. Backend logs - is route registered?
2. Frontend Network tab - what URL is being called?
3. Test backend directly with curl

**Fix:**
- Verify `REACT_APP_API_URL` is set in Vercel
- Check Render logs for route registration
- Ensure backend code is deployed

### Issue: Database Connection Failed

**Check:**
1. PostgreSQL listening on `0.0.0.0:5432`
2. Firewall allows port 5432
3. Render environment variables correct

**Fix:**
- Run PostgreSQL fix script
- Verify firewall: `ufw status | grep 5432`
- Check Render `DB_HOST` is `217.15.163.29`

### Issue: CORS Error

**Check:**
1. Frontend URL in Render `CORS_ORIGIN`
2. Backend CORS configuration

**Fix:**
- Add frontend URL to Render `CORS_ORIGIN`
- Redeploy backend

---

## Quick Reference

### Database Credentials
```
Host: 217.15.163.29
Port: 5432
Database: antelite_events
User: antelite_user
Password: bkmgjAsoc6AmblMO
```

### Admin Login
```
Email: admin88759551@antelite.digital
Password: 94lUYIQ1csnXs1x
```

### URLs
- Frontend: https://anteliteeventssystem.vercel.app
- Backend: https://anteliteeventssystem.onrender.com
- Database: 217.15.163.29:5432

---

## Summary

After completing all steps:

1. ✅ **Database:** Accessible from Render
2. ✅ **Backend:** Connected to database, routes working
3. ✅ **Frontend:** Connected to backend, login working
4. ✅ **System:** Fully operational

**Total Time:** ~30-45 minutes

---

**Guide Created:** December 2024  
**Status:** Ready to Execute  
**Priority:** HIGH - Complete System Fix

