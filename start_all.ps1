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
    Write-Host "Starting $service..." -ForegroundColor Yellow
    
    # Launch each service in a separate hidden PowerShell window (or minimized)
    # Using Start-Process so they don't block the current terminal
    Start-Process -WorkingDirectory $PWD.Path -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "Title '$service'; mvn spring-boot:run -pl services/$service" -WindowStyle Minimized
    
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

Write-Host "All services have been initiated!" -ForegroundColor Green
Write-Host "Check the minimized PowerShell windows for logs and any database connection errors." -ForegroundColor Green
