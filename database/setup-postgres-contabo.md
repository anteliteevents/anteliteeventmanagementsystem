# PostgreSQL Setup on Contabo VPS (Ubuntu)

## Prerequisites
- Contabo VPS with Ubuntu (Singapore)
- SSH access to the server
- Root or sudo access

## Step 1: Connect to Your Server

```bash
ssh root@your-server-ip
# or
ssh your-username@your-server-ip
```

## Step 2: Update System

```bash
sudo apt update
sudo apt upgrade -y
```

## Step 3: Install PostgreSQL

```bash
# Install PostgreSQL 18
sudo apt install postgresql postgresql-contrib -y

# Check version
sudo -u postgres psql -c "SELECT version();"
```

## Step 4: Configure PostgreSQL for Remote Access

```bash
# Edit PostgreSQL config
sudo nano /etc/postgresql/*/main/postgresql.conf

# Find and change:
# listen_addresses = 'localhost' 
# To:
# listen_addresses = '*'

# Or use sed:
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" /etc/postgresql/*/main/postgresql.conf
```

## Step 5: Configure pg_hba.conf for Remote Access

```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Add at the end:
# host    all             all             0.0.0.0/0               md5
# host    all             all             ::/0                    md5

# Or append:
echo "host    all             all             0.0.0.0/0               md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf
echo "host    all             all             ::/0                    md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf
```

## Step 6: Configure Firewall (UFW)

```bash
# Install UFW if not installed
sudo apt install ufw -y

# Allow SSH
sudo ufw allow 22/tcp

# Allow PostgreSQL
sudo ufw allow 5432/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 7: Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt, run:
CREATE DATABASE antelite_events;
CREATE USER antelite_user WITH PASSWORD 'YOUR_STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE antelite_events TO antelite_user;
ALTER USER antelite_user CREATEDB;
\q
```

## Step 8: Restart PostgreSQL

```bash
sudo systemctl restart postgresql
sudo systemctl enable postgresql
sudo systemctl status postgresql
```

## Step 9: Test Connection Locally

```bash
# Test from server
sudo -u postgres psql -d antelite_events -U antelite_user
# Enter password when prompted
# Type \q to exit
```

## Step 10: Get Your Server IP

```bash
# Get public IP
curl ifconfig.me
# or
hostname -I
```

## Connection String Format

```
postgresql://antelite_user:YOUR_PASSWORD@YOUR_SERVER_IP:5432/antelite_events
```

## Security Recommendations

1. **Change default postgres password:**
   ```bash
   sudo -u postgres psql
   ALTER USER postgres WITH PASSWORD 'STRONG_PASSWORD';
   \q
   ```

2. **Consider restricting IP access in pg_hba.conf** (only allow Render IPs):
   ```bash
   # Instead of 0.0.0.0/0, use specific IPs
   host    all             all             RENDER_IP/32               md5
   ```

3. **Enable SSL (optional but recommended):**
   ```bash
   # Edit postgresql.conf
   sudo nano /etc/postgresql/*/main/postgresql.conf
   # Set: ssl = on
   ```

## Next Steps

After setup:
1. Run your schema SQL files
2. Run seed data
3. Update Render environment variables
4. Test connection from Render

