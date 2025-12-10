#!/bin/bash
# Quick fix for PostgreSQL external access

echo "Fixing PostgreSQL to listen on all interfaces..."

# Find config file
CONF_FILE=$(find /etc/postgresql -name postgresql.conf -type f | head -1)

if [ -z "$CONF_FILE" ]; then
    echo "ERROR: PostgreSQL config not found!"
    exit 1
fi

echo "Config file: $CONF_FILE"

# Backup
cp "$CONF_FILE" "${CONF_FILE}.backup"

# Fix listen_addresses
sed -i "s/^#listen_addresses = 'localhost'/listen_addresses = '*'/" "$CONF_FILE"
sed -i "s/^listen_addresses = 'localhost'/listen_addresses = '*'/" "$CONF_FILE"

# Show what changed
echo ""
echo "Current setting:"
grep "^listen_addresses" "$CONF_FILE" | grep -v "^#"

# Restart
echo ""
echo "Restarting PostgreSQL..."
systemctl restart postgresql
sleep 3

# Check status
echo ""
echo "PostgreSQL listening on:"
ss -tlnp | grep :5432

echo ""
echo "Done! Test connection now."

