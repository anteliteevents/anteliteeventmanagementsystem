# Backend Database Connection Report

## Render.com Backend → Contabo PostgreSQL Database

**Date:** December 2024  
**Status:** 🔍 Testing & Verification Required

---

## Executive Summary

This report documents the configuration and testing of the database connection between the Render.com backend service and the Contabo VPS PostgreSQL database. The backend needs to be updated with new database credentials following the migration from Supabase.

**Current Status:**

- ⚠️ **Connection Test:** Failed (Connection refused)
- ✅ **Database Server:** Configured and running
- ⚠️ **Remote Access:** Needs verification
- ⚠️ **Render Environment:** Needs update

---

## 1. Current Backend Configuration

### 1.1 Database Connection Code

**File:** `backend/src/config/database.ts`

The backend uses individual connection parameters (preferred over connection string):

```typescript
const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "antelite_events",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
};
```

**Key Features:**

- ✅ Uses individual environment variables (avoids URL encoding issues)
- ✅ Configurable SSL support
- ✅ Connection timeout: 5 seconds
- ✅ Connection pooling: max 20 connections
- ✅ Logs connection config on startup (without password)

### 1.2 Required Environment Variables

The backend requires these environment variables in Render:

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

**⚠️ IMPORTANT:** These must be set in Render dashboard before deployment.

---

## 2. Database Server Configuration

### 2.1 Server Details

- **Host:** 217.15.163.29
- **Port:** 5432
- **Database:** antelite_events
- **User:** antelite_user
- **Password:** bkmgjAsoc6AmblMO
- **SSL:** Not required (internal network)

### 2.2 PostgreSQL Configuration Status

**✅ Remote Access Enabled:**

- `listen_addresses = '*'` in postgresql.conf
- Port 5432 configured

**✅ Authentication Configured:**

- `pg_hba.conf` allows connections from `0.0.0.0/0` with md5 authentication
- User `antelite_user` has proper permissions

**⚠️ Firewall Status:**

- UFW configured to allow port 5432
- Needs verification from external network

### 2.3 Connection Test Results

**Local Connection (from server):**

```bash
✅ SUCCESS: psql -h 127.0.0.1 -U antelite_user -d antelite_events
```

**Remote Connection (from external):**

```bash
❌ FAILED: Connection refused
```

**Issue Identified:**

- PostgreSQL may not be listening on external interface
- Firewall may be blocking connections
- Network routing issue

---

## 3. Issues and Troubleshooting

### 3.1 Issue: Connection Refused

**Error:**

```
psql: error: connection to server at "217.15.163.29", port 5432 failed:
Connection refused
Is the server running on that host and accepting TCP/IP connections?
```

**Possible Causes:**

1. PostgreSQL not listening on external IP
2. Firewall blocking port 5432
3. Network security group rules (if using cloud provider)
4. PostgreSQL service not running

**Troubleshooting Steps:**

**Step 1: Verify PostgreSQL is listening on all interfaces**

```bash
ssh root@217.15.163.29 "netstat -tlnp | grep 5432"
# Should show: 0.0.0.0:5432 or :::5432
```

**Step 2: Check firewall status**

```bash
ssh root@217.15.163.29 "ufw status | grep 5432"
# Should show: 5432/tcp ALLOW Anywhere
```

**Step 3: Verify PostgreSQL config**

```bash
ssh root@217.15.163.29 "cat /etc/postgresql/*/main/postgresql.conf | grep listen_addresses"
# Should show: listen_addresses = '*'
```

**Step 4: Test from external network**

```bash
# From your local machine or Render
telnet 217.15.163.29 5432
# Or
nc -zv 217.15.163.29 5432
```

### 3.2 Issue: Authentication Failed

**Error:**

```
FATAL: password authentication failed for user "antelite_user"
```

**Solution:**

- Verify password is correct: `bkmgjAsoc6AmblMO`
- Check pg_hba.conf allows md5 authentication
- Ensure user exists and has proper permissions

### 3.3 Issue: SSL Connection Required

**Error:**

```
SSL connection required
```

**Solution:**

- Set `DB_SSL=false` in Render environment (SSL not required for internal network)
- If SSL is required, configure SSL certificates on PostgreSQL server

---

## 4. Required Actions

### 4.1 Immediate Actions (Critical)

1. **✅ Verify PostgreSQL is listening on external interface**

   ```bash
   ssh root@217.15.163.29 "netstat -tlnp | grep 5432"
   ```

2. **✅ Verify firewall allows port 5432**

   ```bash
   ssh root@217.15.163.29 "ufw status numbered"
   ssh root@217.15.163.29 "ufw allow 5432/tcp"
   ```

3. **✅ Test connection from external network**

   ```bash
   # From your local machine
   PGPASSWORD='bkmgjAsoc6AmblMO' psql -h 217.15.163.29 -U antelite_user -d antelite_events -c 'SELECT 1;'
   ```

4. **✅ Update Render Environment Variables**
   - Go to Render dashboard
   - Navigate to your backend service
   - Go to Environment tab
   - Update all database-related variables
   - Save and redeploy

### 4.2 Render Dashboard Configuration

**Steps to Update Environment Variables:**

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service
3. Go to **Environment** tab
4. Add/Update these variables:

```
DB_HOST=217.15.163.29
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=antelite_user
DB_PASSWORD=bkmgjAsoc6AmblMO
DB_SSL=false
```

5. **Remove or update old Supabase variables:**

   - Remove `DATABASE_URL` (if exists) OR update it
   - Remove old `DB_HOST` pointing to Supabase

6. **Save changes**
7. **Redeploy the service**

### 4.3 Verification After Update

**Check Render Logs:**

1. Go to Render dashboard → Your service → Logs
2. Look for database connection messages:
   - ✅ `✅ Database connected`
   - ✅ `🔌 Database Config: { host: '217.15.163.29', ... }`
   - ❌ Any connection errors

**Test API Endpoints:**

1. Test login endpoint: `POST /api/auth/login`
2. Check response for database errors
3. Verify data is being retrieved correctly

---

## 5. Security Considerations

### 5.1 Current Security Status

**⚠️ Security Concerns:**

- Database accessible from any IP (`0.0.0.0/0`)
- No IP whitelisting configured
- SSL not enabled

### 5.2 Recommended Security Improvements

**1. IP Whitelisting (Recommended for Production):**

```bash
# Get Render's IP addresses (check Render docs or contact support)
# Update pg_hba.conf:
host    all    all    <RENDER_IP_1>/32    md5
host    all    all    <RENDER_IP_2>/32    md5
```

**2. Enable SSL/TLS:**

- Generate SSL certificates
- Configure PostgreSQL SSL
- Update `DB_SSL=true` in Render
- Update connection config to use SSL

**3. Firewall Rules:**

- Restrict UFW to specific IP ranges
- Use fail2ban for additional protection

**4. Regular Security Audits:**

- Review connection logs
- Monitor failed login attempts
- Update passwords regularly

---

## 6. Connection Test Checklist

Use this checklist to verify the connection:

- [ ] PostgreSQL service is running
- [ ] PostgreSQL listening on all interfaces (`0.0.0.0:5432`)
- [ ] Firewall allows port 5432
- [ ] pg_hba.conf allows remote connections
- [ ] Database user exists and has correct password
- [ ] Database `antelite_events` exists
- [ ] Connection test from external network succeeds
- [ ] Render environment variables updated
- [ ] Backend service redeployed
- [ ] Render logs show successful connection
- [ ] API endpoints respond correctly
- [ ] Login functionality works

---

## 7. Troubleshooting Commands

### 7.1 Server-Side Commands

**Check PostgreSQL status:**

```bash
ssh root@217.15.163.29 "systemctl status postgresql"
```

**Check listening ports:**

```bash
ssh root@217.15.163.29 "netstat -tlnp | grep 5432"
```

**Check firewall:**

```bash
ssh root@217.15.163.29 "ufw status numbered"
```

**Test local connection:**

```bash
ssh root@217.15.163.29 "PGPASSWORD='bkmgjAsoc6AmblMO' psql -h 127.0.0.1 -U antelite_user -d antelite_events -c 'SELECT 1;'"
```

**View PostgreSQL logs:**

```bash
ssh root@217.15.163.29 "tail -f /var/log/postgresql/postgresql-*-main.log"
```

### 7.2 Client-Side Commands

**Test connection from local machine:**

```bash
PGPASSWORD='bkmgjAsoc6AmblMO' psql -h 217.15.163.29 -U antelite_user -d antelite_events -c 'SELECT version();'
```

**Test port accessibility:**

```bash
telnet 217.15.163.29 5432
# Or
nc -zv 217.15.163.29 5432
```

**Test with connection string:**

```bash
psql "postgresql://antelite_user:bkmgjAsoc6AmblMO@217.15.163.29:5432/antelite_events"
```

---

## 8. Expected Backend Logs

### 8.1 Successful Connection

When the backend connects successfully, you should see in Render logs:

```
🔌 Database Config: {
  host: '217.15.163.29',
  port: 5432,
  database: 'antelite_events',
  user: 'antelite_user',
  ssl: false,
  hasPassword: true
}
✅ Database connected
Server running on port 3001
```

### 8.2 Connection Errors

**Connection Refused:**

```
Error: connect ECONNREFUSED 217.15.163.29:5432
```

→ Check firewall and PostgreSQL listening address

**Authentication Failed:**

```
Error: password authentication failed for user "antelite_user"
```

→ Verify password in Render environment variables

**Timeout:**

```
Error: Connection timeout
```

→ Check network connectivity and firewall rules

---

## 9. Next Steps

### 9.1 Immediate (Today)

1. ✅ Run connection tests from external network
2. ✅ Verify firewall configuration
3. ✅ Update Render environment variables
4. ✅ Redeploy backend service
5. ✅ Verify connection in Render logs
6. ✅ Test login functionality

### 9.2 Short-term (This Week)

1. Implement IP whitelisting for enhanced security
2. Set up monitoring and alerts for database connections
3. Document connection troubleshooting procedures
4. Create automated connection health checks

### 9.3 Long-term (This Month)

1. Enable SSL/TLS for database connections
2. Implement connection pooling optimization
3. Set up database backup verification
4. Review and optimize query performance

---

## 10. Support and Resources

**Render Documentation:**

- [Environment Variables](https://render.com/docs/environment-variables)
- [PostgreSQL Connections](https://render.com/docs/databases)

**PostgreSQL Documentation:**

- [Connection Settings](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [Authentication](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html)

**Troubleshooting:**

- Check Render service logs
- Check PostgreSQL server logs
- Verify network connectivity
- Test with psql client

---

## 11. Appendix

### 11.1 Environment Variables Template

**For Render Dashboard:**

```env
# Database Configuration
DB_HOST=217.15.163.29
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=antelite_user
DB_PASSWORD=bkmgjAsoc6AmblMO
DB_SSL=false

# Application Configuration
PORT=3001
NODE_ENV=production

# Security
JWT_SECRET=e1df7e2f1f41cee5ba0ff6b6170ec0daf766751e05447304654d0cfc2a618e7aa3ea517cfe8aba9b76b6881465220b9f4e813f19706a3346eb496aaa80162020

# CORS
CORS_ORIGIN=https://anteliteeventssystem.vercel.app,https://anteliteeventssystem-2s8af5wgz-anteliteevents-projects.vercel.app,http://localhost:3000

# Optional: Remove or comment out old Supabase connection
# DATABASE_URL=postgresql://...
```

### 11.2 Connection String Format (Optional)

If you prefer using `DATABASE_URL` instead of individual variables:

```
postgresql://antelite_user:bkmgjAsoc6AmblMO@217.15.163.29:5432/antelite_events
```

**Note:** The backend code prefers individual variables to avoid URL encoding issues with special characters in passwords.

---

## 12. Conclusion

The backend database connection configuration is ready, but requires:

1. **✅ Verification** of PostgreSQL remote access configuration
2. **✅ Testing** from external network (simulating Render)
3. **✅ Update** Render environment variables
4. **✅ Redeploy** backend service
5. **✅ Verify** connection in production logs

Once these steps are completed, the backend should successfully connect to the Contabo PostgreSQL database and the application should be fully operational.

---

**Report Generated:** December 2024  
**Status:** ⚠️ Action Required - Connection Testing & Render Configuration  
**Next Action:** Verify remote access and update Render environment variables
