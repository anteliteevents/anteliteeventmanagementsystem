# 🔧 Fix Admin User - Quick Guide

## ✅ Deployment Status

**Backend:** ✅ Deployed and running  
**Database:** ✅ Connected  
**Build:** ✅ Successful  
**Login:** ⚠️ 401 INVALID_CREDENTIALS (credentials issue)

---

## 🎯 The Issue

The backend is working, but the admin user credentials don't match.

**Login Test Result:**
- Status: `401 INVALID_CREDENTIALS`
- This means: Database connection works, but email/password don't match

---

## 🔍 Verify Admin User

### Option 1: Via Adminer (Web UI)

1. Go to: http://217.15.163.29/adminer.php
2. Login with:
   - System: PostgreSQL
   - Server: localhost
   - Username: antelite_user
   - Password: bkmgjAsoc6AmblMO
   - Database: antelite_events
3. Run this SQL:

```sql
SELECT email, role, is_active 
FROM users 
WHERE email = 'admin88759551@antelite.digital';
```

### Option 2: Via SSH

```bash
ssh root@217.15.163.29
PGPASSWORD='bkmgjAsoc6AmblMO' psql -h 127.0.0.1 -U antelite_user -d antelite_events -c "SELECT email, role, is_active FROM users WHERE email = 'admin88759551@antelite.digital';"
```

---

## 🔧 Fix Admin User

### If User Doesn't Exist - Create It

```sql
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, created_at)
VALUES (
  'admin88759551@antelite.digital',
  '$2a$10$XTAsFTa09q8jZUN/5lXgrOxCiSLiNnHGs.IXLg4gkSldPr6MAsN/m',
  'Admin',
  'User',
  'admin',
  true,
  NOW()
);
```

### If User Exists - Reset Password

```sql
UPDATE users 
SET password_hash = '$2a$10$XTAsFTa09q8jZUN/5lXgrOxCiSLiNnHGs.IXLg4gkSldPr6MAsN/m',
    first_name = COALESCE(first_name, 'Admin'),
    last_name = COALESCE(last_name, 'User'),
    is_active = true
WHERE email = 'admin88759551@antelite.digital';
```

**Password Hash:** `$2a$10$XTAsFTa09q8jZUN/5lXgrOxCiSLiNnHGs.IXLg4gkSldPr6MAsN/m`  
**Plain Password:** `94lUYIQ1csnXs1x`

---

## ✅ After Fixing

1. **Test Login:**
   - Go to: https://anteliteeventssystem.vercel.app/login
   - Email: `admin88759551@antelite.digital`
   - Password: `94lUYIQ1csnXs1x`
   - Should work!

2. **Verify:**
   - Should redirect to dashboard
   - No more 401 errors

---

## 📋 Quick Copy-Paste SQL

**Check user:**
```sql
SELECT email, role, is_active FROM users WHERE email = 'admin88759551@antelite.digital';
```

**Create/Update user:**
```sql
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, created_at)
VALUES ('admin88759551@antelite.digital', '$2a$10$XTAsFTa09q8jZUN/5lXgrOxCiSLiNnHGs.IXLg4gkSldPr6MAsN/m', 'Admin', 'User', 'admin', true, NOW())
ON CONFLICT (email) 
DO UPDATE SET 
    password_hash = EXCLUDED.password_hash, 
    first_name = COALESCE(users.first_name, EXCLUDED.first_name),
    last_name = COALESCE(users.last_name, EXCLUDED.last_name),
    is_active = true;
```

---

**Status:** Backend working, just need to fix admin user credentials!

