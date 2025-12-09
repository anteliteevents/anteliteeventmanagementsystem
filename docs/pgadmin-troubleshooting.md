# pgAdmin Connection Troubleshooting

## Error: [Errno 11001] getaddrinfo failed

This error means pgAdmin cannot resolve the hostname/address you entered. The hostname lookup failed.

---

## 🔍 Quick Fixes

### Fix 1: Check Hostname/Address

**Common mistakes:**

- ❌ `localhost` (if PostgreSQL is remote)
- ❌ `your-server.com` (if DNS not configured)
- ❌ Typo in IP address
- ❌ Extra spaces before/after address

**Correct formats:**

- ✅ `localhost` (for local PostgreSQL)
- ✅ `127.0.0.1` (for local PostgreSQL)
- ✅ `192.168.1.100` (for local network)
- ✅ `123.45.67.89` (for remote server - use actual IP)

**Action:**

1. Open pgAdmin
2. Right-click your server → "Properties"
3. Go to "Connection" tab
4. Check "Host name/address" field
5. Make sure there are no typos or extra spaces

---

### Fix 2: Use IP Address Instead of Hostname

If you're using a hostname (like `myserver.com`) and it's not working:

**Try using the IP address instead:**

1. **Find the IP address:**

   - If it's your local machine: Use `127.0.0.1` or `localhost`
   - If it's a remote server: Use the actual IP (e.g., `123.45.67.89`)

2. **Update connection:**
   - In pgAdmin, edit server properties
   - Change "Host name/address" to the IP address
   - Save and try again

---

### Fix 3: Test Network Connectivity

**On Windows (PowerShell):**

```powershell
# Test if you can reach the server
ping your_server_ip

# Test if port is open
Test-NetConnection -ComputerName your_server_ip -Port 5432
```

**If ping fails:**

- Server might be down
- Wrong IP address
- Network connectivity issue

**If ping works but port test fails:**

- PostgreSQL might not be running
- Firewall blocking port 5432
- PostgreSQL not configured for remote access

---

### Fix 4: Verify PostgreSQL is Running

**Check if PostgreSQL service is running:**

```powershell
# In PowerShell (as Administrator)
Get-Service -Name "*postgresql*"
```

**If service is stopped:**

```powershell
# Start PostgreSQL service
Start-Service postgresql-x64-14
# (Replace 14 with your version number)
```

**Or use Services:**

1. Press `Win + R`
2. Type `services.msc`
3. Find "postgresql-x64-14" (or your version)
4. Right-click → "Start"

---

## 📋 Step-by-Step Troubleshooting

### Step 1: Identify Your Setup

**Are you connecting to:**

- [ ] Local PostgreSQL (on your Windows machine)
- [ ] Remote PostgreSQL (on a VPS/server)

---

### Step 2: For Local Connections

**If PostgreSQL is on your local machine:**

1. **Use `localhost` or `127.0.0.1`:**

   ```
   Host name/address: localhost
   Port: 5432
   ```

2. **Verify PostgreSQL is installed:**

   - Check if pgAdmin is installed (it comes with PostgreSQL)
   - If pgAdmin exists, PostgreSQL should be installed

3. **Check PostgreSQL service:**

   ```powershell
   Get-Service "*postgresql*"
   ```

4. **If service doesn't exist:**
   - PostgreSQL might not be installed
   - Install PostgreSQL: https://www.postgresql.org/download/windows/

---

### Step 3: For Remote Connections

**If PostgreSQL is on a remote server:**

1. **Get the correct IP address:**

   - Check your server/VPS dashboard
   - Use the public IP address (not private IP)

2. **Test connectivity:**

   ```powershell
   ping your_server_ip
   Test-NetConnection -ComputerName your_server_ip -Port 5432
   ```

3. **If ping fails:**

   - Server might be down
   - Wrong IP address
   - Check with your hosting provider

4. **If ping works but port test fails:**
   - PostgreSQL might not be running on server
   - Firewall blocking port 5432
   - PostgreSQL not configured for remote access

---

## 🔧 Common Scenarios

### Scenario 1: First Time Setup (Local)

**Problem:** Just installed PostgreSQL, trying to connect locally.

**Solution:**

1. Use `localhost` as hostname
2. Port: `5432`
3. Username: `postgres`
4. Password: The one you set during installation
5. Make sure PostgreSQL service is running

**Check service:**

```powershell
Get-Service "*postgresql*"
```

---

### Scenario 2: Connecting to Remote Server

**Problem:** Trying to connect to a VPS/cloud server.

**Solution:**

1. **Use IP address, not hostname:**

   ```
   Host: 123.45.67.89 (your actual server IP)
   Port: 5432
   ```

2. **Verify server allows remote connections:**

   - SSH into your server
   - Check PostgreSQL config (see server setup guide)
   - Check firewall allows port 5432

3. **Test from command line first:**
   ```powershell
   # This might not work if psql not in PATH, but test network
   Test-NetConnection -ComputerName your_server_ip -Port 5432
   ```

---

### Scenario 3: Typo or Wrong Address

**Problem:** Entered wrong hostname/IP.

**Solution:**

1. Double-check the hostname/IP address
2. Remove any spaces before/after
3. Try `127.0.0.1` instead of `localhost` (or vice versa)
4. For remote: Use actual IP address, not domain name (unless DNS is configured)

---

## 🛠️ Advanced Troubleshooting

### Check DNS Resolution

**If using a hostname (not IP):**

```powershell
# Test DNS resolution
nslookup your_hostname.com

# If this fails, use IP address instead
```

### Check Windows Firewall

```powershell
# Check firewall rules
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*PostgreSQL*"}

# If no rules, PostgreSQL might be blocked
# Allow it in Windows Firewall settings
```

### Check PostgreSQL Config (Remote)

If connecting to remote server, verify:

1. **PostgreSQL is listening on correct address:**

   ```bash
   # On server
   sudo netstat -tulpn | grep 5432
   ```

2. **pg_hba.conf allows your IP:**

   ```bash
   # On server
   sudo cat /etc/postgresql/14/main/pg_hba.conf
   ```

3. **Firewall allows port 5432:**
   ```bash
   # On server
   sudo ufw status
   ```

---

## ✅ Quick Checklist

Before connecting, verify:

- [ ] **Hostname/IP is correct** (no typos, no extra spaces)
- [ ] **Port is 5432** (default PostgreSQL port)
- [ ] **PostgreSQL service is running** (for local)
- [ ] **Network connectivity works** (can ping server)
- [ ] **Port 5432 is accessible** (for remote)
- [ ] **Firewall allows connection** (Windows + server firewall)
- [ ] **PostgreSQL configured for remote access** (if remote)

---

## 🎯 Recommended Connection Settings

### For Local PostgreSQL:

```
Host name/address: localhost
Port: 5432
Maintenance database: postgres
Username: postgres
Password: (your PostgreSQL password)
SSL mode: Prefer
```

### For Remote PostgreSQL:

```
Host name/address: 123.45.67.89 (actual IP)
Port: 5432
Maintenance database: postgres
Username: postgres (or antelite_user)
Password: (your server password)
SSL mode: Require (recommended for remote)
```

---

## 🆘 Still Not Working?

### Try These Steps:

1. **Use IP instead of hostname:**

   - If using `localhost`, try `127.0.0.1`
   - If using domain name, try IP address

2. **Check PostgreSQL logs:**

   - Windows: `C:\Program Files\PostgreSQL\14\data\log\`
   - Look for connection attempts

3. **Test with command line:**

   ```powershell
   # If psql is available
   psql -U postgres -h localhost
   ```

4. **Reinstall pgAdmin connection:**

   - Delete the server connection in pgAdmin
   - Create a new one from scratch
   - Double-check all settings

5. **Check for VPN/Proxy:**
   - VPN might be blocking connection
   - Corporate proxy might interfere
   - Try disconnecting VPN temporarily

---

## 💡 Pro Tips

1. **Always use IP for remote connections** (more reliable than hostnames)
2. **Test network first** (ping, telnet) before trying pgAdmin
3. **Check services** (make sure PostgreSQL is running)
4. **Use `127.0.0.1` instead of `localhost`** if localhost doesn't work
5. **Verify firewall settings** (both Windows and server)

---

## 📞 Need More Help?

If you're still stuck, provide:

1. **Are you connecting locally or remotely?**
2. **What hostname/IP are you using?**
3. **What does `ping` show?**
4. **Is PostgreSQL service running?**
5. **Any firewall/antivirus software?**

Good luck! 🚀
