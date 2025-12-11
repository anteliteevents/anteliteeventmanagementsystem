# Quick Guide: Load Real Data into Your System

## 🚀 Quick Start

### Option 1: Using PowerShell Script (Windows - Easiest)

```powershell
cd database
.\load-data.ps1
```

When prompted, enter your database password.

### Option 2: Using psql Command Line

```bash
# Set password (Windows PowerShell)
$env:PGPASSWORD = 'your_password'

# Run the seed script
psql -h 217.15.163.29 -U antelite_user -d antelite_events -f complete-features-seeds.sql

# Or in one line (Windows)
$env:PGPASSWORD='your_password'; psql -h 217.15.163.29 -U antelite_user -d antelite_events -f complete-features-seeds.sql
```

### Option 3: Using pgAdmin or Adminer (GUI)

1. Open pgAdmin or Adminer
2. Connect to your database:
   - Host: `217.15.163.29`
   - Database: `antelite_events`
   - User: `antelite_user`
   - Password: (your password)
3. Open the file `database/complete-features-seeds.sql`
4. Execute the entire script (F5 or Run button)

## 📊 What Data Will Be Added

After running the script, you'll have:

### ✅ Sales Department
- **4 Events**: Tech Innovation Summit, Digital Marketing Expo, Manufacturing Forum, Finance Summit
- **8+ Booths**: Various sizes and statuses (booked, reserved, available)
- **8 Reservations**: Mix of confirmed and pending

### ✅ Payments Department
- **10 Transactions**: Completed, pending, processing payments
- **8 Invoices**: Paid, pending, sent, draft invoices with tax calculations

### ✅ Costing Department
- **15+ Costs**: Venue, Marketing, Catering, Equipment, Staffing costs
- **15+ Budgets**: Allocated vs spent amounts per category

### ✅ Proposals Department
- **5 Proposals**: Draft, submitted, approved, rejected proposals
- **4 Templates**: Standard, Premium, Quick Quote, Corporate templates

### ✅ Monitoring Department
- **20+ Activities**: Team activity logs (bookings, payments, proposals)
- **9 Metrics**: Sales performance, occupancy rates, activity counts

### ✅ Policies Department
- **8 Policies**: Terms, Privacy, Refund, Cancellation, etc.

## 🔍 Verify Data Loaded

After running the script, check your admin dashboard:

1. **Sales Department** → Should show events, booths, revenue
2. **Payments Department** → Should show transactions and invoices
3. **Costing Department** → Should show costs and budgets
4. **Proposals Department** → Should show proposals and templates
5. **Monitoring Department** → Should show activities and metrics
6. **Policies Department** → Should show all policies

## ⚠️ Important Notes

- **Prerequisites**: Make sure `schema.sql` and `module-tables.sql` have been run first
- **Idempotent**: Safe to run multiple times (won't create duplicates)
- **Dates**: All dates are relative to current date (e.g., "30 days ago")
- **Password**: You'll need your database password to run the script

## 🐛 Troubleshooting

### "relation does not exist"
- Run `schema.sql` and `module-tables.sql` first

### "permission denied"
- Check your database user has INSERT permissions

### "psql: command not found"
- Install PostgreSQL client tools
- Or use pgAdmin/Adminer GUI instead

### Script runs but no data appears
- Check browser console for errors
- Verify API endpoints are working
- Check database connection from backend

## 📝 Database Connection Details

- **Host**: `217.15.163.29`
- **Port**: `5432`
- **Database**: `antelite_events`
- **User**: `antelite_user`
- **Password**: (your password)

---

**Ready to load data?** Run the PowerShell script or use one of the methods above! 🚀

