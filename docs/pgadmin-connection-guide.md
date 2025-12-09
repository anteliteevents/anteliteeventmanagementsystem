# pgAdmin Connection Guide

This guide will help you connect pgAdmin to your PostgreSQL database, whether it's on your local machine or a remote server.

## 🎯 What We'll Do

1. Open pgAdmin
2. Register a new server
3. Configure connection settings
4. Test the connection
5. Access your database

---

## Step 1: Open pgAdmin

### On Windows:

1. **Search for pgAdmin** in Start menu
2. Click "pgAdmin 4"
3. You may need to enter your **master password** (the one you set during PostgreSQL installation)

### First Time Setup:

If this is your first time opening pgAdmin:
- You'll be asked to set a **master password**
- This password protects your saved server connections
- **Remember this password!** You'll need it every time you open pgAdmin

---

## Step 2: Register a New Server

### 2.1 Right-Click on "Servers"

1. In the left sidebar, find **"Servers"**
2. **Right-click** on "Servers"
3. Select **"Register" → "Server..."**

### 2.2 General Tab

Fill in the **General** tab:

- **Name:** `Ant Elite Events` (or any name you prefer)
- **Server Group:** `Servers` (default)
- **Comments:** (optional) "Production server" or "Local development"

Click **"Next"** or go to **"Connection"** tab.

---

## Step 3: Connection Settings

### Option A: Local PostgreSQL (On Your Windows Machine)

If PostgreSQL is installed on your local computer:

**Connection Tab:**
- **Host name/address:** `localhost` or `127.0.0.1`
- **Port:** `5432` (default PostgreSQL port)
- **Maintenance database:** `postgres`
- **Username:** `postgres` (or your PostgreSQL username)
- **Password:** Your PostgreSQL password (the one you set during installation)
- ✅ **Save password** (check this box)

**Click "Save"**

---

### Option B: Remote Server (VPS/Cloud)

If PostgreSQL is on a remote server (like Contabo VPS):

**Connection Tab:**
- **Host name/address:** Your server IP address (e.g., `123.45.67.89`)
- **Port:** `5432`
- **Maintenance database:** `postgres`
- **Username:** `postgres` or `antelite_user`
- **Password:** Your PostgreSQL password
- ✅ **Save password** (check this box)

**Important:** For remote connections, you may need to configure PostgreSQL to allow remote connections first (see "Remote Connection Setup" below).

---

## Step 4: Advanced Settings (Optional)

### SSL Tab:
- **SSL mode:** `Prefer` (for local) or `Require` (for remote)
- Usually you can leave defaults

### Advanced Tab:
- Usually leave defaults

---

## Step 5: Test Connection

1. Click **"Save"** button
2. pgAdmin will try to connect
3. If successful, you'll see your server appear in the left sidebar
4. You can expand it to see databases

**If connection fails**, see troubleshooting below.

---

## Step 6: Access Your Database

Once connected:

1. **Expand your server** in the left sidebar
2. **Expand "Databases"**
3. You should see:
   - `postgres` (default database)
   - `antelite_events` (your project database)
4. **Expand `antelite_events`** to see:
   - Schemas
   - Tables (events, booths, reservations, etc.)
   - Views
   - Functions

---

## 🔧 Remote Connection Setup (If Needed)

If you're connecting to a remote server and it's not working, you need to configure PostgreSQL to allow remote connections.

### On Your Server (via SSH):

```bash
# Edit PostgreSQL config
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Find and uncomment (remove #):
```
listen_addresses = '*'
```

Save: Ctrl+O, Enter, Ctrl+X

```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

Add this line at the end:
```
host    all             all             0.0.0.0/0               md5
```

**Security Note:** This allows connections from any IP. For production, restrict to specific IPs:
```
host    all             all             YOUR_IP_ADDRESS/32      md5
```

Save and restart:
```bash
sudo systemctl restart postgresql
```

### Configure Firewall:

```bash
# Allow PostgreSQL port
sudo ufw allow 5432/tcp

# Check status
sudo ufw status
```

**Important:** Only do this if you need remote access. For local connections, you don't need these changes.

---

## 🆘 Troubleshooting

### Issue: "[Errno 11001] getaddrinfo failed"

**This means:** pgAdmin cannot resolve the hostname/address.

**Quick fixes:**
1. **Check for typos** in hostname/IP address
2. **Use IP address instead of hostname** (e.g., `127.0.0.1` instead of `localhost`)
3. **Remove extra spaces** before/after the address
4. **For local:** Try `127.0.0.1` if `localhost` doesn't work
5. **For remote:** Use actual IP address (e.g., `123.45.67.89`)

**See detailed troubleshooting:** [`docs/pgadmin-troubleshooting.md`](pgadmin-troubleshooting.md)

### Issue: "Connection refused"

**Possible causes:**
1. PostgreSQL not running
2. Wrong port number
3. Firewall blocking connection
4. PostgreSQL not configured for remote access

**Solutions:**

**Check if PostgreSQL is running:**
```bash
# On Windows (PowerShell as Admin)
Get-Service -Name "*postgresql*"

# On Linux server
sudo systemctl status postgresql
```

**Check port:**
- Default is `5432`
- Verify in PostgreSQL config

**Check firewall:**
- Windows: Check Windows Firewall
- Linux: Check UFW or iptables

---

### Issue: "Password authentication failed"

**Solutions:**
1. **Verify username and password:**
   - Username is usually `postgres`
   - Password is the one you set during installation

2. **Reset password (if needed):**
   ```bash
   # On server
   sudo -u postgres psql
   ALTER USER postgres WITH PASSWORD 'new_password';
   \q
   ```

3. **Check pg_hba.conf:**
   - Make sure authentication method is correct
   - For local: `trust` or `md5`
   - For remote: `md5` or `password`

---

### Issue: "Server doesn't listen"

**Solution:**
- Check `listen_addresses` in `postgresql.conf`
- For local: `localhost` or `127.0.0.1`
- For remote: `*` (all addresses) or specific IP
- Restart PostgreSQL after changes

---

### Issue: "Could not connect to server"

**Solutions:**
1. **Check server is running:**
   ```bash
   # Windows
   Get-Service postgresql-x64-14
   
   # Linux
   systemctl status postgresql
   ```

2. **Check network connectivity:**
   ```bash
   # Test connection
   telnet your_server_ip 5432
   # Or
   nc -zv your_server_ip 5432
   ```

3. **Check firewall:**
   - Make sure port 5432 is open
   - Check both server firewall and your local firewall

---

### Issue: "SSL connection required"

**Solution:**
- In pgAdmin, go to **SSL tab**
- Change **SSL mode** to `Prefer` or `Allow`
- For local connections, `Prefer` is usually fine
- For remote, you might need `Require`

---

## 📝 Quick Reference

### Common Connection Settings

**Local PostgreSQL:**
```
Host: localhost
Port: 5432
Database: postgres
Username: postgres
Password: (your password)
```

**Remote PostgreSQL:**
```
Host: your_server_ip
Port: 5432
Database: postgres
Username: postgres (or antelite_user)
Password: (your password)
```

### Default PostgreSQL Credentials

- **Username:** `postgres`
- **Password:** The one you set during installation
- **Port:** `5432`
- **Default Database:** `postgres`

---

## ✅ Verification Checklist

- [ ] pgAdmin opens successfully
- [ ] Master password set (if first time)
- [ ] Server registered with correct name
- [ ] Connection settings correct (host, port, username, password)
- [ ] Connection test successful
- [ ] Server appears in left sidebar
- [ ] Can expand server and see databases
- [ ] Can see `antelite_events` database
- [ ] Can expand database and see tables

---

## 🎯 Next Steps

Once connected:

1. **Explore your database:**
   - Right-click `antelite_events` → "Query Tool"
   - Run: `SELECT * FROM events;`

2. **Run your schema:**
   - If tables don't exist, run `database/schema.sql`
   - In Query Tool, open the file and execute

3. **View data:**
   - Right-click any table → "View/Edit Data" → "All Rows"

4. **Create backups:**
   - Right-click database → "Backup..."
   - Choose location and backup

---

## 💡 Tips

1. **Save passwords:** Check "Save password" so you don't have to enter it every time

2. **Use descriptive names:** Name your server connection something meaningful (e.g., "Production", "Local Dev")

3. **Test connection first:** Always test before saving

4. **Multiple connections:** You can register multiple servers (local, staging, production)

5. **Connection pooling:** For production, consider using connection pooling tools

---

## 🔒 Security Best Practices

1. **Use strong passwords** for PostgreSQL users
2. **Limit remote access** - only allow from trusted IPs
3. **Use SSL** for remote connections
4. **Don't use `postgres` user** for applications - create specific users
5. **Regular backups** - schedule automatic backups
6. **Keep PostgreSQL updated** - install security patches

---

## 🆘 Still Having Issues?

1. **Check PostgreSQL logs:**
   - Windows: `C:\Program Files\PostgreSQL\14\data\log\`
   - Linux: `/var/log/postgresql/postgresql-14-main.log`

2. **Verify PostgreSQL is running:**
   - Check services (Windows) or systemctl (Linux)

3. **Test connection from command line:**
   ```bash
   psql -U postgres -h localhost
   # Or for remote
   psql -U postgres -h your_server_ip
   ```

4. **Check network:**
   - Can you ping the server?
   - Is port 5432 open?

Good luck! 🚀

