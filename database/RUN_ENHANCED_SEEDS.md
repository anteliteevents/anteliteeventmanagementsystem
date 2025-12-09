# How to Run Enhanced Seeds

This will add comprehensive data for all modules (Payments, Costing, Proposals, Monitoring, Policies).

## Option 1: Using Node.js Script (Recommended)

1. Make sure your `.env` file in the `backend` folder has the correct database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=antelite_events
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   ```

2. Run the script:
   ```powershell
   node backend/scripts/seed-enhanced-data.js
   ```

## Option 2: Using psql Directly

1. Open PowerShell or Command Prompt

2. Navigate to the project root:
   ```powershell
   cd C:\xampp\htdocs\events\anteliteeventssystem
   ```

3. Run the SQL file:
   ```powershell
   psql -U postgres -d antelite_events -f database/enhanced-seeds.sql
   ```

   If `psql` is not in your PATH, use the full path:
   ```powershell
   "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d antelite_events -f database/enhanced-seeds.sql
   ```

## Option 3: Using pgAdmin

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on `antelite_events` database → Query Tool
4. Open `database/enhanced-seeds.sql`
5. Execute the script (F5)

## What This Adds

- **50+ Transactions** - Various payment statuses and methods
- **40+ Invoices** - Different invoice statuses
- **20+ Costs** - Costs across all events
- **12+ Budgets** - Budget allocations for all events
- **25+ Proposals** - Proposals in various states
- **4+ Proposal Templates** - Additional templates
- **30+ Monitoring Metrics** - Performance metrics for all events
- **60+ Team Activity Logs** - Activity tracking
- **8+ Policies** - Additional system policies

## After Running

1. Restart your backend server
2. Refresh the admin dashboard
3. All department views should now show data!

