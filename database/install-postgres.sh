#!/bin/bash
# Complete PostgreSQL Setup Script
# Run: bash install-postgres.sh

set -e

echo "🚀 Starting PostgreSQL Setup..."

# Step 1: Update system
echo "📦 Updating system packages..."
sudo apt update -qq
sudo apt upgrade -y -qq

# Step 2: Install PostgreSQL
echo "📥 Installing PostgreSQL..."
sudo apt install postgresql postgresql-contrib -y -qq

# Step 3: Configure PostgreSQL for remote access
echo "🔧 Configuring PostgreSQL for remote access..."
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" /etc/postgresql/*/main/postgresql.conf

# Step 4: Configure pg_hba.conf
echo "🔐 Configuring authentication..."
if ! grep -q "host    all             all             0.0.0.0/0               md5" /etc/postgresql/*/main/pg_hba.conf; then
    echo "host    all             all             0.0.0.0/0               md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf
    echo "host    all             all             ::/0                    md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf
fi

# Step 5: Configure firewall
echo "🔥 Configuring firewall..."
sudo apt install ufw -y -qq 2>/dev/null || true
sudo ufw allow 22/tcp 2>/dev/null || true
sudo ufw allow 5432/tcp 2>/dev/null || true
echo "y" | sudo ufw enable 2>/dev/null || true

# Step 6: Restart PostgreSQL
echo "🔄 Restarting PostgreSQL..."
sudo systemctl restart postgresql
sudo systemctl enable postgresql

# Step 7: Get server IP
echo ""
echo "🌐 Your server IP addresses:"
echo "Public IP:"
PUBLIC_IP=$(curl -s ifconfig.me)
echo "$PUBLIC_IP"
echo ""
echo "Local IP:"
hostname -I

echo ""
echo "✅ PostgreSQL installation complete!"
echo ""
echo "📝 Next: Create database and user"
echo "Run these commands:"
echo ""
echo "sudo -u postgres psql"
echo ""
echo "Then inside PostgreSQL, run:"
echo "CREATE DATABASE antelite_events;"
echo "CREATE USER antelite_user WITH PASSWORD 'YourPassword123!';"
echo "GRANT ALL PRIVILEGES ON DATABASE antelite_events TO antelite_user;"
echo "ALTER USER antelite_user CREATEDB;"
echo "\\q"

