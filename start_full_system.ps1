# ===================================================================
# SMARTMOVE - FULL SYSTEM STARTUP SCRIPT (BACKEND + FRONTEND)
# Wrapper pointing to silent background startup (no popups)
# ===================================================================

$root = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
& (Join-Path $root "start_all.ps1")
