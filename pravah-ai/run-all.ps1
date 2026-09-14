# Launch both PRAVAH-AI Web and AI Service in separate PowerShell windows
Write-Host "==========================================================" -ForegroundColor Gold
Write-Host "  LAUNCHING PRAVAH-AI INTELLIGENCE PLATFORM (LOCAL RUNNER)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Gold
Write-Host ""
Write-Host "1. Launching Python FastAPI AI Service on http://127.0.0.1:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ai-service'; python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 2

Write-Host "2. Launching Next.js Web Interface on http://localhost:3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\web'; npm run dev"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  SUCCESSFULLY DISPATCHED!" -ForegroundColor Green
Write-Host "  Web Dashboard: http://localhost:3000" -ForegroundColor White
Write-Host "  AI Service:    http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  AI OpenAPI:    http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Demo Credentials:" -ForegroundColor Cyan
Write-Host "  Citizen:   citizen@pravah.demo  / demoPassword123!" -ForegroundColor White
Write-Host "  Officer:   officer@pravah.demo  / demoPassword123!" -ForegroundColor White
Write-Host "  Nodal:     nodal@pravah.demo    / demoPassword123!" -ForegroundColor White
Write-Host "  Analyst:   analyst@pravah.demo  / demoPassword123!" -ForegroundColor White
Write-Host "  Admin:     admin@pravah.demo    / demoPassword123!" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to close this launcher..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
