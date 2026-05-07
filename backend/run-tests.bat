@echo off
REM SMS Backend Test Runner (Windows)
REM Utility script to run tests with various options

setlocal enabledelayedexpansion

:menu
cls
echo ================================
echo SMS Backend Test Runner
echo ================================
echo.
echo Select test option:
echo 1) Run all tests
echo 2) Run tests with coverage
echo 3) Run unit tests only
echo 4) Run integration tests only
echo 5) Run tests in watch mode
echo 6) Run specific test file
echo 7) Debug tests
echo 8) Exit
echo.
set /p choice="Enter choice [1-8]: "

if "%choice%"=="1" (
    echo Running all tests...
    call npm test
    goto menu
)
if "%choice%"=="2" (
    echo Running tests with coverage...
    call npm run test:coverage
    goto menu
)
if "%choice%"=="3" (
    echo Running unit tests...
    call npm run test:unit
    goto menu
)
if "%choice%"=="4" (
    echo Running integration tests...
    call npm run test:integration
    goto menu
)
if "%choice%"=="5" (
    echo Running tests in watch mode...
    call npm run test:watch
    goto menu
)
if "%choice%"=="6" (
    echo Running specific test file...
    set /p testfile="Enter test file name: "
    call npm test -- !testfile!
    goto menu
)
if "%choice%"=="7" (
    echo Debugging tests...
    call npm run test:debug
    goto menu
)
if "%choice%"=="8" (
    echo Exiting...
    exit /b 0
)

echo Invalid choice. Please try again.
pause
goto menu
