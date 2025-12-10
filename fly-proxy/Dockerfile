FROM alpine:3.19

# Install socat for TCP forwarding
RUN apk add --no-cache socat

# Expose PostgreSQL port
EXPOSE 5432

# Forward TCP connections from IPv4 to Supabase IPv6
CMD socat TCP-LISTEN:5432,fork,reuseaddr TCP6:db.gfpakpflkbhsfplvgteh.supabase.co:5432

