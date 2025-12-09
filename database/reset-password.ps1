# PostgreSQL Password Reset Script
# Run this script as Administrator

Write-Host "`n🔐 PostgreSQL Password Reset Tool" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Find PostgreSQL installation
$pgPath = "C:\Program Files\PostgreSQL"
$psqlPath = $null

if (Test-Path $pgPath) {
    $versions = Get-ChildItem $pgPath -Directory | Where-Object { $_.Name -match '^\d+$' } | Sort-Object Name -Descending
    if ($versions) {
        foreach ($v in $versions) {
            $testPath = Join-Path $v.FullName "bin\psql.exe"
            if (Test-Path $testPath) {
                $psqlPath = $testPath
                Write-Host "`n✅ Found PostgreSQL: $($v.Name)" -ForegroundColor Green
                Write-Host "   Path: $psqlPath" -ForegroundColor Gray
                break
            }
        }
    }
}

if (-not $psqlPath) {
    Write-Host "`n❌ PostgreSQL not found in default location" -ForegroundColor Red
    Write-Host "`nPlease provide the full path to psql.exe:" -ForegroundColor Yellow
    $psqlPath = Read-Host "Path"
    
    if (-not (Test-Path $psqlPath)) {
        Write-Host "`n❌ Invalid path. Exiting." -ForegroundColor Red
        exit 1
    }
}

# Get new password
Write-Host "`n📝 Enter new password for 'postgres' user:" -ForegroundColor Yellow
$securePassword = Read-Host "New Password" -AsSecureString
$newPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
)

if ([string]::IsNullOrWhiteSpace($newPassword)) {
    Write-Host "`n❌ Password cannot be empty. Exiting." -ForegroundColor Red
    exit 1
}

# Try to connect and reset password
Write-Host "`n🔄 Attempting to reset password..." -ForegroundColor Cyan
Write-Host "   (You may be prompted for current password)" -ForegroundColor Gray
Write-Host "   (Try: 'postgres' or press Enter if no password)" -ForegroundColor Gray

$sqlCommand = "ALTER USER postgres WITH PASSWORD '$newPassword';"

try {
    # Escape the password for SQL
    $escapedPassword = $newPassword -replace "'", "''"
    $sqlCommand = "ALTER USER postgres WITH PASSWORD '$escapedPassword';"
    
    # Run psql command
    $result = & $psqlPath -U postgres -d postgres -c $sqlCommand 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Password reset successfully!" -ForegroundColor Green
        
        # Update .env file
        $envPath = Join-Path $PSScriptRoot "..\backend\.env"
        if (Test-Path $envPath) {
            Write-Host "`n📝 Updating backend/.env file..." -ForegroundColor Cyan
            $envContent = Get-Content $envPath -Raw
            
            if ($envContent -match "DB_PASSWORD=.*") {
                $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$newPassword"
            } else {
                # Add if not exists
                if (-not ($envContent -match "DB_PASSWORD")) {
                    $envContent += "`nDB_PASSWORD=$newPassword"
                }
            }
            
            Set-Content -Path $envPath -Value $envContent -NoNewline
            Write-Host "   ✅ .env file updated" -ForegroundColor Green
        } else {
            Write-Host "`n⚠️  .env file not found at: $envPath" -ForegroundColor Yellow
            Write-Host "   Please update it manually with:" -ForegroundColor Gray
            Write-Host "   DB_PASSWORD=$newPassword" -ForegroundColor White
        }
        
        Write-Host "`n🎉 Done! Your new password is: $newPassword" -ForegroundColor Green
        Write-Host "`n💡 Next steps:" -ForegroundColor Yellow
        Write-Host "   1. Restart your backend server" -ForegroundColor Gray
        Write-Host "   2. Test connection: psql -U postgres -d antelite_events" -ForegroundColor Gray
        Write-Host "   3. Run enhanced seeds: node backend/scripts/seed-enhanced-data.js" -ForegroundColor Gray
        
    } else {
        Write-Host "`n❌ Failed to reset password" -ForegroundColor Red
        Write-Host "   Error: $result" -ForegroundColor Red
        Write-Host "`n💡 Try running this script as Administrator" -ForegroundColor Yellow
        Write-Host "   Or reset manually using pgAdmin" -ForegroundColor Yellow
    }
} catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
    Write-Host "`n💡 Manual reset steps:" -ForegroundColor Yellow
    Write-Host "   1. Open pgAdmin" -ForegroundColor Gray
    Write-Host "   2. Right-click server → Properties → Change password" -ForegroundColor Gray
    Write-Host "   3. Or use: ALTER USER postgres WITH PASSWORD 'your_password';" -ForegroundColor Gray
}

