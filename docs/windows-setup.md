# Windows Setup Guide - PostgreSQL & Project Launch

This guide is specifically for Windows users to get PostgreSQL working and launch the project.

## 🔍 Check if PostgreSQL is Installed

### Method 1: Check via Services

1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Look for "postgresql" services
4. If you see them, PostgreSQL is installed but not in PATH

### Method 2: Check Installation Directory

PostgreSQL is usually installed in:
- `C:\Program Files\PostgreSQL\14\` (or version number)
- `C:\Program Files\PostgreSQL\15\`
- `C:\Program Files (x86)\PostgreSQL\`

---

## 📥 Option 1: Install PostgreSQL (If Not Installed)

### Step 1: Download PostgreSQL

1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Download **PostgreSQL 14 or 15** (recommended)

### Step 2: Run Installer

1. Run the downloaded `.exe` file
2. **Important:** During installation:
   - ✅ Check "Add PostgreSQL bin directory to PATH" (IMPORTANT!)
   - ✅ Remember the password you set for `postgres` user
   - ✅ Note the port (default is 5432)
   - ✅ Choose installation directory (default is fine)

### Step 3: Verify Installation

**Close and reopen PowerShell**, then:

```powershell
# Check PostgreSQL version
psql --version

# Should show: psql (PostgreSQL) 14.x or 15.x
```

If it still doesn't work, see "Add to PATH Manually" below.

---

## 🔧 Option 2: Add PostgreSQL to PATH (If Already Installed)

### Find PostgreSQL Installation

```powershell
# Check common locations
Test-Path "C:\Program Files\PostgreSQL\14\bin\psql.exe"
Test-Path "C:\Program Files\PostgreSQL\15\bin\psql.exe"
Test-Path "C:\Program Files (x86)\PostgreSQL\14\bin\psql.exe"
```

### Add to PATH Manually

1. **Find PostgreSQL bin folder:**
   - Usually: `C:\Program Files\PostgreSQL\14\bin\`
   - Or: `C:\Program Files\PostgreSQL\15\bin\`

2. **Add to PATH:**
   - Press `Win + X` → System → Advanced system settings
   - Click "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\Program Files\PostgreSQL\14\bin` (or your version)
   - Click "OK" on all windows

3. **Restart PowerShell** (close and reopen)

4. **Test:**
   ```powershell
   psql --version
   ```

---

## 🗄️ Setup Database (Windows)

### Method 1: Using Command Line (Recommended)

```powershell
# Navigate to PostgreSQL bin (if not in PATH)
cd "C:\Program Files\PostgreSQL\14\bin"

# Connect to PostgreSQL
.\psql.exe -U postgres

# You'll be prompted for password (the one you set during installation)
```

**Once connected, run:**

```sql
-- Create database
CREATE DATABASE antelite_events;

-- Create user (optional, you can use postgres for development)
CREATE USER antelite_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE antelite_events TO antelite_user;

-- Exit
\q
```

### Method 2: Using pgAdmin (GUI - Easier)

1. **Open pgAdmin:**
   - Search "pgAdmin" in Start menu
   - Or go to: `C:\Program Files\PostgreSQL\14\bin\pgAdmin4.exe`

2. **Connect to Server:**
   - Enter password when prompted (the one you set during installation)

3. **Create Database:**
   - Right-click "Databases" → "Create" → "Database"
   - Name: `antelite_events`
   - Click "Save"

4. **Run Schema:**
   - Right-click `antelite_events` database → "Query Tool"
   - Open `database/schema.sql` file
   - Copy all contents
   - Paste into Query Tool
   - Click "Execute" (F5)

---

## 🚀 Launch Project on Windows

### Step 1: Setup Backend

```powershell
# Navigate to backend
cd C:\xampp\htdocs\events\anteliteeventssystem\backend

# Install dependencies
npm install

# Create .env file
# Use Notepad or VS Code to create .env file
notepad .env
```

**Add to `.env`:**
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
JWT_SECRET=your_random_secret_here
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CORS_ORIGIN=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM=noreply@anteliteevents.com
```

```powershell
# Build TypeScript
npm run build

# Start backend
npm run dev
```

### Step 2: Setup Frontend (New PowerShell Window)

```powershell
# Open new PowerShell window
cd C:\xampp\htdocs\events\anteliteeventssystem\frontend

# Install dependencies
npm install

# Create .env file
notepad .env
```

**Add to `.env`:**
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
REACT_APP_SOCKET_URL=http://localhost:3001
```

```powershell
# Start frontend
npm start
```

---

## 🧪 Test Database Connection

### Using Command Line

```powershell
# If PostgreSQL is in PATH
psql -U postgres -d antelite_events

# Or using full path
& "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -d antelite_events
```

### Using pgAdmin

1. Open pgAdmin
2. Expand "Servers" → "PostgreSQL 14"
3. Expand "Databases"
4. You should see `antelite_events`

---

## 🔍 Troubleshooting

### Issue: "psql is not recognized"

**Solution:**
1. Find PostgreSQL installation: `C:\Program Files\PostgreSQL\14\bin\`
2. Add to PATH (see instructions above)
3. Restart PowerShell

**Or use full path:**
```powershell
& "C:\Program Files\PostgreSQL\14\bin\psql.exe" --version
```

### Issue: "Password authentication failed"

**Solution:**
- Use the password you set during PostgreSQL installation
- Default user is `postgres`
- If you forgot password, you may need to reset it

### Issue: "Database does not exist"

**Solution:**
```powershell
# Connect to PostgreSQL
psql -U postgres

# List databases
\l

# Create database if missing
CREATE DATABASE antelite_events;
```

### Issue: "Port 5432 already in use"

**Solution:**
- PostgreSQL is already running (this is good!)
- Check Services: `services.msc`
- Look for "postgresql-x64-14" service

### Issue: "Cannot connect to database" from Node.js

**Solution:**
1. Check PostgreSQL service is running:
   ```powershell
   Get-Service -Name "*postgresql*"
   ```

2. Check `.env` file has correct credentials:
   - `DB_USER=postgres`
   - `DB_PASSWORD=your_actual_password`
   - `DB_HOST=localhost`
   - `DB_PORT=5432`

3. Test connection manually:
   ```powershell
   psql -U postgres -d antelite_events
   ```

---

## 📝 Quick Reference Commands

### PostgreSQL Commands (Windows)

```powershell
# Connect to PostgreSQL
psql -U postgres

# Or with full path
& "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres

# Connect to specific database
psql -U postgres -d antelite_events

# Run SQL file
psql -U postgres -d antelite_events -f database/schema.sql

# List databases
psql -U postgres -c "\l"

# List tables
psql -U postgres -d antelite_events -c "\dt"
```

### Project Commands

```powershell
# Backend
cd backend
npm install
npm run build
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm start
```

---

## ✅ Verification Checklist

- [ ] PostgreSQL installed
- [ ] `psql --version` works (or full path works)
- [ ] PostgreSQL service is running
- [ ] Database `antelite_events` created
- [ ] Schema run successfully (`database/schema.sql`)
- [ ] Backend `.env` file created with correct database credentials
- [ ] Backend dependencies installed
- [ ] Backend builds successfully
- [ ] Backend runs without errors
- [ ] Frontend `.env` file created
- [ ] Frontend dependencies installed
- [ ] Frontend runs without errors

---

## 🎯 Next Steps

Once everything is running:

1. **Test Backend:** http://localhost:3001/health
2. **Test Frontend:** http://localhost:3000
3. **Check Logs:** Look at terminal output for any errors
4. **Read API Docs:** `docs/api/booth-sales-api.md`

---

## 💡 Tips for Windows Users

1. **Use pgAdmin for database management** - Much easier than command line
2. **Keep PowerShell windows open** - One for backend, one for frontend
3. **Use VS Code** - Better for editing `.env` files and code
4. **Check Windows Firewall** - May block PostgreSQL connections
5. **Use full paths** - If `psql` doesn't work, use full path to `psql.exe`

---

## 🆘 Still Having Issues?

1. **Check PostgreSQL is running:**
   ```powershell
   Get-Service -Name "*postgresql*"
   ```

2. **Check if port 5432 is in use:**
   ```powershell
   netstat -ano | findstr :5432
   ```

3. **View PostgreSQL logs:**
   - Usually in: `C:\Program Files\PostgreSQL\14\data\log\`

4. **Reinstall PostgreSQL:**
   - Uninstall from Control Panel
   - Reinstall with "Add to PATH" checked

Good luck! 🚀

