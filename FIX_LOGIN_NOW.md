# Fix Login - Step by Step

**Status:** ❌ Getting 500 Error - Backend can't connect to database

---

## 🔍 Step 1: Check Render Logs (CRITICAL)

**Go to:** https://dashboard.render.com → Your Service → **Logs** tab

**Look for these errors:**

### Error 1: Password Authentication Failed
```
FATAL: password authentication failed for user "antelite_user"
```
**Fix:** Password in Render is wrong. Update `DB_PASSWORD` to `bkmgjAsoc6AmblMO`

### Error 2: Connection Refused
```
Error: connect ECONNREFUSED 217.15.163.29:5432
```
**Fix:** PostgreSQL not listening externally (but we fixed this, so unlikely)

### Error 3: Database Connection Error
```
Login error: Error: ...
```
**Fix:** Check the full error message - it will tell us exactly what's wrong

**Copy the exact error message from logs and share it!**

---

## ✅ Step 2: Verify Render Environment Variables

**Go to:** Render Dashboard → Environment tab

**Check these EXACTLY:**

### DB_PASSWORD
- **Must be:** `bkmgjAsoc6AmblMO`
- **NOT:** `ASDasd12345$$$%%%` (old password)
- **No quotes, no spaces**

### DATABASE_URL
- **Must be:** `postgresql://antelite_user:bkmgjAsoc6AmblMO@217.15.163.29:5432/antelite_events`
- **Password in URL must match:** `bkmgjAsoc6AmblMO`

### DB_HOST
- **Must be:** `217.15.163.29`
- **No spaces, no quotes**

### All Variables Should Be:
```
DB_HOST=217.15.163.29
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=antelite_user
DB_PASSWORD=bkmgjAsoc6AmblMO
DB_SSL=false
```

---

## 🔄 Step 3: Redeploy Backend (IMPORTANT!)

**After updating environment variables:**

1. **Go to:** Manual Deploy tab
2. **Click:** Deploy latest commit
3. **Wait:** For deployment to complete (~5 minutes)
4. **Check:** Logs tab for "✅ Database connected"

**⚠️ Changes only take effect after redeploy!**

---

## 🧪 Step 4: Test After Redeploy

**After redeploy, check logs for:**
```
🔌 Database Config: { host: '217.15.163.29', ... }
✅ Database connected
```

**If you see "✅ Database connected":**
- Database connection is working!
- Try login again

**If you still see errors:**
- Share the exact error message from logs

---

## 📋 Quick Checklist

- [ ] Checked Render logs for error message
- [ ] Verified `DB_PASSWORD` is `bkmgjAsoc6AmblMO` (not old password)
- [ ] Verified `DATABASE_URL` has correct password
- [ ] Saved all changes in Render
- [ ] Redeployed backend in Render
- [ ] Checked logs for "✅ Database connected"
- [ ] Tested login again

---

## 🎯 Most Common Issue

**99% of the time it's:**
- Wrong password in Render (`ASDasd12345$$$%%%` instead of `bkmgjAsoc6AmblMO`)
- OR backend not redeployed after updating variables

**Fix:**
1. Update `DB_PASSWORD` to `bkmgjAsoc6AmblMO`
2. Update `DATABASE_URL` password
3. **Redeploy backend**
4. Check logs

---

## 💡 What I Need From You

**To help you fix this, please share:**

1. **Render Logs Error Message:**
   - Go to Render → Logs tab
   - Copy the error message (especially any database connection errors)
   - Share it here

2. **Current DB_PASSWORD in Render:**
   - What value is currently set?
   - Is it `bkmgjAsoc6AmblMO` or `ASDasd12345$$$%%%`?

3. **Deployment Status:**
   - Did you redeploy after updating variables?
   - When was the last deployment?

---

**Status:** Waiting for Render logs to identify exact issue  
**Action:** Check Render logs and share the error message!

