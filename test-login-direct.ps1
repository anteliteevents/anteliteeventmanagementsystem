# Direct Login Test Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Login Endpoint Directly" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$loginUrl = "https://anteliteeventssystem.onrender.com/api/auth/login"
$email = "admin88759551@antelite.digital"
$password = "94lUYIQ1csnXs1x"

$body = @{
    email = $email
    password = $password
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "Testing: $loginUrl" -ForegroundColor Yellow
Write-Host "Email: $email" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "Sending login request..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $body -Headers $headers -ErrorAction Stop
    
    if ($response.success) {
        Write-Host "✅ LOGIN SUCCESS!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Token: $($response.data.token.Substring(0, 50))..." -ForegroundColor Green
        Write-Host "User: $($response.data.user.email)" -ForegroundColor Green
        Write-Host "Role: $($response.data.user.role)" -ForegroundColor Green
        Write-Host "Name: $($response.data.user.firstName) $($response.data.user.lastName)" -ForegroundColor Green
        Write-Host ""
        Write-Host "✅ Login is working! You can now login at:" -ForegroundColor Green
        Write-Host "   https://anteliteeventssystem.vercel.app/login" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Login Failed" -ForegroundColor Red
        Write-Host "Error: $($response.error.message)" -ForegroundColor Red
        Write-Host "Code: $($response.error.code)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ ERROR OCCURRED" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody" -ForegroundColor Red
            
            $errorObj = $responseBody | ConvertFrom-Json
            if ($errorObj.error) {
                Write-Host ""
                Write-Host "Error Code: $($errorObj.error.code)" -ForegroundColor Red
                Write-Host "Error Message: $($errorObj.error.message)" -ForegroundColor Red
            }
        } catch {
            Write-Host "Could not parse error response" -ForegroundColor Red
        }
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "🔍 This usually means:" -ForegroundColor Yellow
    Write-Host "   1. Backend can't connect to database" -ForegroundColor Yellow
    Write-Host "   2. Wrong password in Render environment variables" -ForegroundColor Yellow
    Write-Host "   3. Backend not redeployed after updating variables" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Check Render logs for database connection errors" -ForegroundColor Cyan
    Write-Host "   2. Verify DB_PASSWORD in Render is: bkmgjAsoc6AmblMO" -ForegroundColor Cyan
    Write-Host "   3. Redeploy backend in Render" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

