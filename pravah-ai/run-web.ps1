# Start PRAVAH-AI Next.js Web Frontend & API
Write-Host "=========================================" -ForegroundColor Gold
Write-Host "Starting PRAVAH-AI Web Application..." -ForegroundColor Cyan
Write-Host "URL: http://localhost:3000" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Gold

Set-Location -Path "$PSScriptRoot\web"
npm run dev
