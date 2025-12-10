# Quick Fix for 500 Error on Login

**Error:** `POST /api/auth/login 500 (Internal Server Error)`

This means the backend is crashing when trying to login. **Most likely cause: Database connection failure.**

---

## 🔍 Step 1: Check Render Logs (CRITICAL)

**Go to:** https://dashboard.render.com → Your Service → **Logs** tab

**Look for these errors:**
- `Error: connect ECONNREFUSED 217.15.163.29:5432` → PostgreSQL not listening externally
- `FATAL: password authentication failed` → Wrong password
- `database "antelite_events" does not exist` → Database name wrong
- `Login error:` → Check the full error message

**Copy the exact error message and share it!**

---

## 🔧 Step 2: Fix PostgreSQL (If Connection Refused)

**SSH to server:**
```bash
ssh root@217.15.163.29
```

**Check if listening externally:**
```bash
ss -tlnp | grep :5432
```

**If you see only `127.0.0.1:5432` (not `0.0.0.0:5432`):**

```bash
# Edit config
nano /etc/postgresql/15/main/postgresql.conf

# Find and change:
# FROM: #listen_addresses = 'localhost'
# TO:   listen_addresses = '*'

# Save: Ctrl+X, Y, Enter

# Restart
systemctl restart postgresql

# Verify
ss -tlnp | grep :5432
# Should now show: 0.0.0.0:5432
```

---

## ✅ Step 3: Verify Render Environment Variables

**Go to:** Render Dashboard → Environment tab

**Verify these EXACT values (no spaces, no quotes):**
```
DB_HOST=217.15.163.29
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=antelite_user
DB_PASSWORD=bkmgjAsoc6AmblMO
DB_SSL=false
```

**Common mistakes:**
- ❌ `DB_HOST = 217.15.163.29` (spaces around =)
- ❌ `DB_PASSWORD='bkmgjAsoc6AmblMO'` (quotes)
- ❌ `DB_HOST=217.15.163.29 ` (trailing space)

**After updating:**
1. Click **Save Changes**
2. Go to **Manual Deploy** tab
3. Click **Deploy latest commit**
4. Wait for deployment

---

## 🧪 Step 4: Test Database Connection

**From your local machine:**
```bash
PGPASSWORD='bkmgjAsoc6AmblMO' psql -h 217.15.163.29 -U antelite_user -d antelite_events -c 'SELECT current_user;'
```

**If this fails:**
- PostgreSQL not listening externally → Fix Step 2
- Wrong password → Check password in database
- Connection timeout → Check firewall

**If this succeeds:**
- Database is accessible
- Problem is in Render configuration
- Check Render logs for specific error

---

## 📋 Most Common Issues

### Issue 1: PostgreSQL Not Listening Externally
**Error in logs:** `ECONNREFUSED`
**Fix:** Run Step 2 above

### Issue 2: Wrong Password in Render
**Error in logs:** `password authentication failed`
**Fix:** 
- Verify password: `bkmgjAsoc6AmblMO`
- Check for typos in Render
- No quotes around password

### Issue 3: Database Name Wrong
**Error in logs:** `database does not exist`
**Fix:** Verify `DB_NAME=antelite_events` (exactly)

---

## 🚀 Quick Action Plan

1. **Check Render Logs** → Get exact error message
2. **Test Database Connection** → Verify it works from external
3. **Fix PostgreSQL** → If not listening externally
4. **Verify Render Env Vars** → Check all values
5. **Redeploy Backend** → After fixing

---

## 💡 What to Share

After checking Render logs, share:
1. The exact error message from logs
2. Result of database connection test
3. What `ss -tlnp | grep :5432` shows

This will help pinpoint the exact issue!

---

**Priority:** Check Render logs first - that will tell us exactly what's wrong!

