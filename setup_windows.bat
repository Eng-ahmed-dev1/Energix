@echo off
title ENERGIX Setup Dependencies
cd /d "%~dp0"

echo ============================================================
echo   ENERGIX - Setup Dependencies
echo ============================================================
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python and check 'Add Python to PATH'.
    echo.
    pause
    exit /b 1
)

echo [1/2] Upgrading pip...
python -m pip install --upgrade pip

echo.
echo [2/2] Installing required packages...
python -m pip install -r requirements.txt

if %errorlevel% equ 0 (
    echo.
    echo ============================================================
    echo  SUCCESS: All dependencies installed successfully.
    echo  You can now run 'run_demo.bat' to start the project.
    echo ============================================================
) else (
    echo.
    echo [ERROR] Failed to install packages. Check internet connection.
)

echo.
pause
