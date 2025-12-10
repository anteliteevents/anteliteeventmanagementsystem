# Corrected Render Environment Variables

**Issue Found:**
1. ❌ Wrong password: `ASDasd12345$$$%%%` (old password)
2. ❌ Wrong password in `DATABASE_URL`
3. ❌ `CORS_ORIGIN` has formatting issue (`\nPORT=3001` at end)

**Correct Password:** `bkmgjAsoc6AmblMO`

---

## ✅ Corrected Environment Variables

**Copy and paste these EXACTLY into Render:**

```
CORS_ORIGIN=https://anteliteeventssystem.vercel.app,https://anteliteeventssystem-2s8af5wgz-anteliteevents-projects.vercel.app,http://localhost:3000
PORT=3001
DATABASE_URL=postgresql://antelite_user:bkmgjAsoc6AmblMO@217.15.163.29:5432/antelite_events
DB_HOST=217.15.163.29
DB_NAME=antelite_events
DB_PASSWORD=bkmgjAsoc6AmblMO
DB_PORT=5432
DB_SSL=false
DB_USER=antelite_user
JWT_SECRET=e1df7e2f1f41cee5ba0ff6b6170ec0daf766751e05447304654d0cfc2a618e7aa3ea517cfe8aba9b76b6881465220b9f4e813f19706a3346eb496aaa80162020
NODE_ENV=production
```

---

## 🔧 What to Change in Render

### 1. Fix DB_PASSWORD
- **Current:** `ASDasd12345$$$%%%`
- **Change to:** `bkmgjAsoc6AmblMO`

### 2. Fix DATABASE_URL
- **Current:** `postgresql://antelite_user:ASDasd12345$$$%%%@217.15.163.29:5432/antelite_events`
- **Change to:** `postgresql://antelite_user:bkmgjAsoc6AmblMO@217.15.163.29:5432/antelite_events`

### 3. Fix CORS_ORIGIN
- **Current:** `"https://anteliteeventssystem.vercel.app,https://anteliteeventssystem-2s8af5wgz-anteliteevents-projects.vercel.app,http://localhost:3000\nPORT=3001"`
- **Change to:** `https://anteliteeventssystem.vercel.app,https://anteliteeventssystem-2s8af5wgz-anteliteevents-projects.vercel.app,http://localhost:3000`
- **Remove:** The quotes and the `\nPORT=3001` part

### 4. Add NODE_ENV (if missing)
- **Add:** `NODE_ENV=production`

---

## 📋 Step-by-Step Fix in Render

1. **Go to:** Render Dashboard → Your Service → Environment tab

2. **Update DB_PASSWORD:**
   - Find `DB_PASSWORD`
   - Click Edit
   - Change value to: `bkmgjAsoc6AmblMO`
   - Save

3. **Update DATABASE_URL:**
   - Find `DATABASE_URL`
   - Click Edit
   - Change to: `postgresql://antelite_user:bkmgjAsoc6AmblMO@217.15.163.29:5432/antelite_events`
   - Save

4. **Fix CORS_ORIGIN:**
   - Find `CORS_ORIGIN`
   - Click Edit
   - Change to: `https://anteliteeventssystem.vercel.app,https://anteliteeventssystem-2s8af5wgz-anteliteevents-projects.vercel.app,http://localhost:3000`
   - **Remove quotes and the `\nPORT=3001` part**
   - Save

5. **Add NODE_ENV (if not exists):**
   - Click "Add Environment Variable"
   - Key: `NODE_ENV`
   - Value: `production`
   - Save

6. **Save All Changes**

7. **Redeploy:**
   - Go to **Manual Deploy** tab
   - Click **Deploy latest commit**
   - Wait for deployment

---

## ✅ After Updating

### Check Render Logs

**Look for:**
```
🔌 Database Config: {
  host: '217.15.163.29',
  port: 5432,
  database: 'antelite_events',
  user: 'antelite_user',
  ssl: false,
  hasPassword: true
}
✅ Database connected
```

**Should NOT see:**
- `password authentication failed`
- `ECONNREFUSED`
- Connection errors

### Test Login

1. Go to: https://anteliteeventssystem.vercel.app/login
2. Enter:
   - Email: `admin88759551@antelite.digital`
   - Password: `94lUYIQ1csnXs1x`
3. Click Login

**Should work now!**

---

## 🔍 Key Changes Summary

| Variable | Old Value | New Value |
|----------|-----------|-----------|
| `DB_PASSWORD` | `ASDasd12345$$$%%%` | `bkmgjAsoc6AmblMO` |
| `DATABASE_URL` | `...ASDasd12345$$$%%%...` | `...bkmgjAsoc6AmblMO...` |
| `CORS_ORIGIN` | `"...\nPORT=3001"` | `https://...` (no quotes, no \n) |

---

**Priority:** Update these 3 variables, then redeploy!

