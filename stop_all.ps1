# ===================================================================
# SMARTMOVE - STOP ALL BACKGROUND SERVICES & FRONTEND
# Forcefully and thoroughly ends all background microservices,
# processes, child processes, frontend CMD window, and Vite server.
# ===================================================================

$ErrorActionPreference = "SilentlyContinue"
$root = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }

Write-Host "=================================================================" -ForegroundColor Yellow
Write-Host "   STOPPING ALL SMARTMOVE SERVICES, FRONTEND & BACKGROUND JOBS   " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Yellow

# 1. Close Frontend CMD window
$feWindows = Get-Process -Name cmd -ErrorAction SilentlyContinue | Where-Object { 
    $_.MainWindowTitle -like "*SmartMove Web Frontend*" 
}
if ($feWindows) {
    foreach ($w in $feWindows) {
        Write-Host " - Closing Frontend CMD window (PID: $($w.Id))..." -ForegroundColor Cyan
        taskkill /F /T /PID $w.Id 2>$null | Out-Null
    }
}

# 2. Kill all processes listening on SmartMove ports (including full process trees)
$ports = @(8761, 8080, 8081, 8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089, 8090, 8091, 8092, 3000, 5173)
$terminatedPids = [System.Collections.Generic.HashSet[int]]::new()

foreach ($port in $ports) {
    try {
        $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($conns) {
            foreach ($conn in $conns) {
                $pidToKill = $conn.OwningProcess
                if ($pidToKill -and $pidToKill -gt 4 -and $pidToKill -ne $PID) {
                    if (!$terminatedPids.Contains($pidToKill)) {
                        Write-Host " - Terminating process tree on port $port (PID: $pidToKill)..." -ForegroundColor Cyan
                        taskkill /F /T /PID $pidToKill 2>$null | Out-Null
                        $terminatedPids.Add($pidToKill) | Out-Null
                    }
                }
            }
        }
    } catch {
        # ignore
    }
}

# 3. Terminate launcher PIDs from tracking file
$pidsFile = Join-Path $root ".smartmove_pids.txt"
if (Test-Path $pidsFile) {
    $trackedPids = Get-Content $pidsFile -ErrorAction SilentlyContinue
    foreach ($p in $trackedPids) {
        $pNum = [int]$p
        if ($pNum -and $pNum -gt 4 -and $pNum -ne $PID) {
            taskkill /F /T /PID $pNum 2>$null | Out-Null
        }
    }
    Remove-Item $pidsFile -Force -ErrorAction SilentlyContinue
}

# 4. Clean up any remaining Java or Node processes running under SmartMove
try {
    $smartmoveProcs = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
        ($_.CommandLine -like "*spring-boot:run*" -or 
         $_.CommandLine -like "*com.nibm.smartmove*" -or
         $_.CommandLine -like "*smartmove-web*") -and 
        $_.ProcessId -ne $PID
    }

    if ($smartmoveProcs) {
        foreach ($proc in $smartmoveProcs) {
            Write-Host " - Terminating background process $($proc.ProcessId) ($($proc.Name))..." -ForegroundColor DarkGray
            taskkill /F /T /PID $proc.ProcessId 2>$null | Out-Null
        }
    }
} catch {
    # ignore
}

# 5. Clean up any remaining node.exe processes running Vite
try {
    $nodeProcs = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*vite*" -or $_.CommandLine -like "*smartmove-web*"
    }
    if ($nodeProcs) {
        foreach ($np in $nodeProcs) {
            taskkill /F /T /PID $np.ProcessId 2>$null | Out-Null
        }
    }
} catch {
    # ignore
}

Start-Sleep -Seconds 1

# 6. Verify all ports are released
$stillOpen = @()
foreach ($port in $ports) {
    try {
        $check = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($check) {
            $stillOpen += $port
        }
    } catch {}
}

Write-Host "=================================================================" -ForegroundColor Green
if ($stillOpen.Count -eq 0) {
    Write-Host " [SUCCESS] All SmartMove services and frontend cleanly stopped!" -ForegroundColor Green
    Write-Host " All ports (8761, 8080-8092, 3000) are fully released." -ForegroundColor Green
} else {
    Write-Host " [WARNING] The following ports are still occupied: $($stillOpen -join ', ')" -ForegroundColor Yellow
}
Write-Host "=================================================================`n" -ForegroundColor Green
