#!/bin/bash
# Fix PostgreSQL to listen on all interfaces

CONF_FILE=$(find /etc/postgresql -name postgresql.conf | head -1)

if [ -z "$CONF_FILE" ]; then
    echo "PostgreSQL config file not found!"
    exit 1
fi

echo "Config file: $CONF_FILE"

# Backup original
cp "$CONF_FILE" "${CONF_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# Fix listen_addresses
sed -i "s/^#listen_addresses = 'localhost'/listen_addresses = '*'/" "$CONF_FILE"
sed -i "s/^listen_addresses = 'localhost'/listen_addresses = '*'/" "$CONF_FILE"

# Verify change
echo "Current listen_addresses setting:"
grep "^listen_addresses" "$CONF_FILE" | grep -v "^#"

# Restart PostgreSQL
systemctl restart postgresql
sleep 2

# Check if listening on all interfaces
echo ""
echo "PostgreSQL listening on:"
ss -tlnp | grep :5432

echo ""
echo "✅ Configuration updated. Testing connection..."
PGPASSWORD='bkmgjAsoc6AmblMO' psql -h 217.15.163.29 -U antelite_user -d antelite_events -c 'SELECT current_user, current_database();' 2>&1

