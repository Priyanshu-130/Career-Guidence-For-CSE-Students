# CSE PathFinder — Connection Diagnostic Tool
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   CSE PathFinder Environment Diagnostic" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0

# 1. Check Python
Write-Host "[1/4] Checking Python Installation..." -NoNewline
$pythonCmd = ""
if (Get-Command "python" -ErrorAction SilentlyContinue) { $pythonCmd = "python" }
elseif (Get-Command "py" -ErrorAction SilentlyContinue) { $pythonCmd = "py" }
elseif (Get-Command "python3" -ErrorAction SilentlyContinue) { $pythonCmd = "python3" }

if ($pythonCmd) {
    $version = $( & $pythonCmd --version )
    Write-Host " FOUND ($pythonCmd: $version)" -ForegroundColor Green
} else {
    Write-Host " NOT FOUND" -ForegroundColor Red
    Write-Host "    -> Action: Please install Python from python.org and ensure 'Add to PATH' is checked." -ForegroundColor Gray
    $errors++
}

# 2. Check Port 5000
Write-Host "[2/4] Checking Port 5000 (Backend)..." -NoNewline
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    Write-Host " OCCUPIED" -ForegroundColor Yellow
    Write-Host "    -> Port 5000 is already in use by another process. This will block the backend." -ForegroundColor Gray
    $errors++
} else {
    Write-Host " AVAILABLE" -ForegroundColor Green
}

# 3. Check Dependencies
if ($pythonCmd) {
    Write-Host "[3/4] Checking Flask Dependencies..." -NoNewline
    $hasFlask = & $pythonCmd -c "import flask; print('ok')" 2>$null
    $hasCors = & $pythonCmd -c "import flask_cors; print('ok')" 2>$null
    
    if ($hasFlask -eq "ok" -and $hasCors -eq "ok") {
        Write-Host " INSTALLED" -ForegroundColor Green
    } else {
        Write-Host " MISSING" -ForegroundColor Red
        Write-Host "    -> Action: Run 'pip install flask flask-cors' in your terminal." -ForegroundColor Gray
        $errors++
    }
} else {
    Write-Host "[3/4] Checking Flask Dependencies... SKIPPED (No Python)" -ForegroundColor Gray
}

# 4. Check Frontend Build
Write-Host "[4/4] Checking Frontend Build (dist)..." -NoNewline
if (Test-Path "frontend-react/dist/index.html") {
    Write-Host " READY" -ForegroundColor Green
} else {
    Write-Host " MISSING" -ForegroundColor Red
    Write-Host "    -> Action: Run 'npm run build' inside the frontend-react folder." -ForegroundColor Gray
    $errors++
}

Write-Host ""
Write-Host "-----------------------------------------------"
if ($errors -eq 0) {
    Write-Host " RESULT: Environment looks good!" -ForegroundColor Green
    Write-Host " Run 'python backend/app.py' to start."
} else {
    Write-Host " RESULT: $errors issue(s) found. Please address the gray hints above." -ForegroundColor Red
}
Write-Host ""
Write-Host "Press any key to exit..."
$x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
