# 🗄️ Database Migration Guide

## Running the Module Tables Migration

This guide shows you how to create the database tables needed for the new modules (Payments, Costing, Proposals, Monitoring, Policies).

---

## Method 1: Using PowerShell Script (Easiest) ⭐

1. Open PowerShell in the project root directory
2. Run:
   ```powershell
   .\database\run-migration.ps1
   ```
3. Enter your PostgreSQL password when prompted

---

## Method 2: Using pgAdmin (GUI - Recommended) 🖥️

### Step-by-Step:

1. **Open pgAdmin**
   - Find it in Start Menu: `PostgreSQL 18 > pgAdmin 4`

2. **Connect to Server**
   - Enter your PostgreSQL password if prompted

3. **Navigate to Database**
   - Expand: `Servers > PostgreSQL 18 > Databases > antelite_events`

4. **Open Query Tool**
   - Right-click on `antelite_events` database
   - Select `Query Tool`

5. **Open Migration File**
   - Click `Open File` button (or press `Ctrl+O`)
   - Navigate to: `database/module-tables.sql`
   - Select and open the file

6. **Execute Migration**
   - Click `Execute` button (or press `F5`)
   - Wait for "Query returned successfully" message

7. **Verify Tables Created**
   - Refresh the database (right-click > Refresh)
   - Expand `Schemas > public > Tables`
   - You should see:
     - ✅ costs
     - ✅ budgets
     - ✅ proposals
     - ✅ proposal_templates
     - ✅ monitoring_metrics
     - ✅ team_activity
     - ✅ policies

---

## Method 3: Using psql Command Line 💻

### Option A: If PostgreSQL is in your PATH

```powershell
psql -U postgres -d antelite_events -f database/module-tables.sql
```

### Option B: Using Full Path

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d antelite_events -f database/module-tables.sql
```

**Note:** Replace `18` with your PostgreSQL version if different.

### Option C: Using SQL Shell (psql)

1. Open **SQL Shell (psql)** from Start Menu
2. Enter connection details:
   - Server: `localhost` (press Enter)
   - Database: `antelite_events` (press Enter)
   - Port: `5432` (press Enter)
   - Username: `postgres` (press Enter)
   - Password: Enter your password
3. Once connected, run:
   ```sql
   \i database/module-tables.sql
   ```
   Or copy-paste the entire SQL file content

---

## Method 4: Copy-Paste in pgAdmin Query Tool

1. Open pgAdmin and connect to your database
2. Open Query Tool for `antelite_events` database
3. Open `database/module-tables.sql` in a text editor
4. Copy all the SQL content
5. Paste into Query Tool
6. Click Execute (F5)

---

## Troubleshooting

### Error: "psql: command not found"
- **Solution:** Use the full path to psql.exe or use pgAdmin instead

### Error: "password authentication failed"
- **Solution:** Make sure you're using the correct password for the `postgres` user

### Error: "database does not exist"
- **Solution:** Create the database first:
  ```sql
  CREATE DATABASE antelite_events;
  ```

### Error: "permission denied"
- **Solution:** Make sure you're connected as the `postgres` superuser

### Error: "relation already exists"
- **Solution:** Tables already exist. This is OK - the migration uses `CREATE TABLE IF NOT EXISTS`

---

## Verification

After running the migration, verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('costs', 'budgets', 'proposals', 'proposal_templates', 'monitoring_metrics', 'team_activity', 'policies')
ORDER BY table_name;
```

You should see 7 tables listed.

---

## What Gets Created?

The migration creates:

1. **costs** - For tracking event costs
2. **budgets** - For budget management
3. **proposals** - For proposal management
4. **proposal_templates** - For proposal templates
5. **monitoring_metrics** - For performance metrics
6. **team_activity** - For team activity logging
7. **policies** - For policy management

Plus indexes and triggers for optimal performance.

---

## Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Verify PostgreSQL is running
3. Verify database `antelite_events` exists
4. Try using pgAdmin (easiest method)
5. Check file path is correct

