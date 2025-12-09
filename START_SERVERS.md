# 🚀 How to Start the Servers

## Quick Start (Recommended)

### Option 1: Start Both Servers (PowerShell)

Open PowerShell in the project root and run:

```powershell
# Start Backend (in new window)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"

# Wait a moment, then start Frontend (in new window)
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm start"
```

---

## Manual Start

### 1. Start Backend Server

**Open a terminal/PowerShell window:**

```powershell
cd backend
npm run dev
```

**Or if you prefer npm start:**
```powershell
cd backend
npm start
```

**You should see:**
```
🚀 Server running on port 3001
📡 Socket.io server initialized
🌍 Environment: development
```

**Backend will be available at:** http://localhost:3001

---

### 2. Start Frontend Server

**Open a NEW terminal/PowerShell window:**

```powershell
cd frontend
npm start
```

**You should see:**
```
Compiling...
Compiled successfully!
webpack compiled with 0 warnings
```

**Frontend will be available at:** http://localhost:3000

---

## Verify Servers Are Running

### Check Backend:
- Open browser: http://localhost:3001/health
- Should return: `{"status":"ok","timestamp":"..."}`

### Check Frontend:
- Open browser: http://localhost:3000
- Should show the homepage

---

## Troubleshooting

### Backend won't start?

1. **Check if port 3001 is already in use:**
   ```powershell
   netstat -ano | findstr :3001
   ```

2. **Check database connection:**
   - Make sure PostgreSQL is running
   - Verify `.env` file has correct database credentials

3. **Reinstall dependencies:**
   ```powershell
   cd backend
   npm install
   ```

### Frontend won't start?

1. **Check if port 3000 is already in use:**
   ```powershell
   netstat -ano | findstr :3000
   ```

2. **Clear cache and reinstall:**
   ```powershell
   cd frontend
   Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
   npm install
   npm start
   ```

### Both servers need to run simultaneously

- **Backend** must run on port 3001
- **Frontend** must run on port 3000
- Keep both terminal windows open while developing

---

## Quick Commands Reference

### Start Backend:
```powershell
cd backend && npm run dev
```

### Start Frontend:
```powershell
cd frontend && npm start
```

### Stop Servers:
- Press `Ctrl + C` in each terminal window

---

## Environment Setup

Make sure you have `.env` files configured:

### Backend `.env` (in `backend/` folder):
```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

### Frontend `.env` (in `frontend/` folder):
```
REACT_APP_API_URL=http://localhost:3001
```

---

## Need Help?

If servers still won't start, check:
1. Node.js is installed: `node --version`
2. PostgreSQL is running
3. All dependencies are installed: `npm install` in both folders
4. Ports 3000 and 3001 are not blocked by firewall

