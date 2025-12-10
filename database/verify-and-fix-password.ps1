# Verify and Fix PostgreSQL Password
# This script helps you verify your password and provides instructions

Write-Host "`n🔐 PostgreSQL Password Verification & Fix" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "`n📋 Current .env Configuration:" -ForegroundColor Yellow
$envFile = "..\backend\.env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $dbPassword = ($envContent | Select-String "DB_PASSWORD=").ToString() -replace "DB_PASSWORD=", ""
    Write-Host "   Password in .env: $dbPassword" -ForegroundColor White
} else {
    Write-Host "   ❌ .env file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "`n💡 To Fix Password Mismatch:" -ForegroundColor Cyan
Write-Host "`n1️⃣  Open pgAdmin" -ForegroundColor Green
Write-Host "   • Launch pgAdmin from Start Menu" -ForegroundColor White
Write-Host "`n2️⃣  Navigate to postgres user" -ForegroundColor Green
Write-Host "   • Expand: Servers → PostgreSQL 18" -ForegroundColor White
Write-Host "   • Expand: Login/Group Roles" -ForegroundColor White
Write-Host "   • Find: postgres" -ForegroundColor White
Write-Host "`n3️⃣  Change Password" -ForegroundColor Green
Write-Host "   • Right-click 'postgres' → Properties" -ForegroundColor White
Write-Host "   • Go to 'Definition' tab" -ForegroundColor White
Write-Host "   • Set Password to: $dbPassword" -ForegroundColor Yellow
Write-Host "   • Click 'Save'" -ForegroundColor White
Write-Host "`n4️⃣  Test Connection" -ForegroundColor Green
Write-Host "   • cd ..\backend" -ForegroundColor Gray
Write-Host "   • node scripts/test-db-connection.js" -ForegroundColor Gray

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✅ Instructions displayed above!" -ForegroundColor Green
Write-Host "`n💡 After fixing password in pgAdmin, run:" -ForegroundColor Cyan
Write-Host "   cd ..\backend" -ForegroundColor White
Write-Host "   node scripts/test-db-connection.js" -ForegroundColor White

