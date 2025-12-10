#!/bin/bash
# Verify and fix admin user in database

DB_PASSWORD="bkmgjAsoc6AmblMO"
DB_USER="antelite_user"
DB_NAME="antelite_events"
ADMIN_EMAIL="admin88759551@antelite.digital"
ADMIN_PASSWORD_HASH="$2a$10$XTAsFTa09q8jZUN/5lXgrOxCiSLiNnHGs.IXLg4gkSldPr6MAsN/m"

echo "Checking admin user..."
PGPASSWORD="$DB_PASSWORD" psql -h 127.0.0.1 -U "$DB_USER" -d "$DB_NAME" -c "SELECT email, role, is_active FROM users WHERE email = '$ADMIN_EMAIL';"

echo ""
echo "If user doesn't exist or password is wrong, run:"
echo "PGPASSWORD='$DB_PASSWORD' psql -h 127.0.0.1 -U $DB_USER -d $DB_NAME -c \"UPDATE users SET password_hash = '$ADMIN_PASSWORD_HASH' WHERE email = '$ADMIN_EMAIL';\""

