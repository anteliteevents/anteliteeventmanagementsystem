#!/bin/bash
# Database Connection Test Script
# Tests PostgreSQL connection from remote perspective (simulating Render)

echo "=========================================="
echo "PostgreSQL Connection Test for Render"
echo "=========================================="
echo ""

# Database credentials
DB_HOST="217.15.163.29"
DB_PORT="5432"
DB_NAME="antelite_events"
DB_USER="antelite_user"
DB_PASSWORD="bkmgjAsoc6AmblMO"

echo "Testing connection to: $DB_HOST:$DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""

# Test 1: Check if port is open
echo "Test 1: Checking if port $DB_PORT is accessible..."
if timeout 5 bash -c "echo > /dev/tcp/$DB_HOST/$DB_PORT" 2>/dev/null; then
    echo "✅ Port $DB_PORT is open and accessible"
else
    echo "❌ Port $DB_PORT is NOT accessible (firewall or service issue)"
fi
echo ""

# Test 2: Test PostgreSQL connection
echo "Test 2: Testing PostgreSQL connection..."
export PGPASSWORD="$DB_PASSWORD"
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version(), current_database(), current_user;" 2>&1; then
    echo "✅ PostgreSQL connection successful!"
else
    echo "❌ PostgreSQL connection failed!"
fi
echo ""

# Test 3: Test basic query
echo "Test 3: Testing database query..."
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';" 2>&1; then
    echo "✅ Database query successful!"
else
    echo "❌ Database query failed!"
fi
echo ""

# Test 4: Check if users table exists and has data
echo "Test 4: Checking users table..."
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT COUNT(*) as user_count FROM users;" 2>&1; then
    echo "✅ Users table accessible!"
else
    echo "❌ Users table not accessible!"
fi
echo ""

echo "=========================================="
echo "Test Complete"
echo "=========================================="

