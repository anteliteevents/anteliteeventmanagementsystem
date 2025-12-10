# PowerShell script to run PostgreSQL setup on remote server
# This will prompt for password

$serverIP = "217.15.163.29"
$username = "root"
$password = "ASDasd12345$$$%%%"

# Create SSH command
$commands = @"
apt update -qq && apt upgrade -y -qq && apt install postgresql postgresql-contrib ufw -y -qq && 
sed -i 's/#listen_addresses = '\''localhost'\''/listen_addresses = '\''*'\''/g' /etc/postgresql/*/main/postgresql.conf && 
echo 'host    all             all             0.0.0.0/0               md5' >> /etc/postgresql/*/main/pg_hba.conf && 
echo 'host    all             all             ::/0                    md5' >> /etc/postgresql/*/main/pg_hba.conf && 
ufw allow 22/tcp && ufw allow 5432/tcp && echo 'y' | ufw enable && 
systemctl restart postgresql && systemctl enable postgresql && 
sudo -u postgres psql -c \"CREATE DATABASE antelite_events;\" && 
sudo -u postgres psql -c \"DROP USER IF EXISTS antelite_user;\" && 
sudo -u postgres psql -c \"CREATE USER antelite_user WITH PASSWORD 'ASDasd12345\$\$\$%%%';\" && 
sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE antelite_events TO antelite_user;\" && 
sudo -u postgres psql -c \"ALTER USER antelite_user CREATEDB;\" && 
echo '✅ Setup complete!'
"@

Write-Host "Connecting to $serverIP..."
ssh $username@$serverIP $commands

