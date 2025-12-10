# Test Login Endpoint
$body = @{
    email = "admin88759551@antelite.digital"
    password = "94lUYIQ1csnXs1x"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    Write-Host "Testing login endpoint..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "https://anteliteeventssystem.onrender.com/api/auth/login" -Method Post -Body $body -Headers $headers
    
    if ($response.success) {
        Write-Host "✅ Login SUCCESS!" -ForegroundColor Green
        Write-Host "Token: $($response.data.token.Substring(0, 50))..." -ForegroundColor Green
        Write-Host "User: $($response.data.user.email)" -ForegroundColor Green
        Write-Host "Role: $($response.data.user.role)" -ForegroundColor Green
    } else {
        Write-Host "❌ Login FAILED" -ForegroundColor Red
        Write-Host "Error: $($response.error.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

