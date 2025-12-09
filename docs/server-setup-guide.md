# Complete Server Setup Guide

This guide will walk you through setting up a production server for your Ant Elite Events System from scratch.

## 🎯 What We'll Do

1. Choose and create a VPS
2. Initial server setup
3. Install Node.js, PostgreSQL, Nginx
4. Deploy your application
5. Setup SSL (HTTPS)
6. Configure firewall
7. Test everything

**Estimated Time:** 2-3 hours (first time)

---

## Step 1: Choose Your Hosting Provider

### Recommended: Contabo VPS ⭐

**Why Contabo?**

- ✅ Very affordable (€4-8/month)
- ✅ Good performance
- ✅ Full control
- ✅ Perfect for learning

**Plans:**

- **VPS S**: €4-6/month - 4 vCPU, 8GB RAM (good for testing)
- **VPS M**: €8-10/month - 6 vCPU, 16GB RAM (recommended for production)

**Alternative Options:**

- **DigitalOcean**: $6-12/month - Great tutorials
- **Railway.app**: $0-5/month - Easiest (managed)
- **AWS EC2**: Pay-as-you-go - Most complex

**For this guide, we'll use Contabo**, but steps are similar for other VPS providers.

---

## Step 2: Create Your VPS

### 2.1 Sign Up for Contabo

1. Go to: https://contabo.com
2. Click "Sign Up" (top right)
3. Create account with email
4. Verify email

### 2.2 Order VPS

1. Click "VPS" in menu
2. Choose **VPS S** or **VPS M**
3. Select **Ubuntu 22.04 LTS** (most common, best for learning)
4. Choose data center location (closest to you)
5. Select billing period (monthly recommended)
6. Complete payment

### 2.3 Get Server Details

After purchase, you'll receive:

- **Server IP Address** (e.g., 123.45.67.89)
- **Root Password** (save this securely!)
- **SSH Access Instructions**

**Save these details!** You'll need them.

---

## Step 3: Connect to Your Server

### 3.1 Connect via SSH

**On Windows:**

**Option A: PowerShell (Windows 10/11)**

```powershell
ssh root@your_server_ip
# Enter password when prompted
```

**Option B: PuTTY (if PowerShell doesn't work)**

1. Download PuTTY: https://www.putty.org/
2. Enter server IP
3. Port: 22
4. Click "Open"
5. Login: `root`
6. Enter password

**On Mac/Linux:**

```bash
ssh root@your_server_ip
# Enter password when prompted
```

**First time connecting?** You'll see a security warning - type `yes` to continue.

### 3.2 Verify Connection

You should see something like:

```
Welcome to Ubuntu 22.04 LTS
root@your-server:~#
```

**Congratulations!** You're now connected to your server! 🎉

---

## Step 4: Initial Server Setup

### 4.1 Update System

```bash
# Update package list
apt update

# Upgrade installed packages
apt upgrade -y

# This might take 5-10 minutes
```

**What this does:** Gets latest security updates and bug fixes.

### 4.2 Install Essential Tools

```bash
# Install basic tools
apt install -y curl wget git nano ufw

# Verify installations
curl --version
git --version
```

**What these do:**

- `curl`: Download files
- `wget`: Another download tool
- `git`: Version control (to clone your code)
- `nano`: Simple text editor
- `ufw`: Firewall (we'll configure later)

---

## Step 5: Install Node.js

### 5.1 Add Node.js Repository

```bash
# Download NodeSource setup script
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# This adds Node.js repository to your system
```

### 5.2 Install Node.js

```bash
# Install Node.js
apt install -y nodejs

# Verify installation
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x
```

**Test it:**

```bash
# Try running Node.js
node
# Type: console.log("Hello from Node.js!")
# Press Ctrl+C twice to exit
```

✅ **Node.js is now installed!**

---

## Step 6: Install PostgreSQL

### 6.1 Install PostgreSQL

```bash
# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Check if it's running
systemctl status postgresql
```

**What this does:** Installs PostgreSQL database server.

### 6.2 Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# Now you're in PostgreSQL command line
# Create database
CREATE DATABASE antelite_events;

# Create user with password
CREATE USER antelite_user WITH PASSWORD 'your_strong_password_here';

# Give user permissions
GRANT ALL PRIVILEGES ON DATABASE antelite_events TO antelite_user;

# Exit PostgreSQL
\q
```

**Important:** Remember your password! You'll need it for the `.env` file.

### 6.3 Configure PostgreSQL

```bash
# Edit PostgreSQL config
nano /etc/postgresql/14/main/postgresql.conf
```

Find and uncomment (remove #):

```
listen_addresses = 'localhost'
```

Save: Ctrl+O, Enter, Ctrl+X

```bash
# Restart PostgreSQL
systemctl restart postgresql

# Test connection
psql -U antelite_user -d antelite_events
# Enter password, then type \q to exit
```

✅ **PostgreSQL is now installed and configured!**

---

## Step 7: Install Nginx (Web Server)

### 7.1 Install Nginx

```bash
# Install Nginx
apt install -y nginx

# Start Nginx
systemctl start nginx

# Enable Nginx to start on boot
systemctl enable nginx

# Check status
systemctl status nginx
```

### 7.2 Test Nginx

Open your browser and go to: `http://your_server_ip`

You should see "Welcome to nginx!" page.

**If you see this, Nginx is working!** ✅

---

## Step 8: Install PM2 (Process Manager)

### 8.1 Install PM2

```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
```

**What PM2 does:**

- Keeps your Node.js app running
- Restarts app if it crashes
- Manages logs
- Can start app on server reboot

### 8.2 Setup PM2 to Start on Boot

```bash
# Generate startup script
pm2 startup

# You'll see a command like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root

# Copy and run that command (it will be shown to you)
# Then save PM2 configuration
pm2 save
```

✅ **PM2 is now installed and configured!**

---

## Step 9: Deploy Your Application

### 9.1 Upload Your Code

**Option A: Using Git (Recommended)**

```bash
# Create app directory
mkdir -p /var/www/antelite
cd /var/www/antelite

# Clone your repository
git clone https://github.com/yourusername/anteliteeventssystem.git .

# If private repo, you'll need to authenticate
```

**Option B: Using SCP (from your local machine)**

On your local machine:

```bash
# Windows PowerShell or Mac/Linux terminal
scp -r ./anteliteeventssystem root@your_server_ip:/var/www/
```

Then on server:

```bash
cd /var/www/anteliteeventssystem
```

### 9.2 Install Dependencies

```bash
cd /var/www/antelite/backend

# Install all npm packages
npm install

# This will take a few minutes
```

### 9.3 Build TypeScript

```bash
# Build TypeScript to JavaScript
npm run build

# This creates a 'dist' folder with compiled JavaScript
```

### 9.4 Create Environment File

```bash
# Create .env file
nano .env
```

Paste this (replace with your actual values):

```env
PORT=3001
NODE_ENV=production

# Database (use localhost since it's on same server)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=antelite_user
DB_PASSWORD=your_strong_password_here

# JWT Secret (generate a strong random string)
# You can use: openssl rand -hex 32
JWT_SECRET=your_super_secret_jwt_key_use_openssl_rand_hex_32

# Stripe (use LIVE keys in production)
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CORS (your frontend domain)
CORS_ORIGIN=https://yourdomain.com

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@yourdomain.com
```

**Generate JWT Secret:**

```bash
openssl rand -hex 32
# Copy the output to JWT_SECRET in .env
```

Save: Ctrl+O, Enter, Ctrl+X

### 9.5 Run Database Migrations

```bash
# Run your database schema
psql -U antelite_user -d antelite_events -f ../../database/schema.sql

# Enter password when prompted
```

**What this does:** Creates all your database tables.

### 9.6 Create PM2 Configuration

```bash
# Create PM2 config file
nano ecosystem.config.js
```

Paste this:

```javascript
module.exports = {
  apps: [
    {
      name: "antelite-backend",
      script: "./dist/server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
  ],
};
```

Save and create logs directory:

```bash
mkdir -p logs
```

### 9.7 Start Your Application

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs antelite-backend

# Save PM2 configuration
pm2 save
```

**Your app is now running!** 🎉

Test it:

```bash
# Test locally on server
curl http://localhost:3001/health
```

You should see: `{"status":"ok","timestamp":"..."}`

---

## Step 10: Configure Nginx

### 10.1 Create Nginx Configuration

```bash
# Create Nginx config
nano /etc/nginx/sites-available/antelite
```

Paste this (replace `your_domain.com` with your domain or IP):

```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;

    # Increase body size for uploads
    client_max_body_size 10M;

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io WebSocket
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001;
    }
}
```

Save and enable:

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/antelite /etc/nginx/sites-enabled/

# Remove default site (optional)
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# If test passes, restart Nginx
systemctl restart nginx
```

**What this does:**

- Routes `/api/*` requests to your Node.js app
- Handles WebSocket connections for Socket.io
- Proxies requests from port 80 to port 3001

### 10.2 Test Nginx Configuration

```bash
# Test configuration
nginx -t

# Should see: "syntax is ok" and "test is successful"
```

---

## Step 11: Setup SSL (HTTPS)

### 11.1 Install Certbot

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx
```

**What Certbot does:** Automatically gets and renews SSL certificates from Let's Encrypt (free!)

### 11.2 Get SSL Certificate

**If you have a domain:**

1. **Point your domain to your server:**

   - Go to your domain registrar
   - Add A record:
     - Name: `@` (or leave blank)
     - Type: `A`
     - Value: Your server IP address
     - TTL: 3600

2. **Wait for DNS propagation** (5-30 minutes)

   - Check: https://www.whatsmydns.net/

3. **Get SSL certificate:**
   ```bash
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

**Follow the prompts:**

- Enter your email
- Agree to terms
- Choose to redirect HTTP to HTTPS (recommended)

**If you only have IP address:**

- You can't use SSL with just an IP
- Consider getting a domain (they're cheap, ~$10/year)
- Or use a service like DuckDNS (free subdomain)

### 11.3 Test Auto-Renewal

```bash
certbot renew --dry-run
```

Certbot automatically renews certificates, but you can test it.

✅ **SSL is now configured!**

---

## Step 12: Configure Firewall

### 12.1 Setup UFW (Firewall)

```bash
# Install UFW (if not already installed)
apt install -y ufw

# Allow SSH (IMPORTANT - do this first!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

**What this does:** Protects your server by only allowing necessary ports.

**Important:** Always allow SSH (port 22) first, or you might lock yourself out!

✅ **Firewall is now configured!**

---

## Step 13: Test Your Deployment

### 13.1 Test API Endpoints

```bash
# Test health endpoint
curl http://your_domain.com/health

# Or if using IP:
curl http://your_server_ip/health

# Should return: {"status":"ok","timestamp":"..."}
```

### 13.2 Test from Browser

1. Open browser
2. Go to: `http://your_domain.com/health` (or IP)
3. Should see JSON response

### 13.3 Check Logs

```bash
# PM2 logs
pm2 logs antelite-backend

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

---

## Step 14: Deploy Frontend (Optional)

### Option A: Deploy to Same Server

```bash
cd /var/www/antelite/frontend
npm install
npm run build

# Update Nginx config to serve frontend
nano /etc/nginx/sites-available/antelite
```

Add to Nginx config:

```nginx
server {
    # ... existing config ...

    # Serve React frontend
    location / {
        root /var/www/antelite/frontend/build;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Test and restart Nginx
nginx -t
systemctl restart nginx
```

### Option B: Deploy to Vercel/Netlify (Recommended)

- Better for React apps
- Free CDN
- Automatic deployments
- Better performance

See: https://vercel.com/docs or https://docs.netlify.com/

---

## Step 15: Setup Domain (If You Have One)

### 15.1 Point Domain to Server

1. Go to your domain registrar
2. Add A record:

   - **Name:** `@` (or leave blank for root domain)
   - **Type:** `A`
   - **Value:** Your server IP address
   - **TTL:** 3600

3. **For www subdomain** (optional):
   - **Name:** `www`
   - **Type:** `CNAME`
   - **Value:** `yourdomain.com`

### 15.2 Wait for DNS Propagation

- Usually takes 5-30 minutes
- Check: https://www.whatsmydns.net/
- Once propagated, update Nginx config with your domain

---

## 🎉 Congratulations!

Your server is now set up and running!

### What You've Accomplished:

✅ Server created and connected  
✅ Node.js installed  
✅ PostgreSQL installed and configured  
✅ Nginx configured as reverse proxy  
✅ SSL certificate installed (if you have domain)  
✅ Firewall configured  
✅ Application deployed and running  
✅ PM2 managing your app

---

## 📊 Monitoring & Maintenance

### Useful Commands

```bash
# Check app status
pm2 status

# View logs
pm2 logs antelite-backend

# Restart app
pm2 restart antelite-backend

# Monitor resources
pm2 monit

# Check Nginx status
systemctl status nginx

# Check PostgreSQL status
systemctl status postgresql

# View system resources
htop
# (Install with: apt install htop)
```

### Update Your Application

```bash
cd /var/www/antelite

# Pull latest code
git pull

# Install new dependencies (if any)
cd backend
npm install

# Rebuild
npm run build

# Restart app
pm2 restart antelite-backend
```

### Backup Database

```bash
# Create backup
pg_dump -U antelite_user antelite_events > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U antelite_user antelite_events < backup_20240101.sql
```

---

## 🆘 Troubleshooting

### App Won't Start

```bash
# Check PM2 logs
pm2 logs antelite-backend

# Check if port is in use
netstat -tulpn | grep 3001

# Check environment variables
pm2 show antelite-backend
```

### Database Connection Issues

```bash
# Test connection
psql -U antelite_user -d antelite_events

# Check PostgreSQL is running
systemctl status postgresql

# Check PostgreSQL logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

### Nginx Not Working

```bash
# Test configuration
nginx -t

# Check Nginx status
systemctl status nginx

# View error logs
tail -f /var/log/nginx/error.log
```

### Can't Connect via SSH

- Check firewall allows port 22
- Verify IP address is correct
- Check if server is running (contact hosting provider)

---

## 📚 Next Steps

1. **Setup automatic backups** - Schedule database backups
2. **Setup monitoring** - Use PM2 Plus or other monitoring tools
3. **Configure email** - Make sure email notifications work
4. **Test Stripe** - Verify payment processing works
5. **Setup CI/CD** - Automate deployments with GitHub Actions

---

## 🎓 What You've Learned

You now know how to:

- ✅ Set up a Linux server
- ✅ Install and configure Node.js
- ✅ Set up PostgreSQL database
- ✅ Configure Nginx as reverse proxy
- ✅ Use PM2 to manage processes
- ✅ Set up SSL certificates
- ✅ Deploy a Node.js application
- ✅ Configure firewall
- ✅ Monitor and maintain your server

**Great job!** 🚀
