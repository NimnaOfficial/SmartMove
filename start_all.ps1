$services = @(
    "service-registry",
    "api-gateway",
    "auth-service",
    "passenger-service",
    "driver-service",
    "vehicle-service",
    "route-service",
    "trip-service",
    "booking-service",
    "payment-service",
    "maintenance-service",
    "feedback-service",
    "content-service",
    "report-service"
)

Write-Host "Starting SmartMove Microservices..." -ForegroundColor Cyan

foreach ($service in $services) {
    if ($service -eq "service-registry" -and (Test-NetConnection -ComputerName 127.0.0.1 -Port 8761 -WarningAction SilentlyContinue).TcpTestSucceeded) {
        Write-Host "Service Registry is already running on port 8761." -ForegroundColor Green
        continue
    }

    Write-Host "Starting $service..." -ForegroundColor Yellow
    
    # Launch each service in a separate hidden PowerShell window (or minimized)
    # Using Start-Process so they don't block the current terminal
    Start-Process -WorkingDirectory $PWD.Path -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "`$host.UI.RawUI.WindowTitle = '$service'; mvn spring-boot:run -pl services/$service" -WindowStyle Minimized
    
    # Wait a few seconds before starting the next one (especially important for Service Registry)
    if ($service -eq "service-registry") {
        Write-Host "Waiting 20 seconds for Service Registry to boot up..." -ForegroundColor Gray
        Start-Sleep -Seconds 20
    } elseif ($service -eq "api-gateway") {
        Write-Host "Waiting 15 seconds for API Gateway to boot up..." -ForegroundColor Gray
        Start-Sleep -Seconds 15
    } else {
        Start-Sleep -Seconds 5
    }
}

Write-Host "Starting Frontend (smartmove-web)..." -ForegroundColor Yellow
Start-Process -WorkingDirectory "$PWD\frontend\smartmove-web" -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "`$host.UI.RawUI.WindowTitle = 'smartmove-web'; npm run dev" -WindowStyle Minimized

Write-Host "All backend services and the frontend have been initiated!" -ForegroundColor Green
Write-Host "Frontend Web App: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Eureka Service Registry: http://localhost:8761" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Check the minimized PowerShell windows for logs." -ForegroundColor Green
