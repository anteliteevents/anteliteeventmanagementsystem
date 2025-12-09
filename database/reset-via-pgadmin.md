# Reset PostgreSQL Password via pgAdmin (Easiest Method)

## Step-by-Step Instructions

### 1. Open pgAdmin

- Launch pgAdmin from Start Menu
- Or search for "pgAdmin" in Windows

### 2. Connect to PostgreSQL Server

- In the left panel, expand "Servers"
- Click on your PostgreSQL server (usually "PostgreSQL 18")
- If it asks for a password:
  - Try leaving it **blank** (press Enter)
  - Or try: `postgres`
  - If neither works, you may need to use the service restart method

### 3. Navigate to Users

- Expand your server
- Expand "Login/Group Roles"
- Find "postgres" user

### 4. Change Password

- **Right-click** on "postgres"
- Select **"Properties"**
- Go to **"Definition"** tab
- Enter your **new password** in the "Password" field
- **Important:** Use a simple password without special characters like:
  - ✅ `postgres123`
  - ✅ `MyPassword2024`
  - ✅ `Admin123!`
  - ❌ Avoid: `$`, `%`, `&`, backticks
- Click **"Save"**

### 5. Update .env File

- Open `backend/.env`
- Find or add this line:
  ```
  DB_PASSWORD=your_new_password_here
  ```
- **Important:** No quotes, no spaces around the `=`
- Save the file

### 6. Test Connection

Run this command to test:

```powershell
cd backend
node scripts/test-db-connection.js
```

## Alternative: If pgAdmin Also Requires Password

If pgAdmin won't connect without a password, you'll need to:

1. **Run PowerShell as Administrator**

   - Right-click PowerShell → "Run as Administrator"

2. **Run the reset script:**

   ```powershell
   cd C:\xampp\htdocs\events\anteliteeventssystem\database
   .\reset-password-simple.ps1
   ```

3. **When prompted for password**, use something simple like `postgres123`

## Troubleshooting

### If pgAdmin won't connect:

- The server might be configured to require a password
- Use the PowerShell script method (as Administrator)

### If password still doesn't work:

- Check `.env` file format (no quotes, no spaces)
- Make sure you're using the exact password you set
- Try a password without any special characters first

## After Resetting

Once the password is reset:

1. Update `backend/.env` with the new password
2. Test connection: `node backend/scripts/test-db-connection.js`
3. Run enhanced seeds: `node backend/scripts/seed-enhanced-data.js`
