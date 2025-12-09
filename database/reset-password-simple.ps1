# Simple Password Reset - Direct SQL Method
# This uses pgAdmin or direct SQL to reset password
# Run as Administrator

Write-Host "`n🔐 Simple PostgreSQL Password Reset" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Get new password
Write-Host "`n📝 Enter NEW password (avoid special characters like $ % &):" -ForegroundColor Yellow
$securePassword = Read-Host "New Password" -AsSecureString
$newPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
)

if ([string]::IsNullOrWhiteSpace($newPassword)) {
    Write-Host "`n❌ Password cannot be empty" -ForegroundColor Red
    exit 1
}

# Check for problematic characters
if ($newPassword -match '[\$\%\&\`]') {
    Write-Host "`n⚠️  Warning: Password contains special characters that might cause issues" -ForegroundColor Yellow
    Write-Host "   Consider using only letters, numbers, and basic symbols" -ForegroundColor Gray
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        exit 0
    }
}

# Find PostgreSQL data directory
$pgDataPath = "C:\Program Files\PostgreSQL\18\data"
if (-not (Test-Path $pgDataPath)) {
    Write-Host "`n❌ PostgreSQL data directory not found" -ForegroundColor Red
    exit 1
}

$pgHbaPath = Join-Path $pgDataPath "pg_hba.conf"

# Backup
$backupPath = "$pgHbaPath.backup.$(Get-Date -Format 'yyyyMMddHHmmss')"
Write-Host "`n📋 Creating backup..." -ForegroundColor Cyan
Copy-Item $pgHbaPath $backupPath

# Modify pg_hba.conf to use trust
Write-Host "`n📝 Modifying pg_hba.conf..." -ForegroundColor Cyan
$content = Get-Content $pgHbaPath -Raw
$content = $content -replace '(host\s+all\s+all\s+(?:127\.0\.0\.1/32|::1/128)\s+)\w+', '$1trust'
Set-Content -Path $pgHbaPath -Value $content -NoNewline

# Restart service
Write-Host "`n🔄 Restarting PostgreSQL service..." -ForegroundColor Cyan
$service = Get-Service | Where-Object { $_.Name -like "*postgresql*" } | Select-Object -First 1
if ($service) {
    Stop-Service -Name $service.Name -Force
    Start-Sleep -Seconds 2
    Start-Service -Name $service.Name
    Start-Sleep -Seconds 3
    
    $service.Refresh()
    if ($service.Status -eq 'Running') {
        Write-Host "   ✅ Service restarted" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Service failed to start" -ForegroundColor Red
        # Restore backup
        Copy-Item $backupPath $pgHbaPath -Force
        exit 1
    }
}

# Find psql
$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
if (-not (Test-Path $psqlPath)) {
    Write-Host "`n❌ psql.exe not found" -ForegroundColor Red
    Copy-Item $backupPath $pgHbaPath -Force
    exit 1
}

# Reset password
Write-Host "`n🔐 Resetting password..." -ForegroundColor Cyan
$escapedPassword = $newPassword -replace "'", "''"
$sqlCommand = "ALTER USER postgres WITH PASSWORD '$escapedPassword';"

$env:PGPASSWORD = ""
$result = & $psqlPath -U postgres -d postgres -c $sqlCommand 2>&1
Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Password reset successfully!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed: $result" -ForegroundColor Red
    Copy-Item $backupPath $pgHbaPath -Force
    exit 1
}

# Restore pg_hba.conf
Write-Host "`n🔄 Restoring secure authentication..." -ForegroundColor Cyan
$content = Get-Content $pgHbaPath -Raw
$content = $content -replace '(host\s+all\s+all\s+(?:127\.0\.0\.1/32|::1/128)\s+)trust', '$1scram-sha-256'
Set-Content -Path $pgHbaPath -Value $content -NoNewline

# Restart service again
Write-Host "`n🔄 Restarting service with secure auth..." -ForegroundColor Cyan
Restart-Service -Name $service.Name -Force
Start-Sleep -Seconds 3

# Update .env file
$envPath = Join-Path $PSScriptRoot "..\backend\.env"
if (Test-Path $envPath) {
    Write-Host "`n📝 Updating backend/.env..." -ForegroundColor Cyan
    $envContent = Get-Content $envPath -Raw
    
    # Escape special characters for .env file
    $envPassword = $newPassword -replace '\$', '`$' -replace '%', '`%'
    
    if ($envContent -match "DB_PASSWORD=.*") {
        $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$envPassword"
    } else {
        if (-not ($envContent -match "DB_PASSWORD")) {
            $envContent += "`nDB_PASSWORD=$envPassword"
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
Write-Host "   • New password: $newPassword" -ForegroundColor White
Write-Host "   • .env file updated" -ForegroundColor White
Write-Host "   • Secure authentication restored" -ForegroundColor White
Write-Host "`n💡 Test connection: node backend/scripts/test-db-connection.js" -ForegroundColor Yellow

