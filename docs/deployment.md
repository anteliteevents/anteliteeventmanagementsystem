# Deployment Guide

## Technology Stack Summary

### ✅ What This Project Uses

- **Backend**: Node.js + Express (TypeScript)
- **Database**: PostgreSQL (NOT MySQL)
- **Frontend**: React + TypeScript
- **Real-time**: Socket.io (WebSockets)
- **Payments**: Stripe API
- **Email**: Nodemailer (SMTP)

### ❌ What This Project Does NOT Use

- ❌ **XAMPP** (that's for PHP/MySQL)
- ❌ **phpMyAdmin** (that's for MySQL databases)
- ❌ **Apache** (we use Node.js server)
- ❌ **MySQL** (we use PostgreSQL)

## Deployment Options

### Option 1: VPS (Virtual Private Server) ⭐ Recommended

**Best for**: Full control, production use

**Providers:**
- **Contabo** ($4-8/month) ⭐ Great value
- DigitalOcean ($6-12/month)
- Linode ($5-10/month)
- AWS EC2 (pay-as-you-go)
- Vultr ($6/month)

**Steps:**
1. Create Ubuntu/Debian VPS
2. Install Node.js, PostgreSQL, Nginx (reverse proxy)
3. Setup PM2 (process manager)
4. Configure SSL with Let's Encrypt
5. Deploy your code

**Pros:**
- Full control
- Can run PostgreSQL
- Supports Socket.io
- Cost-effective

**Cons:**
- Requires server management
- Need to handle security updates

---

### Option 2: Platform-as-a-Service (PaaS) ⭐ Easiest

**Best for**: Quick deployment, managed services

#### Railway.app
- ✅ PostgreSQL included
- ✅ Automatic deployments
- ✅ Free tier available
- ✅ Easy setup

#### Render.com
- ✅ PostgreSQL included
- ✅ Free tier (with limitations)
- ✅ Automatic SSL
- ✅ WebSocket support

#### Heroku
- ✅ PostgreSQL addon
- ✅ Easy deployment
- ⚠️ Paid plans required for production

#### Vercel (Frontend) + Railway/Render (Backend)
- ✅ Best for React frontend
- ✅ Serverless functions
- ⚠️ Backend needs separate hosting

**Pros:**
- No server management
- Automatic SSL
- Easy deployments
- Managed databases

**Cons:**
- Less control
- Can be more expensive at scale

---

### Option 3: cPanel with Node.js Support

**Requirements:**
- Host must support Node.js apps
- PostgreSQL database access
- WebSocket support for Socket.io

**Steps:**
1. Check if your cPanel has "Node.js Selector" or "Node.js App Manager"
2. Create Node.js application
3. Setup PostgreSQL database (may need separate hosting)
4. Configure environment variables
5. Deploy code

**Limitations:**
- Many cPanel hosts don't support Node.js
- PostgreSQL often not available
- Socket.io may not work
- Limited terminal access

**Check with your host:**
- Do they support Node.js?
- Do they offer PostgreSQL?
- Do they support WebSockets?

---

## Recommended Deployment: Railway.app

### Why Railway?

1. ✅ PostgreSQL included (free tier)
2. ✅ Node.js support
3. ✅ Automatic deployments from GitHub
4. ✅ Free tier for testing
5. ✅ WebSocket support
6. ✅ Easy environment variable setup

### Deployment Steps

#### 1. Prepare Your Code

```bash
# Make sure you have a .gitignore
# Commit all your code to GitHub
```

#### 2. Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project

#### 3. Add PostgreSQL

1. Click "New" → "Database" → "PostgreSQL"
2. Railway automatically creates database
3. Copy connection string

#### 4. Deploy Backend

1. Click "New" → "GitHub Repo"
2. Select your repository
3. Select `backend` folder as root
4. Railway auto-detects Node.js

#### 5. Configure Environment Variables

In Railway dashboard, add these variables:

```env
PORT=3001
NODE_ENV=production
DB_HOST=<from_postgres_service>
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=<from_postgres_service>
JWT_SECRET=<generate_strong_secret>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
CORS_ORIGIN=https://your-frontend-domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@yourdomain.com
```

#### 6. Deploy Frontend

1. Create new service in Railway
2. Select `frontend` folder
3. Set build command: `npm run build`
4. Set start command: `npm start` or use static hosting

**OR** deploy frontend to Vercel/Netlify (better for React apps)

#### 7. Configure Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-backend.railway.app/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to Railway environment variables

---

## Recommended: Contabo VPS ⭐ Best Value

### Why Contabo?

- ✅ **Very affordable** ($4-8/month)
- ✅ **Full root access** (install anything)
- ✅ **Good performance** for the price
- ✅ **Perfect for Node.js/PostgreSQL**
- ✅ **European data centers** (good for EU users)
- ✅ **No credit card required** for some plans

### Setup Steps

#### 1. Create Contabo VPS

1. Go to https://contabo.com
2. Choose **VPS** → **VPS S** or **VPS M** (recommended)
   - VPS S: 4 vCPU, 8GB RAM, 200GB SSD (~$4-6/month)
   - VPS M: 6 vCPU, 16GB RAM, 400GB SSD (~$8-10/month)
3. Select Ubuntu 22.04 LTS
4. Choose data center location
5. Complete purchase

#### 2. Initial Server Setup

```bash
# SSH into your Contabo VPS
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify Node.js
node --version  # Should show v20.x.x
npm --version

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx (reverse proxy)
apt install -y nginx

# Install PM2 (Node.js process manager)
npm install -g pm2

# Install Git (if not already installed)
apt install -y git
```

#### 3. Setup PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE antelite_events;
CREATE USER antelite_user WITH PASSWORD 'your_strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE antelite_events TO antelite_user;
\q

# Edit PostgreSQL config to allow connections
nano /etc/postgresql/14/main/postgresql.conf
# Find and uncomment: listen_addresses = 'localhost'

# Edit pg_hba.conf
nano /etc/postgresql/14/main/pg_hba.conf
# Add line: local   all             all                                     md5

# Restart PostgreSQL
systemctl restart postgresql
```

#### 4. Deploy Your Application

```bash
# Create app directory
mkdir -p /var/www/antelite
cd /var/www/antelite

# Clone your repository (or upload files)
git clone https://github.com/yourusername/anteliteeventssystem.git .

# Or if you have files locally, use SCP:
# scp -r ./anteliteeventssystem root@your_server_ip:/var/www/

cd backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run database migrations
psql -U antelite_user -d antelite_events -f ../../database/schema.sql
# Enter password when prompted
```

#### 5. Create Environment File

```bash
nano /var/www/antelite/backend/.env
```

Add your production environment variables:

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

#### 6. Setup PM2 Process Manager

```bash
cd /var/www/antelite/backend

# Create PM2 ecosystem file
nano ecosystem.config.js
```

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

```bash
# Create logs directory
mkdir -p logs

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions it prints

# Check status
pm2 status
pm2 logs antelite-backend
```

#### 7. Setup Nginx Reverse Proxy

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/antelite
```

```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;

    # Increase body size for file uploads
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
        
        # WebSocket support for Socket.io
        proxy_set_header Connection "upgrade";
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

```bash
# Enable site
ln -s /etc/nginx/sites-available/antelite /etc/nginx/sites-enabled/

# Remove default site (optional)
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

#### 8. Setup SSL with Let's Encrypt (Free)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your_domain.com -d www.your_domain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS

# Test auto-renewal
certbot renew --dry-run

# Certbot auto-renews, but you can check with:
systemctl status certbot.timer
```

#### 9. Configure Firewall

```bash
# Install UFW (Uncomplicated Firewall)
apt install -y ufw

# Allow SSH (important - do this first!)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

#### 10. Point Your Domain

1. Go to your domain registrar
2. Add A record:
   - Name: `@` or leave blank
   - Type: `A`
   - Value: Your Contabo VPS IP address
   - TTL: 3600
3. Add CNAME for www (optional):
   - Name: `www`
   - Type: `CNAME`
   - Value: `your_domain.com`

#### 11. Deploy Frontend

**Option A: Same Server (Nginx serves static files)**

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

**Option B: Deploy to Vercel/Netlify (Recommended)**

- Better for React apps
- Free CDN
- Automatic deployments
- Better performance

#### 12. Monitor Your Application

```bash
# Check PM2 status
pm2 status
pm2 monit

# View logs
pm2 logs antelite-backend

# Check Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Check system resources
htop
df -h  # Disk space
free -h  # Memory
```

### Contabo VPS Maintenance

**Update Application:**
```bash
cd /var/www/antelite
git pull
cd backend
npm install
npm run build
pm2 restart antelite-backend
```

**Update System:**
```bash
apt update && apt upgrade -y
```

**Backup Database:**
```bash
# Create backup
pg_dump -U antelite_user antelite_events > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U antelite_user antelite_events < backup_20240101.sql
```

### Contabo Pricing

- **VPS S**: ~€4-6/month - Good for small projects
- **VPS M**: ~€8-10/month - Recommended for production
- **VPS L**: ~€15/month - For high traffic

All plans include:
- Full root access
- Your choice of OS
- SSD storage
- Good bandwidth

---

## Alternative: DigitalOcean Droplet

### Setup Steps

#### 1. Create Droplet

- Ubuntu 22.04 LTS
- $6/month (1GB RAM) or $12/month (2GB RAM)

#### 2. Initial Server Setup

```bash
# SSH into server
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2
```

#### 3. Setup PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE antelite_events;
CREATE USER antelite_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE antelite_events TO antelite_user;
\q
```

#### 4. Deploy Your Code

```bash
# Clone repository
git clone https://github.com/yourusername/anteliteeventssystem.git
cd anteliteeventssystem/backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run database migrations
npm run migrate
```

#### 5. Setup PM2

```bash
# Create ecosystem file
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'antelite-backend',
    script: './dist/server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 6. Setup Nginx Reverse Proxy

```bash
nano /etc/nginx/sites-available/antelite
```

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/antelite /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 7. Setup SSL with Let's Encrypt

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your_domain.com
```

---

## Environment Variables Checklist

Make sure these are set in production:

- [ ] `NODE_ENV=production`
- [ ] Database credentials
- [ ] `JWT_SECRET` (strong random string)
- [ ] Stripe keys (LIVE keys, not test)
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] SMTP email credentials
- [ ] `CORS_ORIGIN` (your frontend URL)

---

## Database Migration

Before deploying, run the schema:

```bash
# On server or via Railway CLI
psql -U postgres -d antelite_events -f database/schema.sql
```

---

## Monitoring & Maintenance

### PM2 Commands (VPS)

```bash
pm2 status          # Check app status
pm2 logs            # View logs
pm2 restart all     # Restart app
pm2 monit           # Monitor resources
```

### Railway Dashboard

- View logs in real-time
- Monitor resource usage
- View deployment history
- Manage environment variables

---

## Troubleshooting

### Socket.io Not Working

- Check if WebSockets are enabled
- Verify Nginx proxy configuration includes WebSocket headers
- Check firewall settings

### Database Connection Issues

- Verify database credentials
- Check if database is accessible from your app
- Verify firewall allows connections

### Email Not Sending

- Verify SMTP credentials
- Check spam folder
- Test with different SMTP provider
- Check application logs

---

## Cost Comparison

| Option | Monthly Cost | Difficulty |
|-------|-------------|------------|
| **Contabo VPS** | **€4-8** | ⭐⭐ Medium |
| Railway (Free tier) | $0-5 | ⭐ Easy |
| Render (Free tier) | $0-7 | ⭐ Easy |
| DigitalOcean | $6-12 | ⭐⭐ Medium |
| Heroku | $7-25 | ⭐ Easy |
| cPanel (if supported) | $5-15 | ⭐⭐ Medium |

---

## Recommendation

**For Production**: 
- **Contabo VPS** ⭐ Best value for money (€4-8/month)
- **Railway.app** ⭐ Easiest setup (managed service)
- **DigitalOcean** ⭐ Good balance

**For Development/Testing**: Use **Railway.app** free tier

**Avoid**: Traditional cPanel shared hosting (won't work well)

### Why Contabo is Great for This Project

✅ **Affordable**: €4-8/month for a full VPS  
✅ **Full Control**: Install Node.js, PostgreSQL, anything you need  
✅ **Perfect Fit**: Exactly what Node.js/PostgreSQL apps need  
✅ **No Limitations**: Unlike shared hosting, you can run persistent processes  
✅ **WebSocket Support**: Socket.io will work perfectly  
✅ **European Data Centers**: Good for EU users (lower latency)

