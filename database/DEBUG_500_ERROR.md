# Debugging 500 Internal Server Error on Login

**Error:** `POST https://anteliteeventssystem.onrender.com/api/auth/login 500 (Internal Server Error)`

**Status:** Backend route found, but server error occurring

---

## Problem Analysis

The 500 error means:
- ✅ Route is found (not 404)
- ✅ Frontend is calling correct URL
- ❌ Backend is crashing (likely database connection)

---

## Immediate Diagnostic Steps

### Step 1: Check Render Logs

**Go to:** Render Dashboard → Your Service → Logs

**Look for:**
- Database connection errors
- "Failed to login" errors
- Any stack traces
- Database connection attempts

**Common errors you might see:**
```
❌ Error: connect ECONNREFUSED 217.15.163.29:5432
❌ Error: password authentication failed
❌ Error: database "antelite_events" does not exist
❌ Login error: [stack trace]
```

### Step 2: Verify Database Connection

**Test from your local machine:**
```bash
PGPASSWORD='bkmgjAsoc6AmblMO' psql -h 217.15.163.29 -U antelite_user -d antelite_events -c 'SELECT current_user;'
```

**If this fails:**
- PostgreSQL not listening externally
- Firewall blocking
- Wrong credentials

### Step 3: Check Render Environment Variables

**Verify in Render Dashboard:**
- `DB_HOST=217.15.163.29` (exactly, no spaces)
- `DB_PASSWORD=bkmgjAsoc6AmblMO` (exactly, no quotes)
- `DB_USER=antelite_user`
- `DB_NAME=antelite_events`
- `DB_SSL=false`

---

## Most Likely Causes

### Cause 1: PostgreSQL Not Listening Externally

**Symptom:** `ECONNREFUSED` error in logs

**Fix:**
```bash
ssh root@217.15.163.29
# Edit postgresql.conf
nano /etc/postgresql/15/main/postgresql.conf
# Change: listen_addresses = '*'
systemctl restart postgresql
```

### Cause 2: Render Environment Variables Wrong

**Symptom:** Authentication failed or connection refused

**Fix:**
- Double-check all environment variables in Render
- Ensure no extra spaces or quotes
- Redeploy after updating

### Cause 3: Database User/Password Wrong

**Symptom:** `password authentication failed`

**Fix:**
- Verify password: `bkmgjAsoc6AmblMO`
- Check user exists: `sudo -u postgres psql -c "\du antelite_user"`

---

## Quick Fix Checklist

1. [ ] Check Render logs for specific error
2. [ ] Verify PostgreSQL listening on `0.0.0.0:5432`
3. [ ] Test database connection from external network
4. [ ] Verify Render environment variables
5. [ ] Redeploy backend after fixing

---

**Next:** Check Render logs and share the specific error message!

