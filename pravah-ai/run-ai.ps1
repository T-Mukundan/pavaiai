# Start PRAVAH-AI Python AI Microservice
Write-Host "=========================================" -ForegroundColor Gold
Write-Host "Starting PRAVAH-AI ML Microservice..." -ForegroundColor Cyan
Write-Host "Endpoint: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Docs: http://127.0.0.1:8000/docs" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Gold

Set-Location -Path "$PSScriptRoot\ai-service"
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
