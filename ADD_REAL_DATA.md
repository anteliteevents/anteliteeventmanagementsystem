# Add Real Data to Your System - Quick Guide

## 🎯 Goal
Load comprehensive demo data so all department views show real information instead of empty states.

## ✅ What You'll Get

After loading the data, you'll see:

### Sales Department
- ✅ 4 Events (Tech Innovation Summit, Digital Marketing Expo, Manufacturing Forum, Finance Summit)
- ✅ 8+ Booths (various sizes: small, medium, large, xlarge)
- ✅ 8 Reservations (confirmed and pending)
- ✅ Revenue calculations
- ✅ Occupancy rates

### Payments Department
- ✅ 10 Transactions (completed, pending, processing)
- ✅ 8 Invoices (paid, pending, sent, draft)
- ✅ Payment statistics
- ✅ Revenue totals

### Costing Department
- ✅ 15+ Cost entries (Venue, Marketing, Catering, Equipment, Staffing)
- ✅ 15+ Budget entries (allocated vs spent)
- ✅ Budget tracking per event
- ✅ Cost breakdowns

### Proposals Department
- ✅ 5 Proposals (draft, submitted, approved, rejected)
- ✅ 4 Proposal Templates (Standard, Premium, Quick Quote, Corporate)
- ✅ Proposal status tracking

### Monitoring Department
- ✅ 20+ Team Activities (bookings, payments, proposals, updates)
- ✅ 9 Monitoring Metrics (sales performance, occupancy rates)
- ✅ Top performers list
- ✅ Activity timeline

### Policies Department
- ✅ 8 Policies (Terms, Privacy, Refund, Cancellation, etc.)
- ✅ Policy categories
- ✅ Active/inactive status

## 🚀 How to Load the Data

### Method 1: PowerShell Script (Recommended for Windows)

1. Open PowerShell in the `database` folder
2. Run:
   ```powershell
   .\load-data.ps1
   ```
3. Enter your database password when prompted
4. Wait for the "Data loaded successfully!" message

### Method 2: Batch File (Windows)

1. Double-click `database/load-data.bat`
2. Enter your database password when prompted
3. Wait for completion

### Method 3: Command Line (Any OS)

```bash
# Windows PowerShell
$env:PGPASSWORD='your_password'
psql -h 217.15.163.29 -U antelite_user -d antelite_events -f database/complete-features-seeds.sql

# Linux/Mac
PGPASSWORD='your_password' psql -h 217.15.163.29 -U antelite_user -d antelite_events -f database/complete-features-seeds.sql
```

### Method 4: pgAdmin/Adminer (GUI)

1. Open pgAdmin or Adminer
2. Connect to database:
   - Host: `217.15.163.29`
   - Database: `antelite_events`
   - User: `antelite_user`
   - Password: (your password)
3. Open `database/complete-features-seeds.sql`
4. Execute the script (F5 or Run button)

## 📋 Prerequisites

Before loading data, make sure:

1. ✅ Database schema is created (`schema.sql` has been run)
2. ✅ Module tables exist (`module-tables.sql` has been run)
3. ✅ You have database password
4. ✅ PostgreSQL client tools installed (for command line methods)

## 🔍 Verify Data Loaded

After running the script:

1. **Check the output** - You should see a summary table showing counts
2. **Refresh your admin dashboard** - Press F5 or refresh button
3. **Navigate to each department**:
   - Sales Department → Should show events, booths, revenue
   - Payments Department → Should show transactions, invoices
   - Costing Department → Should show costs, budgets
   - Proposals Department → Should show proposals, templates
   - Monitoring Department → Should show activities, metrics
   - Policies Department → Should show all policies

## 🐛 Troubleshooting

### "psql: command not found"
- Install PostgreSQL client tools
- Or use pgAdmin/Adminer GUI instead

### "relation does not exist"
- Run `schema.sql` first
- Then run `module-tables.sql`
- Then run the seed script

### "permission denied"
- Check database user has INSERT permissions
- Verify connection details

### "duplicate key value"
- Script handles conflicts automatically
- Safe to ignore or run again

### Data loads but doesn't show in views
- Check browser console for errors
- Verify API endpoints are working
- Check backend logs for errors
- Make sure backend can connect to database

## 📊 Expected Results

After successful load, you should see:

```
status                    | total_events | total_users | total_booths | ...
--------------------------+--------------+-------------+--------------+----
Data seeding completed!   | 4            | 6+          | 8+           | ...
```

## 🎉 Next Steps

1. ✅ Load the data using one of the methods above
2. ✅ Refresh your admin dashboard
3. ✅ Check each department view
4. ✅ Verify all data is displaying correctly
5. ✅ Test filtering and sorting features

## 📝 Database Connection

- **Host**: `217.15.163.29`
- **Port**: `5432`
- **Database**: `antelite_events`
- **User**: `antelite_user`
- **Password**: (your password)

---

**Ready?** Choose a method above and load your data! 🚀

