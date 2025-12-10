# PostgreSQL IPv4-to-IPv6 Proxy on Fly.io

This proxy forwards TCP connections from IPv4 (Render) to Supabase's IPv6-only database.

## Setup

1. **Install Fly.io CLI:**
   ```powershell
   # Windows
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login to Fly.io:**
   ```powershell
   fly auth login
   ```

3. **Deploy the proxy:**
   ```powershell
   cd fly-proxy
   fly launch --no-deploy
   fly deploy
   ```

4. **Get your proxy hostname:**
   After deployment, you'll get a hostname like: `antelite-pg-proxy.fly.dev`

5. **Update Render Environment Variables:**
   ```
   DATABASE_URL=postgresql://postgres:KFTH5N6znz2vk425a@antelite-pg-proxy.fly.dev:5432/postgres?sslmode=require
   DB_HOST=antelite-pg-proxy.fly.dev
   ```

6. **Redeploy Render backend**

## How it works

- Fly.io app listens on IPv4 port 5432
- Forwards all connections to Supabase's IPv6 address
- Transparent TCP proxy (no SSL termination)

