FROM alpine:3.19

# Install cloudflared
RUN apk add --no-cache curl && \
    curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared && \
    chmod +x /usr/local/bin/cloudflared

# Expose port
EXPOSE 5432

# Run cloudflared tunnel pointing to Supabase IPv6
# Note: This requires a Cloudflare Tunnel to be created first
CMD cloudflared tunnel --url tcp://db.gfpakpflkbhsfplvgteh.supabase.co:5432

