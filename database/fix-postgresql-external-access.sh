#!/bin/bash
# Fix PostgreSQL to listen on all interfaces for external access

echo "=========================================="
echo "Fixing PostgreSQL External Access"
echo "=========================================="

# Find PostgreSQL config file
CONF_FILE=$(find /etc/postgresql -name postgresql.conf -type f | head -1)

if [ -z "$CONF_FILE" ]; then
    echo "❌ PostgreSQL config file not found!"
    exit 1
fi

echo "📁 Config file: $CONF_FILE"

# Backup original
cp "$CONF_FILE" "${CONF_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
echo "✅ Backup created"

# Fix listen_addresses
echo "🔧 Updating listen_addresses..."
sed -i "s/^#listen_addresses = 'localhost'/listen_addresses = '*'/" "$CONF_FILE"
sed -i "s/^listen_addresses = 'localhost'/listen_addresses = '*'/" "$CONF_FILE"

# Verify change
echo ""
echo "📋 Current listen_addresses setting:"
grep "^listen_addresses" "$CONF_FILE" | grep -v "^#"

# Restart PostgreSQL
echo ""
echo "🔄 Restarting PostgreSQL..."
systemctl restart postgresql
sleep 3

# Check if listening on all interfaces
echo ""
echo "🔍 Checking PostgreSQL listening status:"
ss -tlnp | grep :5432 || netstat -tlnp 2>/dev/null | grep :5432

echo ""
echo "✅ Configuration updated!"
echo ""
echo "🧪 Testing connection..."
PGPASSWORD='bkmgjAsoc6AmblMO' psql -h 217.15.163.29 -U antelite_user -d antelite_events -c 'SELECT current_user, current_database();' 2>&1

echo ""
echo "=========================================="
echo "Done!"
echo "=========================================="

