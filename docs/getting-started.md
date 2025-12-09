# Getting Started - Launch Your Project Locally

This guide will help you get the Ant Elite Events System running on your local machine.

## 📋 Prerequisites

Before you start, make sure you have installed:

- ✅ **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- ✅ **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ **npm** or **yarn** (comes with Node.js)

### Verify Installations

```bash
# Check Node.js version
node --version
# Should show v18.x.x or higher

# Check npm version
npm --version
# Should show 9.x.x or higher

# Check PostgreSQL version
psql --version
# Should show 14.x or higher
```

---

## 🗄️ Step 1: Setup PostgreSQL Database

> **Windows Users:** See [`docs/windows-setup.md`](windows-setup.md) for detailed Windows-specific instructions if `psql` command doesn't work.

### 1.1 Create Database

**On Windows (using pgAdmin - Recommended):**

1. **Open pgAdmin** (search in Start menu)
2. **Connect to server** (enter password you set during installation)
3. **Right-click "Databases"** → "Create" → "Database"
4. **Name:** `antelite_events`
5. **Click "Save"**

**On Windows (using Command Line):**

```powershell
# If psql is in PATH
psql -U postgres

# Or use full path
& "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres
```

Then run:
```sql
CREATE DATABASE antelite_events;
\q
```

**On Mac/Linux:**

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE antelite_events;

# Create user (optional)
CREATE USER antelite_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE antelite_events TO antelite_user;

# Exit
\q
```

### 1.2 Run Database Schema

**On Windows (using pgAdmin):**

1. Open pgAdmin
2. Right-click `antelite_events` database → "Query Tool"
3. Open `database/schema.sql` in a text editor
4. Copy all contents
5. Paste into Query Tool
6. Click "Execute" (or press F5)

**On Windows (using Command Line):**

```powershell
# Navigate to project root
cd C:\xampp\htdocs\events\anteliteeventssystem

# Run schema (use full path if psql not in PATH)
psql -U postgres -d antelite_events -f database/schema.sql

# Or with full path:
& "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -d antelite_events -f database/schema.sql
```

**On Mac/Linux:**

```bash
# Navigate to project root
cd anteliteeventssystem

# Run schema
psql -U postgres -d antelite_events -f database/schema.sql
```

**What this does:** Creates all the tables (events, booths, reservations, transactions, etc.)

---

## 🔧 Step 2: Setup Backend

### 2.1 Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install all packages
npm install

# This will install:
# - Express (web framework)
# - PostgreSQL driver (pg)
# - Socket.io (real-time)
# - Stripe (payments)
# - JWT (authentication)
# - And more...
```

### 2.2 Create Environment File

Create a `.env` file in the `backend` directory:

**On Windows:**
```powershell
cd backend
# Create file using Notepad
notepad .env
# Or use VS Code: code .env
```

**On Mac/Linux:**
```bash
cd backend
touch .env
```

Open `.env` and add:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=postgres
# Or use: DB_USER=antelite_user
DB_PASSWORD=your_postgres_password

# JWT Secret (generate a random string)
# You can use: openssl rand -hex 32
JWT_SECRET=your_super_secret_jwt_key_change_this

# Stripe Configuration (Test Keys)
# Get from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_your_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Email Configuration (SMTP)
# For Gmail, you need an App Password: https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@anteliteevents.com
```

**Important Notes:**
- Replace `your_postgres_password` with your actual PostgreSQL password
- Get Stripe test keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
- For Gmail, you need to create an [App Password](https://myaccount.google.com/apppasswords)

### 2.3 Test Database Connection

```bash
# Test if you can connect to database
psql -U postgres -d antelite_events

# Or
psql -U antelite_user -d antelite_events

# If connection works, type \q to exit
```

### 2.4 Build TypeScript

```bash
# Build TypeScript to JavaScript
npm run build

# This creates a 'dist' folder with compiled JavaScript
```

### 2.5 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm run build
npm start
```

**You should see:**
```
🚀 Server running on port 3001
📡 Socket.io server initialized
🌍 Environment: development
✅ Database connected
```

**Test the server:**
Open browser: http://localhost:3001/health

You should see: `{"status":"ok","timestamp":"..."}`

---

## 🎨 Step 3: Setup Frontend

### 3.1 Install Dependencies

Open a **new terminal window** (keep backend running):

```bash
# Navigate to frontend directory
cd frontend

# Install all packages
npm install

# This will install:
# - React
# - TypeScript
# - Socket.io client
# - And more...
```

### 3.2 Create Environment File

Create a `.env` file in the `frontend` directory:

**On Windows:**
```powershell
# Create file using Notepad
notepad .env
# Or use VS Code: code .env
```

**On Mac/Linux:**
```bash
touch .env
```

Open `.env` and add:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:3001

# Stripe Publishable Key (Test Key)
# Get from: https://dashboard.stripe.com/test/apikeys
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Socket.io URL
REACT_APP_SOCKET_URL=http://localhost:3001
```

### 3.3 Start Frontend Development Server

```bash
# Start React development server
npm start

# This will:
# - Start on http://localhost:3000
# - Open browser automatically
# - Hot reload on file changes
```

**You should see:**
```
Compiled successfully!

You can now view antelite-events-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## 🚀 Step 4: Verify Everything Works

### 4.1 Check Backend

1. Open: http://localhost:3001/health
2. Should see: `{"status":"ok","timestamp":"..."}`

### 4.2 Check Frontend

1. Open: http://localhost:3000
2. Should see your React app

### 4.3 Test API Connection

Open browser console (F12) and check for any connection errors.

---

## 🧪 Step 5: Test with Sample Data (Optional)

### 5.1 Add Sample Event

You can use a database tool (pgAdmin, DBeaver) or command line:

```sql
-- Insert a test event
INSERT INTO events (name, description, start_date, end_date, venue, status)
VALUES (
  'Tech Expo 2024',
  'Annual technology exhibition',
  '2024-06-01 09:00:00',
  '2024-06-03 18:00:00',
  'Convention Center',
  'published'
);

-- Get the event ID (you'll need it)
SELECT id FROM events WHERE name = 'Tech Expo 2024';
```

### 5.2 Add Sample Booths

```sql
-- Replace 'your-event-id' with the actual event ID from above
INSERT INTO booths (event_id, booth_number, size, price, status, location_x, location_y)
VALUES 
  ('your-event-id', 'A1', 'small', 500.00, 'available', 10, 10),
  ('your-event-id', 'A2', 'medium', 1000.00, 'available', 20, 10),
  ('your-event-id', 'A3', 'large', 1500.00, 'available', 30, 10);
```

---

## 📝 Common Issues & Solutions

### Issue: "Cannot connect to database"

**Solution:**
- Check PostgreSQL is running: `systemctl status postgresql` (Linux) or check Services (Windows)
- Verify database credentials in `.env`
- Test connection: `psql -U postgres -d antelite_events`

### Issue: "Port 3001 already in use"

**Solution:**
```bash
# Find what's using the port
# Windows
netstat -ano | findstr :3001

# Mac/Linux
lsof -i :3001

# Kill the process or change PORT in .env
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: "Stripe errors"

**Solution:**
- Make sure you're using **test keys** (start with `sk_test_` and `pk_test_`)
- Get keys from: https://dashboard.stripe.com/test/apikeys

### Issue: "Email not sending"

**Solution:**
- For Gmail, use an **App Password** (not your regular password)
- Create one: https://myaccount.google.com/apppasswords
- Make sure 2FA is enabled on your Google account

### Issue: "CORS errors"

**Solution:**
- Check `CORS_ORIGIN` in backend `.env` matches frontend URL
- Should be: `CORS_ORIGIN=http://localhost:3000`

---

## 🎯 Quick Start Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `antelite_events` created
- [ ] Database schema run (`schema.sql`)
- [ ] Backend dependencies installed (`npm install` in `backend/`)
- [ ] Backend `.env` file created with correct values
- [ ] Backend builds successfully (`npm run build`)
- [ ] Backend server running (`npm run dev`)
- [ ] Backend health check works (http://localhost:3001/health)
- [ ] Frontend dependencies installed (`npm install` in `frontend/`)
- [ ] Frontend `.env` file created
- [ ] Frontend server running (`npm start`)
- [ ] Frontend loads (http://localhost:3000)

---

## 🔄 Development Workflow

### Running Both Servers

You need **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Making Changes

- **Backend changes**: Server auto-reloads (thanks to `ts-node-dev`)
- **Frontend changes**: Browser auto-refreshes (React hot reload)

### Viewing Logs

**Backend logs:** Check the terminal where you ran `npm run dev`

**Frontend logs:** Check browser console (F12)

---

## 🧪 Testing the API

### Using Browser

1. Open: http://localhost:3001/health
2. Should see JSON response

### Using curl

```bash
# Health check
curl http://localhost:3001/health

# Get available booths (replace eventId)
curl "http://localhost:3001/api/booths/available?eventId=your-event-id"
```

### Using Postman or Insomnia

1. Create new request
2. URL: `http://localhost:3001/api/booths/available?eventId=xxx`
3. Method: GET
4. Send request

---

## 📚 Next Steps

Once everything is running:

1. **Explore the API**: Check `docs/api/booth-sales-api.md`
2. **Test Stripe**: Use test card `4242 4242 4242 4242`
3. **Test Socket.io**: Open multiple browser tabs to see real-time updates
4. **Read the code**: Understand how everything connects
5. **Make changes**: Experiment and learn!

---

## 🆘 Need Help?

- Check the logs for error messages
- Verify all environment variables are set
- Make sure PostgreSQL is running
- Ensure ports 3000 and 3001 are available
- Review the troubleshooting section above

---

## 🎉 Success!

If you see:
- ✅ Backend running on port 3001
- ✅ Frontend running on port 3000
- ✅ No errors in console
- ✅ Health check returns OK

**Congratulations! Your project is running!** 🚀

Now you can start developing and testing your booth sales system!

