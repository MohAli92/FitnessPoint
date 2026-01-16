# Script to stop processes using ports 5000 and 3000

Write-Host "Checking for processes on ports 5000 and 3000..." -ForegroundColor Yellow

# Find processes on port 5000
$port5000 = netstat -ano | findstr :5000 | Select-String "LISTENING"
if ($port5000) {
    $pid5000 = ($port5000 -split '\s+')[-1]
    Write-Host "Found process $pid5000 on port 5000. Stopping..." -ForegroundColor Yellow
    taskkill /F /PID $pid5000 2>$null
    Write-Host "Port 5000 is now free." -ForegroundColor Green
} else {
    Write-Host "Port 5000 is free." -ForegroundColor Green
}

# Find processes on port 3000
$port3000 = netstat -ano | findstr :3000 | Select-String "LISTENING"
if ($port3000) {
    $pid3000 = ($port3000 -split '\s+')[-1]
    Write-Host "Found process $pid3000 on port 3000. Stopping..." -ForegroundColor Yellow
    taskkill /F /PID $pid3000 2>$null
    Write-Host "Port 3000 is now free." -ForegroundColor Green
} else {
    Write-Host "Port 3000 is free." -ForegroundColor Green
}

Write-Host "`nReady to start servers!" -ForegroundColor Cyan
Write-Host "Run: npm run dev" -ForegroundColor Cyan

