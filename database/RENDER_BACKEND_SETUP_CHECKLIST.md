# Render Backend Database Setup Checklist
## Quick Reference Guide for Render.com Configuration

**Date:** December 2024  
**Status:** ✅ Server Ready - ⚠️ Render Configuration Required

---

## ✅ Server Status (Verified)

- ✅ **PostgreSQL:** Running and configured
- ✅ **Firewall:** Port 5432 allowed (IPv4 & IPv6)
- ✅ **Database:** `antelite_events` exists
- ✅ **User:** `antelite_user` created with permissions
- ✅ **Authentication:** Configured for remote access

---

## 🔧 Required Render Environment Variables

**Copy and paste these into Render Dashboard → Your Service → Environment:**

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
```

---

## 📋 Step-by-Step Render Configuration

### Step 1: Access Render Dashboard
1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Log in to your account
3. Select your backend service

### Step 2: Update Environment Variables
1. Click on **Environment** tab (left sidebar)
2. Click **Add Environment Variable** for each variable above
3. **OR** click **Edit** if variables already exist
4. **IMPORTANT:** Remove or update old Supabase variables:
   - Remove `DATABASE_URL` (if pointing to Supabase)
   - Update `DB_HOST` if it points to Supabase

### Step 3: Save and Redeploy
1. Click **Save Changes**
2. Go to **Events** or **Manual Deploy** tab
3. Click **Deploy latest commit** or trigger a new deployment
4. Wait for deployment to complete

### Step 4: Verify Connection
1. Go to **Logs** tab
2. Look for these messages:
   ```
   🔌 Database Config: { host: '217.15.163.29', ... }
   ✅ Database connected
   ```
3. If you see connection errors, check the troubleshooting section

---

## ✅ Verification Checklist

After updating Render, verify:

- [ ] All environment variables are set correctly
- [ ] Old Supabase variables removed/updated
- [ ] Service redeployed successfully
- [ ] Logs show "✅ Database connected"
- [ ] No connection errors in logs
- [ ] Login endpoint works: `POST /api/auth/login`
- [ ] Can retrieve data from database

---

## 🐛 Troubleshooting

### Issue: Connection Refused

**Error in Render logs:**
```
Error: connect ECONNREFUSED 217.15.163.29:5432
```

**Solution:**
1. Verify firewall allows port 5432 (✅ Already done)
2. Check PostgreSQL is running (✅ Verified)
3. Verify `DB_HOST` is exactly `217.15.163.29` (no spaces)
4. Check if Contabo has additional firewall/security groups

### Issue: Authentication Failed

**Error in Render logs:**
```
FATAL: password authentication failed for user "antelite_user"
```

**Solution:**
1. Verify `DB_PASSWORD` is exactly: `bkmgjAsoc6AmblMO`
2. Check for extra spaces or quotes in Render environment
3. Verify `DB_USER` is exactly: `antelite_user`

### Issue: Database Not Found

**Error in Render logs:**
```
database "antelite_events" does not exist
```

**Solution:**
1. Verify `DB_NAME` is exactly: `antelite_events`
2. Check database exists on server (✅ Verified)

---

## 🔍 Testing Connection

### Test from Your Local Machine

```bash
# Install PostgreSQL client if needed
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: apt install postgresql-client

# Test connection
PGPASSWORD='bkmgjAsoc6AmblMO' psql -h 217.15.163.29 -U antelite_user -d antelite_events -c 'SELECT version();'
```

**Expected Output:**
```
PostgreSQL 15.x on x86_64...
(1 row)
```

### Test API Endpoint

After Render deployment, test login:

```bash
curl -X POST https://anteliteeventssystem.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@antelite.digital","password":"Admin@03071994$$"}'
```

**Expected Response:**
```json
{
  "token": "...",
  "user": { ... }
}
```

---

## 📊 Current Configuration Summary

| Item | Value | Status |
|------|-------|--------|
| Database Host | 217.15.163.29 | ✅ Ready |
| Database Port | 5432 | ✅ Open |
| Database Name | antelite_events | ✅ Exists |
| Database User | antelite_user | ✅ Created |
| Database Password | bkmgjAsoc6AmblMO | ✅ Set |
| SSL Required | false | ✅ Configured |
| Firewall | Port 5432 allowed | ✅ Configured |
| PostgreSQL | Running | ✅ Active |
| Render Config | Needs update | ⚠️ Action Required |

---

## 🚀 Next Steps

1. **✅ Update Render Environment Variables** (Do this now!)
2. **✅ Redeploy Backend Service**
3. **✅ Check Render Logs** for connection success
4. **✅ Test Login Functionality**
5. **✅ Verify All API Endpoints Work**

---

## 📞 Support

If issues persist after following this checklist:

1. Check Render service logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test connection from local machine (see above)
4. Check PostgreSQL server logs: `ssh root@217.15.163.29 "tail -f /var/log/postgresql/*.log"`

---

**Last Updated:** December 2024  
**Status:** Server Ready - Awaiting Render Configuration Update

