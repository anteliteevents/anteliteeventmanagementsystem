#!/bin/bash
# PostgreSQL Setup Script for Contabo VPS
# Server IP: 217.15.163.29

set -e

echo "🚀 Starting PostgreSQL Setup on 217.15.163.29..."

# Step 1: Update system
echo "📦 Updating system packages..."
apt update -qq
apt upgrade -y -qq

# Step 2: Install PostgreSQL
echo "📥 Installing PostgreSQL..."
apt install postgresql postgresql-contrib ufw -y -qq

# Step 3: Configure PostgreSQL for remote access
echo "🔧 Configuring PostgreSQL for remote access..."
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" /etc/postgresql/*/main/postgresql.conf

# Step 4: Configure pg_hba.conf
echo "🔐 Configuring authentication..."
if ! grep -q "host    all             all             0.0.0.0/0               md5" /etc/postgresql/*/main/pg_hba.conf; then
    echo "host    all             all             0.0.0.0/0               md5" >> /etc/postgresql/*/main/pg_hba.conf
    echo "host    all             all             ::/0                    md5" >> /etc/postgresql/*/main/pg_hba.conf
fi

# Step 5: Configure firewall
echo "🔥 Configuring firewall..."
ufw allow 22/tcp 2>/dev/null || true
ufw allow 5432/tcp 2>/dev/null || true
echo "y" | ufw enable 2>/dev/null || true

# Step 6: Restart PostgreSQL
echo "🔄 Restarting PostgreSQL..."
systemctl restart postgresql
systemctl enable postgresql

# Step 7: Create database and user
echo "📊 Creating database and user..."
sudo -u postgres psql -c "CREATE DATABASE antelite_events;" 2>/dev/null || true
sudo -u postgres psql -c "DROP USER IF EXISTS antelite_user;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER antelite_user WITH PASSWORD 'ASDasd12345$$$%%%';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE antelite_events TO antelite_user;"
sudo -u postgres psql -c "ALTER USER antelite_user CREATEDB;"

# Step 8: Verify
echo "✅ Verifying installation..."
systemctl status postgresql --no-pager | head -5

echo ""
echo "✅ PostgreSQL setup complete!"
echo "📊 Database: antelite_events"
echo "👤 User: antelite_user"
echo "🌐 Server IP: 217.15.163.29"
echo ""
echo "Connection string:"
echo "postgresql://antelite_user:ASDasd12345\$\$\$%%%@217.15.163.29:5432/antelite_events"

