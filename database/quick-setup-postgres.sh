#!/bin/bash
# Quick PostgreSQL Setup Script for Contabo VPS
# Run this script on your Ubuntu server

echo "🚀 Starting PostgreSQL Setup..."

# Step 1: Update system
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Step 2: Install PostgreSQL
echo "📥 Installing PostgreSQL..."
sudo apt install postgresql postgresql-contrib -y

# Step 3: Configure PostgreSQL for remote access
echo "🔧 Configuring PostgreSQL for remote access..."
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" /etc/postgresql/*/main/postgresql.conf

# Step 4: Configure pg_hba.conf
echo "🔐 Configuring authentication..."
echo "host    all             all             0.0.0.0/0               md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf
echo "host    all             all             ::/0                    md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf

# Step 5: Configure firewall
echo "🔥 Configuring firewall..."
sudo apt install ufw -y
sudo ufw allow 22/tcp
sudo ufw allow 5432/tcp
sudo ufw --force enable

# Step 6: Restart PostgreSQL
echo "🔄 Restarting PostgreSQL..."
sudo systemctl restart postgresql
sudo systemctl enable postgresql

# Step 7: Get server IP
echo "🌐 Your server IP addresses:"
echo "Public IP:"
curl -s ifconfig.me
echo ""
echo "Local IP:"
hostname -I

echo ""
echo "✅ PostgreSQL installation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Create database and user (run the SQL commands below)"
echo "2. Test connection"
echo "3. Update Render environment variables"

