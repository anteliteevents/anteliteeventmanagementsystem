# Cloudflare Tunnel Setup for PostgreSQL Proxy

## Option 1: Cloudflare Tunnel (Requires Zero Trust + Spectrum for TCP)

Cloudflare Tunnel is designed for HTTP/HTTPS. For PostgreSQL (TCP), you need:
- Cloudflare Zero Trust account (free tier available)
- Cloudflare Spectrum (paid feature) for TCP proxying

**This is complex and requires a paid Spectrum subscription.**

## Option 2: Run cloudflared on Render (Recommended)

Since Render doesn't support IPv6, we can run cloudflared as a sidecar service on Render itself.

### Steps:

1. **Create a cloudflared service on Render:**
   - Create a new Web Service
   - Build command: `echo "No build needed"`
   - Start command: `cloudflared tunnel --url tcp://db.gfpakpflkbhsfplvgteh.supabase.co:5432`
   - But wait... cloudflared needs to be installed first

### Better Alternative: Use Fly.io (Simpler)

Fly.io has native IPv6 support and can proxy TCP connections easily.

## Option 3: Use Fly.io TCP Proxy (Easiest)

See `fly-proxy-setup.md` for instructions.

