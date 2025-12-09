# Learning Path: Deploying Your Node.js Application

Welcome! This guide will help you learn how to deploy a Node.js application from scratch. We'll go step-by-step so you understand each part.

## 🎯 What You'll Learn

By the end of this guide, you'll know how to:

- ✅ Set up a Linux server (VPS)
- ✅ Install and configure Node.js
- ✅ Set up PostgreSQL database
- ✅ Configure Nginx as a reverse proxy
- ✅ Use PM2 to manage Node.js processes
- ✅ Set up SSL certificates (HTTPS)
- ✅ Deploy your application
- ✅ Monitor and maintain your server

## 📚 Prerequisites

Before we start, you should know:

- Basic command line (we'll teach you the rest!)
- How to use SSH (we'll show you)
- Basic understanding of your project structure

**Don't worry if you're new to this!** We'll explain everything.

---

## Step 1: Understanding the Architecture

### What Happens When You Deploy?

```
User's Browser
    ↓
Domain Name (yourdomain.com)
    ↓
Nginx (Web Server) - Port 80/443
    ↓
Your Node.js App - Port 3001
    ↓
PostgreSQL Database - Port 5432
```

**Why this setup?**
- **Nginx**: Handles incoming requests, serves static files, manages SSL
- **Node.js App**: Your backend API running continuously
- **PostgreSQL**: Your database storing all data
- **PM2**: Keeps your Node.js app running (restarts if it crashes)

---

## Step 2: Choose Your Hosting Provider

### Recommended for Learning: Contabo VPS

**Why Contabo?**
- ✅ Very affordable (€4-8/month)
- ✅ Full control to learn
- ✅ Good performance
- ✅ European data centers

**Alternative Options:**
- **Railway.app**: Easiest, but less learning (managed)
- **DigitalOcean**: More expensive, but great tutorials
- **AWS**: Most complex, but industry standard

**For learning, we recommend Contabo** - you'll learn the most!

---

## Step 3: Getting Your Server

### 3.1 Create Contabo Account

1. Go to https://contabo.com
2. Click "VPS" → Choose "VPS S" or "VPS M"
3. Select **Ubuntu 22.04 LTS** (most common, best for learning)
4. Choose data center (closest to you)
5. Complete purchase

**What you'll get:**
- Server IP address (e.g., 123.45.67.89)
- Root password (save this!)
- SSH access

### 3.2 Connect to Your Server

**On Windows:**
```bash
# Use PowerShell or install PuTTY
ssh root@your_server_ip
# Enter password when prompted
```

**On Mac/Linux:**
```bash
ssh root@your_server_ip
# Enter password when prompted
```

**First time connecting?** You'll see a security warning - type `yes` to continue.

---

## Step 4: Initial Server Setup

### 4.1 Update Your Server

```bash
# Update package list
apt update

# Upgrade installed packages
apt upgrade -y

# This might take a few minutes
```

**What this does:** Gets the latest security updates and bug fixes.

### 4.2 Install Essential Tools

```bash
# Install basic tools
apt install -y curl wget git nano

# Verify installations
curl --version
git --version
```

**What these do:**
- `curl`: Download files from internet
- `wget`: Another download tool
- `git`: Version control (to clone your code)
- `nano`: Simple text editor

---

## Step 5: Install Node.js

### 5.1 Add Node.js Repository

```bash
# Download NodeSource setup script
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# This adds Node.js repository to your system
```

**What this does:** Adds the official Node.js repository so you get the latest version.

### 5.2 Install Node.js

```bash
# Install Node.js
apt install -y nodejs

# Verify installation
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x
```

**What you just did:** Installed Node.js runtime and npm (Node Package Manager).

**Test it:**
```bash
# Try running Node.js
node
# Type: console.log("Hello from Node.js!")
# Press Ctrl+C twice to exit
```

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

**What you just did:**
- Created a database called `antelite_events`
- Created a user `antelite_user` with a password
- Gave the user full access to the database

**Important:** Remember your password! You'll need it for the `.env` file.

### 6.3 Test Database Connection

```bash
# Test connection
psql -U antelite_user -d antelite_events

# If it asks for password, enter the one you created
# Type \q to exit
```

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

**What Nginx does:**
- Receives requests from the internet (port 80/443)
- Forwards them to your Node.js app (port 3001)
- Handles SSL/HTTPS
- Can serve static files

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

### 8.2 Test PM2

```bash
# Create a test file
nano test-app.js
```

Paste this:
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from PM2!\n');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

Save (Ctrl+O, Enter, Ctrl+X)

```bash
# Start with PM2
pm2 start test-app.js

# Check status
pm2 status

# View logs
pm2 logs test-app

# Stop the test app
pm2 stop test-app
pm2 delete test-app
```

**You just learned:** How PM2 manages Node.js processes!

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

# Or if you have a private repo:
git clone https://github.com/yourusername/anteliteeventssystem.git .
# Enter credentials if needed
```

**Option B: Using SCP (from your local machine)**

```bash
# On your local machine (Windows PowerShell or Mac/Linux terminal)
scp -r ./anteliteeventssystem root@your_server_ip:/var/www/
```

### 9.2 Install Dependencies

```bash
cd /var/www/antelite/backend

# Install all npm packages
npm install

# This will take a few minutes
```

**What this does:** Downloads all the packages your app needs (Express, Stripe, etc.)

### 9.3 Build TypeScript

```bash
# Build TypeScript to JavaScript
npm run build

# This creates a 'dist' folder with compiled JavaScript
```

**What this does:** Converts your TypeScript code to JavaScript that Node.js can run.

### 9.4 Create Environment File

```bash
# Create .env file
nano .env
```

Paste this (replace with your actual values):

```env
PORT=3001
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=antelite_events
DB_USER=antelite_user
DB_PASSWORD=your_password_here

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_key_here

# Stripe (use LIVE keys in production)
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# CORS
CORS_ORIGIN=https://yourdomain.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@yourdomain.com
```

Save: Ctrl+O, Enter, Ctrl+X

### 9.5 Run Database Migrations

```bash
# Run your database schema
psql -U antelite_user -d antelite_events -f ../../database/schema.sql

# Enter password when prompted
```

**What this does:** Creates all your database tables (events, booths, reservations, etc.)

### 9.6 Create PM2 Configuration

```bash
# Create PM2 config file
nano ecosystem.config.js
```

Paste this:
```javascript
module.exports = {
  apps: [{
    name: 'antelite-backend',
    script: './dist/server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
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

# Setup PM2 to start on server reboot
pm2 startup
# Follow the instructions it prints
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
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**If you only have IP address:**
- You can't use SSL with just an IP
- Consider getting a domain (they're cheap, ~$10/year)
- Or use a service like DuckDNS (free subdomain)

**Follow the prompts:**
- Enter your email
- Agree to terms
- Choose to redirect HTTP to HTTPS (recommended)

**Test auto-renewal:**
```bash
certbot renew --dry-run
```

Certbot automatically renews certificates, but you can test it.

---

## Step 12: Configure Firewall

### 12.1 Setup UFW (Firewall)

```bash
# Install UFW
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

---

## Step 13: Test Your Deployment

### 13.1 Test API Endpoints

```bash
# Test health endpoint
curl http://your_domain.com/health

# Test API (if you have authentication)
curl http://your_domain.com/api/booths/available?eventId=xxx
```

### 13.2 Check Logs

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

## Step 14: Monitoring and Maintenance

### 14.1 Useful PM2 Commands

```bash
# Check app status
pm2 status

# View logs
pm2 logs antelite-backend

# Restart app
pm2 restart antelite-backend

# Stop app
pm2 stop antelite-backend

# Monitor resources
pm2 monit

# View detailed info
pm2 show antelite-backend
```

### 14.2 Update Your Application

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

### 14.3 Backup Database

```bash
# Create backup
pg_dump -U antelite_user antelite_events > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U antelite_user antelite_events < backup_20240101.sql
```

### 14.4 System Updates

```bash
# Update system packages
apt update && apt upgrade -y

# Restart if kernel updated
reboot
```

---

## 🎓 What You've Learned

Congratulations! You now know:

1. ✅ How to set up a Linux server
2. ✅ How to install Node.js and npm
3. ✅ How to set up PostgreSQL database
4. ✅ How to use PM2 to manage processes
5. ✅ How to configure Nginx as reverse proxy
6. ✅ How to set up SSL certificates
7. ✅ How to deploy a Node.js application
8. ✅ How to monitor and maintain your server

---

## 🚀 Next Steps

### Learn More About:

1. **Docker**: Containerize your application
2. **CI/CD**: Automate deployments with GitHub Actions
3. **Load Balancing**: Handle more traffic
4. **Monitoring**: Use tools like PM2 Plus, New Relic
5. **Backup Automation**: Schedule automatic backups
6. **Security**: Harden your server (fail2ban, etc.)

### Practice:

- Deploy a simple Node.js app first
- Break things and fix them (best way to learn!)
- Read server logs when things go wrong
- Experiment with different configurations

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

## 📚 Additional Resources

- **Node.js Docs**: https://nodejs.org/docs
- **PostgreSQL Tutorial**: https://www.postgresql.org/docs/
- **Nginx Docs**: https://nginx.org/en/docs/
- **PM2 Docs**: https://pm2.keymetrics.io/docs/
- **Linux Basics**: https://linuxjourney.com/

---

## 💡 Tips for Learning

1. **Don't be afraid to break things** - That's how you learn!
2. **Read error messages carefully** - They usually tell you what's wrong
3. **Use Google** - Stack Overflow is your friend
4. **Take notes** - Write down commands that work
5. **Practice regularly** - The more you do it, the easier it gets

Good luck with your deployment! 🎉

