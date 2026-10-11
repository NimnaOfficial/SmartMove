# ===================================================================
# SMARTMOVE - STOP ALL RUNNING SERVICES
# ===================================================================

Write-Host "Stopping all SmartMove backend and frontend processes..." -ForegroundColor Yellow

$ports = @(8761, 8080, 8081, 8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089, 8090, 8091, 8092, 3000)

foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            foreach ($conn in $connections) {
                $pidToKill = $conn.OwningProcess
                if ($pidToKill -and $pidToKill -gt 4) {
                    Write-Host "Terminating process on port $port (PID: $pidToKill)..." -ForegroundColor Cyan
                    Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
                }
            }
        }
    } catch {
        # ignore
    }
}

Write-Host "All SmartMove processes have been stopped." -ForegroundColor Green
Write-Host "Stopping all SmartMove services and frontend..." -ForegroundColor Yellow

$processes = Get-Process -Name java, node -ErrorAction SilentlyContinue
if ($processes) {
    $processes | Stop-Process -Force
    Write-Host "Successfully stopped all Java and Node processes." -ForegroundColor Green
} else {
    Write-Host "No running Java or Node processes found." -ForegroundColor Gray
}
