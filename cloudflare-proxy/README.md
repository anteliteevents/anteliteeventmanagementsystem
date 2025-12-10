# Cloudflare Tunnel Setup for PostgreSQL (IPv6 Proxy)

## Why Cloudflare Tunnel Alone Won't Work

Cloudflare Tunnel (cloudflared) is designed for **HTTP/HTTPS traffic**, not raw TCP connections like PostgreSQL. For PostgreSQL, you need:

1. **Cloudflare Spectrum** (paid feature) - Direct TCP proxying
2. **Hybrid approach** - Run cloudflared on a service with IPv6 support (like Fly.io)

## Option A: Cloudflare Spectrum (Paid - $5/month minimum)

1. Go to Cloudflare Dashboard → Spectrum
2. Add a new application
3. Configure TCP proxy for port 5432
4. Point to your Supabase IPv6 address
5. Get the Spectrum endpoint
6. Update Render `DATABASE_URL` to use Spectrum endpoint

## Option B: Hybrid - Cloudflare Tunnel on Fly.io (Free)

This runs cloudflared on Fly.io (which has IPv6) to create the tunnel:

1. **Create Cloudflare Tunnel:**
   ```powershell
   cloudflared tunnel login
   cloudflared tunnel create antelite-db
   ```

2. **Deploy cloudflared on Fly.io:**
   - Fly.io supports IPv6 natively
   - Deploy this Dockerfile to Fly.io
   - It will proxy TCP from IPv4 to Supabase IPv6

3. **Update Render to use the Fly.io endpoint**

## Recommendation

**For free solution:** Use the Fly.io TCP proxy (already created in `fly-proxy/`)
**For Cloudflare:** You need Spectrum subscription ($5/month)

Would you like to proceed with:
- A) Fly.io proxy (free, works immediately)
- B) Cloudflare Spectrum setup (requires subscription)
- C) Hybrid Cloudflare + Fly.io (free but more complex)

