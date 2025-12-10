# Fix 500 Error - Do This Now!

**Problem:** PostgreSQL is only listening on localhost, so Render can't connect.

**Solution:** Fix PostgreSQL to listen on all interfaces.

---

## 🚀 Quick Fix (5 minutes)

### Option 1: Run Script on Server

**SSH to server:**
```bash
ssh root@217.15.163.29
```

**Copy and paste this entire block:**
```bash
CONF_FILE=$(find /etc/postgresql -name postgresql.conf -type f | head -1)
echo "Config: $CONF_FILE"
sed -i "s/^#listen_addresses = 'localhost'/listen_addresses = '*'/" "$CONF_FILE"
sed -i "s/^listen_addresses = 'localhost'/listen_addresses = '*'/" "$CONF_FILE"
grep "^listen_addresses" "$CONF_FILE" | grep -v "^#"
systemctl restart postgresql
sleep 3
ss -tlnp | grep :5432
```

**Expected output:**
- Should show `0.0.0.0:5432` (not just `127.0.0.1:5432`)

---

### Option 2: Manual Edit

**SSH to server:**
```bash
ssh root@217.15.163.29
```

**Find config file:**
```bash
find /etc/postgresql -name postgresql.conf
# Example: /etc/postgresql/15/main/postgresql.conf
```

**Edit file:**
```bash
nano /etc/postgresql/15/main/postgresql.conf
```

**Find this line (around line 60):**
```
#listen_addresses = 'localhost'
```

**Change to:**
```
listen_addresses = '*'
```

**Save:** Ctrl+X, then Y, then Enter

**Restart:**
```bash
systemctl restart postgresql
```

**Verify:**
```bash
ss -tlnp | grep :5432
# Should show: 0.0.0.0:5432
```

---

## ✅ After Fixing PostgreSQL

### 1. Test Connection
```bash
PGPASSWORD='bkmgjAsoc6AmblMO' psql -h 217.15.163.29 -U antelite_user -d antelite_events -c 'SELECT current_user;'
```

**Should succeed!**

### 2. Verify Render Environment Variables

**Go to:** Render Dashboard → Environment

**Check these are set correctly:**
```
DB_HOST=217.15.163.29
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=antelite_user
DB_PASSWORD=bkmgjAsoc6AmblMO
DB_SSL=false
```

### 3. Redeploy Backend

**In Render:**
1. Go to **Manual Deploy** tab
2. Click **Deploy latest commit**
3. Wait for deployment

### 4. Check Logs

**After redeploy, check Render logs:**
- Should see: `✅ Database connected`
- Should NOT see: `ECONNREFUSED` or connection errors

### 5. Test Login

**Go to:** https://anteliteeventssystem.vercel.app/login

**Login with:**
- Email: `admin88759551@antelite.digital`
- Password: `94lUYIQ1csnXs1x`

**Should work now!**

---

## 🔍 If Still Not Working

**Check Render logs for:**
1. Database connection errors
2. Exact error message
3. Any stack traces

**Common issues:**
- Wrong password in Render → Check `DB_PASSWORD`
- Database name wrong → Check `DB_NAME=antelite_events`
- Firewall blocking → Check `ufw status | grep 5432`

---

**Priority:** Fix PostgreSQL first (Option 1 or 2 above), then test!

