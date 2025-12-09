# PowerShell Script to Run Database Migration
# Run this script from the project root directory

Write-Host "`n📊 Running Database Migration..." -ForegroundColor Cyan
Write-Host "File: database/module-tables.sql`n" -ForegroundColor Gray

# Try to find PostgreSQL installation
$postgresVersions = @("18", "17", "16", "15", "14", "13", "12")
$psqlPath = $null

foreach ($version in $postgresVersions) {
    $path = "C:\Program Files\PostgreSQL\$version\bin\psql.exe"
    if (Test-Path $path) {
        $psqlPath = $path
        Write-Host "✅ Found PostgreSQL $version at: $path" -ForegroundColor Green
        break
    }
}

if (-not $psqlPath) {
    Write-Host "`n❌ PostgreSQL not found at default locations" -ForegroundColor Red
    Write-Host "`nPlease use one of these methods:" -ForegroundColor Yellow
    Write-Host "`n1. Use pgAdmin (Recommended):" -ForegroundColor Cyan
    Write-Host "   • Open pgAdmin" -ForegroundColor White
    Write-Host "   • Connect to PostgreSQL server" -ForegroundColor White
    Write-Host "   • Right-click 'antelite_events' database > Query Tool" -ForegroundColor White
    Write-Host "   • Open database/module-tables.sql" -ForegroundColor White
    Write-Host "   • Click Execute (F5)" -ForegroundColor White
    Write-Host "`n2. Use psql manually:" -ForegroundColor Cyan
    Write-Host "   • Find your PostgreSQL bin directory" -ForegroundColor White
    Write-Host "   • Run: & 'C:\Path\To\PostgreSQL\bin\psql.exe' -U postgres -d antelite_events -f database/module-tables.sql" -ForegroundColor Gray
    exit 1
}

# Check if migration file exists
$migrationFile = "database/module-tables.sql"
if (-not (Test-Path $migrationFile)) {
    Write-Host "`n❌ Migration file not found: $migrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "`n📄 Migration file found: $migrationFile" -ForegroundColor Green

# Prompt for password
Write-Host "`n⚠️  You will be prompted for the PostgreSQL password" -ForegroundColor Yellow
Write-Host "   (Default user: postgres)`n" -ForegroundColor Gray

# Run the migration
try {
    $env:PGPASSWORD = Read-Host "Enter PostgreSQL password for user 'postgres'" -AsSecureString | ConvertFrom-SecureString -AsPlainText
    & $psqlPath -U postgres -d antelite_events -f $migrationFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Migration completed successfully!" -ForegroundColor Green
        Write-Host "`n📋 Tables created:" -ForegroundColor Cyan
        Write-Host "   • costs" -ForegroundColor White
        Write-Host "   • budgets" -ForegroundColor White
        Write-Host "   • proposals" -ForegroundColor White
        Write-Host "   • proposal_templates" -ForegroundColor White
        Write-Host "   • monitoring_metrics" -ForegroundColor White
        Write-Host "   • team_activity" -ForegroundColor White
        Write-Host "   • policies" -ForegroundColor White
    } else {
        Write-Host "`n❌ Migration failed. Check the error messages above." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "`n❌ Error running migration: $_" -ForegroundColor Red
    exit 1
} finally {
    # Clear password from environment
    $env:PGPASSWORD = $null
}

