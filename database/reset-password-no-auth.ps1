# PostgreSQL Password Reset - No Authentication Required
# This script temporarily disables password authentication to reset the password
# Run as Administrator

Write-Host "`n🔐 PostgreSQL Password Reset (No Auth Method)" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "`n❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "   Right-click PowerShell → Run as Administrator" -ForegroundColor Yellow
    exit 1
}

# Find PostgreSQL data directory
$pgDataPath = $null
$pgVersions = @("18", "17", "16", "15", "14", "13", "12")

foreach ($version in $pgVersions) {
    $testPath = "C:\Program Files\PostgreSQL\$version\data"
    if (Test-Path $testPath) {
        $pgDataPath = $testPath
        Write-Host "`n✅ Found PostgreSQL $version data directory" -ForegroundColor Green
        Write-Host "   Path: $pgDataPath" -ForegroundColor Gray
        break
    }
}

if (-not $pgDataPath) {
    Write-Host "`n❌ PostgreSQL data directory not found" -ForegroundColor Red
    Write-Host "   Please provide the path to PostgreSQL data directory:" -ForegroundColor Yellow
    $pgDataPath = Read-Host "Path (e.g., C:\Program Files\PostgreSQL\18\data)"
    
    if (-not (Test-Path $pgDataPath)) {
        Write-Host "`n❌ Invalid path. Exiting." -ForegroundColor Red
        exit 1
    }
}

$pgHbaPath = Join-Path $pgDataPath "pg_hba.conf"
if (-not (Test-Path $pgHbaPath)) {
    Write-Host "`n❌ pg_hba.conf not found at: $pgHbaPath" -ForegroundColor Red
    exit 1
}

# Backup original file
$backupPath = "$pgHbaPath.backup.$(Get-Date -Format 'yyyyMMddHHmmss')"
Write-Host "`n📋 Creating backup: $backupPath" -ForegroundColor Cyan
Copy-Item $pgHbaPath $backupPath

# Read current config
Write-Host "`n📝 Reading pg_hba.conf..." -ForegroundColor Cyan
$content = Get-Content $pgHbaPath -Raw

# Find and modify the localhost line
$originalContent = $content
$modified = $false

# Pattern to match localhost connections
$patterns = @(
    'host\s+all\s+all\s+127\.0\.0\.1/32\s+\w+',
    'host\s+all\s+all\s+::1/128\s+\w+',
    'host\s+all\s+all\s+localhost\s+\w+'
)

foreach ($pattern in $patterns) {
    if ($content -match $pattern) {
        $content = $content -replace "($pattern)", '$1' -replace '(host\s+all\s+all\s+(?:127\.0\.0\.1/32|::1/128|localhost)\s+)\w+', '$1trust'
        $modified = $true
        Write-Host "   ✅ Modified authentication method to 'trust'" -ForegroundColor Green
        break
    }
}

if (-not $modified) {
    # Add trust line if not found
    Write-Host "`n⚠️  No matching line found. Adding trust line..." -ForegroundColor Yellow
    $content = $content + "`n# Temporary trust for password reset`nhost    all             all             127.0.0.1/32            trust`nhost    all             all             ::1/128                 trust`n"
    $modified = $true
}

# Write modified config
Write-Host "`n💾 Writing modified pg_hba.conf..." -ForegroundColor Cyan
Set-Content -Path $pgHbaPath -Value $content -NoNewline

# Find PostgreSQL service
Write-Host "`n🔄 Finding PostgreSQL service..." -ForegroundColor Cyan
$services = Get-Service | Where-Object { $_.Name -like "*postgresql*" -or $_.DisplayName -like "*PostgreSQL*" }
if ($services) {
    $service = $services[0]
    Write-Host "   Found: $($service.DisplayName)" -ForegroundColor Green
    
    Write-Host "`n🔄 Restarting PostgreSQL service..." -ForegroundColor Cyan
    Restart-Service -Name $service.Name -Force
    Start-Sleep -Seconds 3
    Write-Host "   ✅ Service restarted" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  PostgreSQL service not found automatically" -ForegroundColor Yellow
    Write-Host "   Please restart PostgreSQL service manually:" -ForegroundColor Gray
    Write-Host "   services.msc → Find PostgreSQL → Restart" -ForegroundColor Gray
    Write-Host "`n   Press Enter after restarting..." -ForegroundColor Yellow
    Read-Host
}

# Get new password
Write-Host "`n📝 Enter NEW password for 'postgres' user:" -ForegroundColor Yellow
$securePassword = Read-Host "New Password" -AsSecureString
$newPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
)

if ([string]::IsNullOrWhiteSpace($newPassword)) {
    Write-Host "`n❌ Password cannot be empty" -ForegroundColor Red
    # Restore original config
    Copy-Item $backupPath $pgHbaPath -Force
    Restart-Service -Name $service.Name -Force
    exit 1
}

# Find psql
$psqlPath = $null
foreach ($version in $pgVersions) {
    $testPath = "C:\Program Files\PostgreSQL\$version\bin\psql.exe"
    if (Test-Path $testPath) {
        $psqlPath = $testPath
        break
    }
}

if (-not $psqlPath) {
    Write-Host "`n❌ psql.exe not found" -ForegroundColor Red
    exit 1
}

# Reset password
Write-Host "`n🔐 Resetting password..." -ForegroundColor Cyan
$escapedPassword = $newPassword -replace "'", "''"
$sqlCommand = "ALTER USER postgres WITH PASSWORD '$escapedPassword';"

try {
    $result = & $psqlPath -U postgres -d postgres -c $sqlCommand 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Password reset successfully!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed: $result" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Error: $_" -ForegroundColor Red
}

# Restore original pg_hba.conf
Write-Host "`n🔄 Restoring original pg_hba.conf..." -ForegroundColor Cyan
Copy-Item $backupPath $pgHbaPath -Force

# Change back to scram-sha-256
$content = Get-Content $pgHbaPath -Raw
$content = $content -replace '(host\s+all\s+all\s+(?:127\.0\.0\.1/32|::1/128|localhost)\s+)trust', '$1scram-sha-256'
Set-Content -Path $pgHbaPath -Value $content -NoNewline

# Restart service again
if ($service) {
    Write-Host "   🔄 Restarting PostgreSQL service..." -ForegroundColor Cyan
    Restart-Service -Name $service.Name -Force
    Start-Sleep -Seconds 3
    Write-Host "   ✅ Service restarted with secure authentication" -ForegroundColor Green
}

# Update .env file
$envPath = Join-Path $PSScriptRoot "..\backend\.env"
if (Test-Path $envPath) {
    Write-Host "`n📝 Updating backend/.env file..." -ForegroundColor Cyan
    $envContent = Get-Content $envPath -Raw
    
    if ($envContent -match "DB_PASSWORD=.*") {
        $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$newPassword"
    } else {
        if (-not ($envContent -match "DB_PASSWORD")) {
            $envContent += "`nDB_PASSWORD=$newPassword"
        }
    }
    
    Set-Content -Path $envPath -Value $envContent -NoNewline
    Write-Host "   ✅ .env file updated" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  .env file not found. Please update manually:" -ForegroundColor Yellow
    Write-Host "   DB_PASSWORD=$newPassword" -ForegroundColor White
}

Write-Host "`n🎉 Password reset complete!" -ForegroundColor Green
Write-Host "`n📋 Summary:" -ForegroundColor Cyan
Write-Host "   • Password changed to: $newPassword" -ForegroundColor White
Write-Host "   • Original pg_hba.conf backed up" -ForegroundColor White
Write-Host "   • Authentication restored to secure mode" -ForegroundColor White
Write-Host "   • .env file updated" -ForegroundColor White
Write-Host "`n💡 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Test connection: psql -U postgres -d antelite_events" -ForegroundColor Gray
Write-Host "   2. Run enhanced seeds: node backend/scripts/seed-enhanced-data.js" -ForegroundColor Gray

