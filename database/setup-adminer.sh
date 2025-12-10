#!/bin/bash
# Setup Adminer for PostgreSQL Web Admin
# Run this on your Contabo server

echo "🚀 Setting up Adminer..."

# Install PHP and web server if not already installed
apt update -qq
apt install -y php php-fpm nginx

# Download Adminer
cd /var/www/html
wget -O adminer.php https://www.adminer.org/latest.php

# Set permissions
chown www-data:www-data adminer.php
chmod 644 adminer.php

# Create a simple nginx config (if nginx is not configured)
# Or you can access via: http://YOUR_SERVER_IP/adminer.php

echo "✅ Adminer installed!"
echo "📝 Access it at: http://$(curl -s ifconfig.me)/adminer.php"
echo ""
echo "Login details:"
echo "  System: PostgreSQL"
echo "  Server: localhost (or 127.0.0.1)"
echo "  Username: antelite_user"
echo "  Password: ASDasd12345\$\$\$%%%"
echo "  Database: antelite_events"

