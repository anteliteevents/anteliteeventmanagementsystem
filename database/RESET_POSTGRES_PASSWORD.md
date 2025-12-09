# How to Reset PostgreSQL Password

## Method 1: Using pgAdmin (Easiest)

1. Open **pgAdmin**
2. Connect to your PostgreSQL server
3. Right-click on the server → **Properties**
4. Go to **Connection** tab
5. Change the password there
6. Update your `.env` file with the new password

## Method 2: Using psql Command Line

1. Open PowerShell as Administrator
2. Navigate to PostgreSQL bin directory:

   ```powershell
   cd "C:\Program Files\PostgreSQL\18\bin"
   ```

   (Adjust version number if different)

3. Connect to PostgreSQL:

   ```powershell
   .\psql.exe -U postgres
   ```

   (It might prompt for password - try common defaults like `postgres` or leave blank)

4. Once connected, change password:

   ```sql
   ALTER USER postgres WITH PASSWORD 'your_new_password';
   ```

5. Update your `.env` file:
   ```
   DB_PASSWORD=your_new_password
   ```

## Method 3: Edit pg_hba.conf (If you can't remember password)

1. Find `pg_hba.conf` file (usually in `C:\Program Files\PostgreSQL\18\data\`)
2. Open it in a text editor (as Administrator)
3. Find the line:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```
4. Change `scram-sha-256` to `trust`:
   ```
   host    all             all             127.0.0.1/32            trust
   ```
5. Restart PostgreSQL service
6. Connect without password and reset it using Method 2
7. Change `trust` back to `scram-sha-256` for security
8. Restart PostgreSQL service again

## Method 4: Check Windows Service

If PostgreSQL is running as a Windows service, you might be able to see connection details:

1. Open **Services** (Win+R → `services.msc`)
2. Find **postgresql-x64-18** (or similar)
3. Check properties for connection info

## After Resetting

1. Update `backend/.env`:

   ```
   DB_PASSWORD=your_new_password
   ```

2. Test connection:

   ```powershell
   psql -U postgres -d antelite_events
   ```

3. Run the enhanced seeds:
   ```powershell
   node backend/scripts/seed-enhanced-data.js
   ```
