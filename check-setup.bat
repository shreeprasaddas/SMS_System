@echo off
REM SMS System Pre-Flight Check for Windows
REM Verifies all prerequisites are installed and configured

setlocal enabledelayedexpansion

echo.
echo ================================
echo SMS System Pre-Flight Check
echo ================================
echo.

set errors=0

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js installed: !NODE_VERSION!
) else (
    echo [ERROR] Node.js not found - Download from https://nodejs.org/
    set /a errors+=1
)

REM Check npm
echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [OK] npm installed: !NPM_VERSION!
) else (
    echo [ERROR] npm not found
    set /a errors+=1
)

REM Check .env files
echo.
echo Checking configuration files...

if exist "backend\.env" (
    for %%A in ("backend\.env") do set size=%%~zA
    if !size! gtr 0 (
        echo [OK] backend\.env exists and configured
    ) else (
        echo [WARNING] backend\.env exists but is empty
    )
) else (
    echo [ERROR] backend\.env not found
    set /a errors+=1
)

if exist "frontend\.env" (
    for %%A in ("frontend\.env") do set size=%%~zA
    if !size! gtr 0 (
        echo [OK] frontend\.env exists and configured
    ) else (
        echo [WARNING] frontend\.env exists but is empty
    )
) else (
    echo [WARNING] frontend\.env not found
)

REM Check backend node_modules
echo.
echo Checking dependencies...

if exist "backend\node_modules" (
    echo [OK] Backend dependencies installed
) else (
    echo [WARNING] Backend dependencies not installed
    echo Run: cd backend ^&^& npm install
)

if exist "frontend\node_modules" (
    echo [OK] Frontend dependencies installed
) else (
    echo [WARNING] Frontend dependencies not installed
    echo Run: cd frontend ^&^& npm install
)

REM Summary
echo.
echo ================================
if %errors% equ 0 (
    echo [SUCCESS] All checks passed!
    echo.
    echo To start the system:
    echo 1. Ensure MongoDB is running
    echo 2. Ensure Redis is running
    echo 3. In Terminal 1: cd backend ^&^& npm run dev
    echo 4. In Terminal 2: cd frontend ^&^& npm run dev
) else (
    echo [ERROR] %errors% check(s) failed
    echo Please fix the issues above before running the system
)
echo ================================
echo.

pause
