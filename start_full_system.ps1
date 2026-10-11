# ===================================================================
# SMARTMOVE - FULL SYSTEM STARTUP SCRIPT (BACKEND + FRONTEND)
# ===================================================================

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

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "       STARTING SMARTMOVE FULL PLATFORM           " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Start Backend Microservices
foreach ($service in $services) {
    Write-Host "[BACKEND] Launching $service..." -ForegroundColor Yellow
    
    Start-Process -WorkingDirectory $PWD.Path -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "Title '$service'; mvn spring-boot:run -pl services/$service" -WindowStyle Minimized
    
    if ($service -eq "service-registry") {
        Write-Host "Waiting 20 seconds for Service Registry (Eureka :8761) to initialize..." -ForegroundColor Gray
        Start-Sleep -Seconds 20
    } elseif ($service -eq "api-gateway") {
        Write-Host "Waiting 12 seconds for API Gateway (:8080) to initialize..." -ForegroundColor Gray
        Start-Sleep -Seconds 12
    } else {
        Start-Sleep -Seconds 4
    }
}

# 2. Start Frontend Web Application
Write-Host "`n[FRONTEND] Starting React Vite Web Application (port 3000)..." -ForegroundColor Magenta
$frontendPath = Join-Path $PWD.Path "frontend\smartmove-web"
Start-Process -WorkingDirectory $frontendPath -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "Title 'smartmove-web'; npm run dev" -WindowStyle Normal

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host " [SUCCESS] Full SmartMove environment launched!" -ForegroundColor Green
Write-Host " - Frontend URL: http://localhost:3000" -ForegroundColor Green
Write-Host " - API Gateway:  http://localhost:8080/api" -ForegroundColor Green
Write-Host " - Eureka Dash:  http://localhost:8761" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host "To stop all services later, run: .\stop_all.ps1" -ForegroundColor Yellow
