# Load All Features Data - Instructions

This guide explains how to load comprehensive demo data for all features in the Ant Elite Events System.

## Overview

The `complete-features-seeds.sql` script adds realistic demo data for:
- ✅ **Sales Department**: Events, Booths, Reservations
- ✅ **Payments Department**: Transactions, Invoices
- ✅ **Costing Department**: Costs, Budgets
- ✅ **Proposals Department**: Proposals, Proposal Templates
- ✅ **Monitoring Department**: Team Activity, Monitoring Metrics
- ✅ **Policies Department**: Policies

## Prerequisites

1. Database schema must be created (`schema.sql`)
2. Module tables must be created (`module-tables.sql`)
3. You have access to the PostgreSQL database

## Loading the Data

### Option 1: Using psql (Recommended)

```bash
# Connect to your database
PGPASSWORD='your_password' psql -h 217.15.163.29 -U antelite_user -d antelite_events

# Run the seed script
\i complete-features-seeds.sql

# Or directly:
PGPASSWORD='your_password' psql -h 217.15.163.29 -U antelite_user -d antelite_events -f complete-features-seeds.sql
```

### Option 2: Using SSH (if you have SSH access)

```bash
# SSH into your server
ssh root@217.15.163.29

# Navigate to database directory (if you uploaded the file)
cd /path/to/database

# Run the script
sudo -u postgres psql -d antelite_events -f complete-features-seeds.sql
```

### Option 3: Using pgAdmin or Adminer

1. Open your database management tool (pgAdmin, Adminer, etc.)
2. Connect to the database
3. Open the `complete-features-seeds.sql` file
4. Execute the entire script

## What Data Will Be Created

### Events (4 events)
- Tech Innovation Summit 2025 (published)
- Digital Marketing Expo 2025 (active)
- Manufacturing Excellence Forum (published)
- Finance & FinTech Summit (published)

### Users (5+ exhibitors + admin)
- Admin user
- Multiple exhibitor accounts

### Booths (8 booths)
- Various sizes (small, medium, large, xlarge)
- Different statuses (booked, reserved, available)
- Distributed across events

### Reservations (8 reservations)
- Mix of confirmed, pending statuses
- Linked to booths and exhibitors

### Transactions (10 transactions)
- Mix of completed, pending, processing statuses
- Various payment methods (Stripe, bank transfer)
- Different amounts

### Invoices (8 invoices)
- Mix of paid, pending, sent, draft statuses
- Includes tax calculations
- Various due dates

### Costs (15+ cost entries)
- Distributed across all events
- Categories: Venue, Marketing, Catering, Equipment, Staffing, Transportation
- Mix of paid, approved, pending statuses

### Budgets (15+ budget entries)
- One budget per category per event
- Shows allocated vs spent amounts

### Proposals (5 proposals)
- Mix of draft, submitted, approved, rejected statuses
- Linked to different events and exhibitors

### Proposal Templates (4 templates)
- Standard, Premium, Quick Quote, Corporate Package

### Team Activity (20+ activities)
- Booth bookings
- Payment processing
- Proposal submissions/approvals
- Cost management
- Event updates

### Monitoring Metrics (9 metrics)
- Sales performance metrics
- Booth occupancy rates
- Team activity counts

### Policies (8 policies)
- Terms and Conditions
- Privacy Policy
- Refund Policy
- Cancellation Policy
- Booth Assignment Policy
- Payment Terms
- Code of Conduct
- Data Protection Policy

## Verification

After running the script, you should see a summary like:

```
status                    | total_events | total_users | total_booths | ...
--------------------------+--------------+-------------+--------------+----
Data seeding completed!   | 4            | 6+          | 8+           | ...
```

## Notes

- The script uses `ON CONFLICT DO NOTHING` to prevent errors if data already exists
- It will use existing events/users if they exist, or create new ones
- All dates are relative to the current date (e.g., `NOW() - INTERVAL '30 days'`)
- The script is idempotent - safe to run multiple times

## Troubleshooting

### Error: "relation does not exist"
- Make sure you've run `schema.sql` and `module-tables.sql` first

### Error: "duplicate key value"
- The script handles conflicts, but if you see this, some data may already exist
- You can safely ignore or manually remove conflicting data

### Error: "permission denied"
- Make sure your database user has INSERT permissions
- Check that you're connected to the correct database

## Next Steps

After loading the data:
1. ✅ Refresh your admin dashboard
2. ✅ Check each department view (Sales, Payments, Costing, Proposals, Monitoring, Policies)
3. ✅ Verify data is displaying correctly
4. ✅ Test filtering and sorting features

---

**Status:** ✅ Ready to use  
**Last Updated:** December 2024

