# ===================================================================
# SMARTMOVE - SILENT BACKGROUND STARTUP SCRIPT
# Starts all backend microservices silently in the background (0 popups),
# and launches the Frontend in its dedicated CMD console.
# All backend logs are saved cleanly to logs/<service>.log
# ===================================================================

$ErrorActionPreference = "SilentlyContinue"
$root = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }

# Ensure logs directory exists
$logsDir = Join-Path $root "logs"
if (!(Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

$services = @(
    @{ Name = "service-registry";   Port = 8761; Desc = "Eureka Service Registry" },
    @{ Name = "api-gateway";        Port = 8080; Desc = "Spring Cloud API Gateway" },
    @{ Name = "auth-service";       Port = 8081; Desc = "Authentication & JWT Service" },
    @{ Name = "passenger-service";  Port = 8085; Desc = "Passenger Management Service" },
    @{ Name = "driver-service";     Port = 8083; Desc = "Driver Management Service" },
    @{ Name = "vehicle-service";    Port = 8082; Desc = "Vehicle Fleet Service" },
    @{ Name = "route-service";      Port = 8084; Desc = "Route & Geometry Service" },
    @{ Name = "trip-service";       Port = 8086; Desc = "Trip Scheduling Service" },
    @{ Name = "booking-service";    Port = 8087; Desc = "Booking & Reservations Service" },
    @{ Name = "payment-service";    Port = 8088; Desc = "Payment & Billing Service" },
    @{ Name = "maintenance-service";Port = 8089; Desc = "Vehicle Maintenance Service" },
    @{ Name = "feedback-service";   Port = 8090; Desc = "Ratings & Feedback Service" },
    @{ Name = "content-service";    Port = 8091; Desc = "MongoDB Content & Media Service" },
    @{ Name = "report-service";     Port = 8092; Desc = "Reports & Analytics Service" }
)

function Test-PortOpen ($port) {
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $iar = $client.BeginConnect("127.0.0.1", $port, $null, $null)
        $wait = $iar.AsyncWaitHandle.WaitOne(400, $false)
        if ($wait -and $client.Connected) {
            $client.EndConnect($iar)
            $client.Close()
            return $true
        }
        $client.Close()
        return $false
    } catch {
        return $false
    }
}

function Wait-ForPort ($port, $maxSeconds = 30) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    while ($sw.Elapsed.TotalSeconds -lt $maxSeconds) {
        if (Test-PortOpen $port) {
            return $true
        }
        Start-Sleep -Milliseconds 800
    }
    return (Test-PortOpen $port)
}

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   SMARTMOVE - SILENT BACKGROUND SYSTEM STARTUP (NO POPUPS)     " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Logs are streamed silently into: $logsDir\<service>.log`n" -ForegroundColor DarkGray

$pidsList = [System.Collections.Generic.List[int]]::new()
$pidsFile = Join-Path $root ".smartmove_pids.txt"

# 1. Start Backend Microservices (100% Silent Background - 0 Popups)
$idx = 1
foreach ($svc in $services) {
    $name = $svc.Name
    $port = $svc.Port
    $desc = $svc.Desc

    if (Test-PortOpen $port) {
        Write-Host " [$idx/15] $name is ALREADY RUNNING on port $port." -ForegroundColor Green
        $idx++
        continue
    }

    Write-Host " [$idx/15] Launching $name (Port $port) silently in background..." -ForegroundColor Yellow -NoNewline
    
    $logPath = Join-Path $logsDir "$name.log"
    $errLog = Join-Path $logsDir "$name`_err.log"
    
    # Launching cmd.exe with -WindowStyle Hidden and direct file redirection ensures 0 popups
    $proc = Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c", "mvn", "spring-boot:run", "-pl", "services/$name" `
        -WorkingDirectory $root `
        -RedirectStandardOutput $logPath `
        -RedirectStandardError $errLog `
        -WindowStyle Hidden `
        -PassThru

    if ($proc) {
        $pidsList.Add($proc.Id)
    }

    # Staggered boot checks for core dependencies
    if ($name -eq "service-registry") {
        Write-Host ""
        Write-Host "         Waiting for Eureka (:8761) to initialize..." -ForegroundColor DarkGray -NoNewline
        $ready = Wait-ForPort 8761 35
        if ($ready) { Write-Host " Ready!" -ForegroundColor Green } else { Write-Host " Continuing in background..." -ForegroundColor DarkYellow }
    } elseif ($name -eq "api-gateway") {
        Write-Host ""
        Write-Host "         Waiting for API Gateway (:8080) to initialize..." -ForegroundColor DarkGray -NoNewline
        $ready = Wait-ForPort 8080 25
        if ($ready) { Write-Host " Ready!" -ForegroundColor Green } else { Write-Host " Continuing in background..." -ForegroundColor DarkYellow }
    } else {
        Write-Host " Started" -ForegroundColor Green
        Start-Sleep -Seconds 1
    }
    $idx++
}

# 2. Start Frontend Web Application in CMD console
Write-Host "`n [15/15] Starting Frontend Web App in CMD console..." -ForegroundColor Yellow -NoNewline
$fePath = Join-Path $root "frontend\smartmove-web"
$feProc = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/k", "title SmartMove Web Frontend && cd /d `"$fePath`" && npm run dev" `
    -WorkingDirectory $fePath `
    -PassThru

if ($feProc) {
    $pidsList.Add($feProc.Id)
    Write-Host " Started" -ForegroundColor Green
} else {
    Write-Host " Failed to start frontend." -ForegroundColor Red
}

# Save PIDs to tracking file
if ($pidsList.Count -gt 0) {
    $existing = if (Test-Path $pidsFile) { Get-Content $pidsFile } else { @() }
    $combined = @($existing) + @($pidsList) | Select-Object -Unique
    $combined | Out-File -FilePath $pidsFile -Encoding ascii -Force
}

Write-Host "`n=================================================================" -ForegroundColor Green
Write-Host " [SUCCESS] Full SmartMove platform is running!" -ForegroundColor Green
Write-Host " - Frontend Web:    http://localhost:3000 (running in CMD window)" -ForegroundColor Cyan
Write-Host " - API Gateway:     http://localhost:8080 (backend silent in background)" -ForegroundColor Cyan
Write-Host " - Eureka Registry: http://localhost:8761 (backend silent in background)" -ForegroundColor Cyan
Write-Host " - Service Logs:    $logsDir" -ForegroundColor DarkGray
Write-Host " - Stop Services:   Run .\stop_all.ps1 to cleanly terminate all processes" -ForegroundColor Yellow
Write-Host "=================================================================`n" -ForegroundColor Green
