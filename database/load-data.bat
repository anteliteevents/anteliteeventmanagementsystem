@echo off
echo ===========================================
echo Loading Complete Features Data
echo ===========================================
echo.

REM Get database password
set /p DB_PASSWORD=Enter database password: 

REM Set password environment variable
set PGPASSWORD=%DB_PASSWORD%

REM Run the seed script
echo Loading data...
psql -h 217.15.163.29 -U antelite_user -d antelite_events -f complete-features-seeds.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===========================================
    echo Data loaded successfully!
    echo ===========================================
    echo.
    echo Next steps:
    echo 1. Refresh your admin dashboard
    echo 2. Check each department view
    echo 3. Verify data is displaying correctly
) else (
    echo.
    echo ===========================================
    echo Error loading data
    echo ===========================================
    echo.
    echo Make sure:
    echo - schema.sql and module-tables.sql have been run first
    echo - Database connection details are correct
    echo - User has INSERT permissions
)

REM Clear password
set PGPASSWORD=

pause

