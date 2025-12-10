# Setup PostgreSQL Database via Command Line
# This script creates the database and sets up everything needed

Write-Host "`n🔧 PostgreSQL Database Setup via Command Line" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Configuration
$dbName = "antelite_events"
$dbUser = "postgres"
$dbPassword = "Admpwpg030794"
$dbHost = "localhost"
$dbPort = "5432"

# Find PostgreSQL installation
Write-Host "`n🔍 Finding PostgreSQL installation..." -ForegroundColor Yellow
$pgPaths = @(
    "C:\Program Files\PostgreSQL\18\bin\psql.exe",
    "C:\Program Files\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $pgPaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        Write-Host "   ✅ Found: $path" -ForegroundColor Green
        break
    }
}

if (-not $psqlPath) {
    Write-Host "   ❌ PostgreSQL not found in standard locations!" -ForegroundColor Red
    Write-Host "`n💡 Please install PostgreSQL or provide the path to psql.exe" -ForegroundColor Yellow
    exit 1
}

# Set password environment variable
$env:PGPASSWORD = $dbPassword

Write-Host "`n📋 Configuration:" -ForegroundColor Yellow
Write-Host "   Database: $dbName" -ForegroundColor White
Write-Host "   User: $dbUser" -ForegroundColor White
Write-Host "   Host: $dbHost" -ForegroundColor White
Write-Host "   Port: $dbPort" -ForegroundColor White

# Step 1: Test connection
Write-Host "`n1️⃣  Testing PostgreSQL connection..." -ForegroundColor Cyan
$testResult = & $psqlPath -U $dbUser -h $dbHost -p $dbPort -c "SELECT version();" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Connection successful!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Connection failed!" -ForegroundColor Red
    Write-Host "   Error: $testResult" -ForegroundColor Red
    Write-Host "`n💡 Possible issues:" -ForegroundColor Yellow
    Write-Host "   • Password is incorrect" -ForegroundColor White
    Write-Host "   • PostgreSQL service is not running" -ForegroundColor White
    Write-Host "   • Server is not accepting connections" -ForegroundColor White
    $env:PGPASSWORD = $null
    exit 1
}

# Step 2: Check if database exists
Write-Host "`n2️⃣  Checking if database '$dbName' exists..." -ForegroundColor Cyan
$dbExists = & $psqlPath -U $dbUser -h $dbHost -p $dbPort -lqt 2>&1 | Select-String $dbName
if ($dbExists) {
    Write-Host "   ✅ Database '$dbName' already exists!" -ForegroundColor Green
    Write-Host "   💡 Skipping creation..." -ForegroundColor Yellow
} else {
    Write-Host "   ⚠️  Database '$dbName' does not exist" -ForegroundColor Yellow
    Write-Host "   📝 Creating database..." -ForegroundColor Yellow
    
    $createResult = & $psqlPath -U $dbUser -h $dbHost -p $dbPort -c "CREATE DATABASE $dbName;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Database '$dbName' created successfully!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed to create database!" -ForegroundColor Red
        Write-Host "   Error: $createResult" -ForegroundColor Red
        $env:PGPASSWORD = $null
        exit 1
    }
}

# Step 3: Verify database
Write-Host "`n3️⃣  Verifying database setup..." -ForegroundColor Cyan
$verifyResult = & $psqlPath -U $dbUser -h $dbHost -p $dbPort -d $dbName -c "SELECT current_database(), current_user;" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Database verification successful!" -ForegroundColor Green
    Write-Host "   $verifyResult" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Verification failed!" -ForegroundColor Red
    Write-Host "   Error: $verifyResult" -ForegroundColor Red
}

# Step 4: Update .env file
Write-Host "`n4️⃣  Updating backend/.env file..." -ForegroundColor Cyan
$envFile = "..\backend\.env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    $envContent = $envContent -replace "DB_HOST=.*", "DB_HOST=$dbHost"
    $envContent = $envContent -replace "DB_PORT=.*", "DB_PORT=$dbPort"
    $envContent = $envContent -replace "DB_NAME=.*", "DB_NAME=$dbName"
    $envContent = $envContent -replace "DB_USER=.*", "DB_USER=$dbUser"
    $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$dbPassword"
    Set-Content -Path $envFile -Value $envContent -NoNewline
    Write-Host "   ✅ .env file updated!" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  .env file not found at: $envFile" -ForegroundColor Yellow
}

# Clean up
$env:PGPASSWORD = $null

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Test connection: cd ..\backend && node scripts/test-db-connection.js" -ForegroundColor White
Write-Host "   2. Run migrations: cd ..\backend && npm run migrate" -ForegroundColor White
Write-Host "   3. Seed data: cd ..\backend && node scripts/seed-enhanced-data.js" -ForegroundColor White

