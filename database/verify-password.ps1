# Quick Password Verification Script
# Tests if a password works with PostgreSQL

param(
    [string]$Password
)

Write-Host "`n🔍 Testing PostgreSQL Password..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if (-not $Password) {
    Write-Host "`n📝 Enter password to test:" -ForegroundColor Yellow
    $securePassword = Read-Host "Password" -AsSecureString
    $Password = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    )
}

$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
if (-not (Test-Path $psqlPath)) {
    Write-Host "`n❌ psql.exe not found" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔄 Testing connection..." -ForegroundColor Yellow

# Set PGPASSWORD environment variable
$env:PGPASSWORD = $Password

# Try to connect
$result = & $psqlPath -U postgres -d postgres -c "SELECT version();" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Password is CORRECT!" -ForegroundColor Green
    Write-Host "   Connection successful" -ForegroundColor Gray
    Write-Host "`n💡 Make sure your backend/.env has:" -ForegroundColor Yellow
    Write-Host "   DB_PASSWORD=$Password" -ForegroundColor White
    Write-Host "   (No quotes, no spaces)" -ForegroundColor Gray
} else {
    Write-Host "`n❌ Password is INCORRECT" -ForegroundColor Red
    Write-Host "   Error: $result" -ForegroundColor Gray
    Write-Host "`n💡 You need to reset the password:" -ForegroundColor Yellow
    Write-Host "   Run: .\reset-password-no-auth.ps1" -ForegroundColor White
}

# Clear password from environment
Remove-Item Env:\PGPASSWORD

