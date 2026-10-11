Write-Host "Stopping all SmartMove services and frontend..." -ForegroundColor Yellow

$processes = Get-Process -Name java, node -ErrorAction SilentlyContinue
if ($processes) {
    $processes | Stop-Process -Force
    Write-Host "Successfully stopped all Java and Node processes." -ForegroundColor Green
} else {
    Write-Host "No running Java or Node processes found." -ForegroundColor Gray
}
