# Load Complete Features Data Script
# This script loads comprehensive demo data for all features

param(
    [string]$Host = "217.15.163.29",
    [string]$Port = "5432",
    [string]$Database = "antelite_events",
    [string]$User = "antelite_user",
    [string]$Password = ""
)

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Loading Complete Features Data" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check if password is provided
if ([string]::IsNullOrEmpty($Password)) {
    $securePassword = Read-Host "Enter database password" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

# Set environment variable for password
$env:PGPASSWORD = $Password

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$seedFile = Join-Path $scriptDir "complete-features-seeds.sql"

if (-not (Test-Path $seedFile)) {
    Write-Host "Error: Seed file not found at $seedFile" -ForegroundColor Red
    exit 1
}

Write-Host "Loading data from: $seedFile" -ForegroundColor Yellow
Write-Host "Connecting to: $Host:$Port/$Database as $User" -ForegroundColor Yellow
Write-Host ""

try {
    # Check if psql is available
    $psqlPath = Get-Command psql -ErrorAction SilentlyContinue
    if (-not $psqlPath) {
        Write-Host "Error: psql command not found. Please install PostgreSQL client tools." -ForegroundColor Red
        Write-Host "You can download from: https://www.postgresql.org/download/" -ForegroundColor Yellow
        exit 1
    }

    # Run the seed script
    Write-Host "Executing seed script..." -ForegroundColor Green
    
    $result = & psql -h $Host -p $Port -U $User -d $Database -f $seedFile 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "===========================================" -ForegroundColor Green
        Write-Host "✅ Data loaded successfully!" -ForegroundColor Green
        Write-Host "===========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Summary:" -ForegroundColor Cyan
        Write-Host "- Events: 4 events created" -ForegroundColor White
        Write-Host "- Users: 6+ users (admin + exhibitors)" -ForegroundColor White
        Write-Host "- Booths: 8+ booths across events" -ForegroundColor White
        Write-Host "- Reservations: 8 reservations" -ForegroundColor White
        Write-Host "- Transactions: 10 transactions" -ForegroundColor White
        Write-Host "- Invoices: 8 invoices" -ForegroundColor White
        Write-Host "- Costs: 15+ cost entries" -ForegroundColor White
        Write-Host "- Budgets: 15+ budget entries" -ForegroundColor White
        Write-Host "- Proposals: 5 proposals" -ForegroundColor White
        Write-Host "- Templates: 4 proposal templates" -ForegroundColor White
        Write-Host "- Activities: 20+ team activities" -ForegroundColor White
        Write-Host "- Metrics: 9 monitoring metrics" -ForegroundColor White
        Write-Host "- Policies: 8 policies" -ForegroundColor White
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Refresh your admin dashboard" -ForegroundColor White
        Write-Host "2. Check each department view (Sales, Payments, Costing, etc.)" -ForegroundColor White
        Write-Host "3. Verify data is displaying correctly" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "===========================================" -ForegroundColor Red
        Write-Host "❌ Error loading data" -ForegroundColor Red
        Write-Host "===========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "Error output:" -ForegroundColor Yellow
        Write-Host $result -ForegroundColor Red
        Write-Host ""
        Write-Host "Common issues:" -ForegroundColor Yellow
        Write-Host "- Make sure schema.sql and module-tables.sql have been run first" -ForegroundColor White
        Write-Host "- Check database connection details" -ForegroundColor White
        Write-Host "- Verify user has INSERT permissions" -ForegroundColor White
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Red
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "===========================================" -ForegroundColor Red
    exit 1
} finally {
    # Clear password from environment
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green

