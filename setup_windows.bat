@echo off
title ENERGIX Full Windows Setup
cd /d "%~dp0"

echo ============================================================
echo   ENERGIX - FULL AUTOMATIC ENVIRONMENT SETUP (WINDOWS)
echo ============================================================
echo.

:: 1. Check if Python is installed
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python is already installed and detected.
    goto :INSTALL_DEPS
)

echo [INFO] Python is NOT detected on this system.
echo [1/3] Downloading official Python 3.11 Windows 64-bit installer...
echo Please wait, downloading...

powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe', 'python_installer.exe')"

if not exist python_installer.exe (
    echo [ERROR] Failed to download Python installer. Please check your internet connection.
    pause
    exit /b 1
)

echo [2/3] Installing Python automatically with PATH enabled...
echo Please wait 1-2 minutes while Python is being installed...
python_installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_pip=1 Include_test=0

:: Clean installer file
del python_installer.exe >nul 2>&1

:: Refresh environment PATH variable for the current session
set "PATH=%LOCALAPPDATA%\Programs\Python\Python311;%LOCALAPPDATA%\Programs\Python\Python311\Scripts;C:\Program Files\Python311;C:\Program Files\Python311\Scripts;%PATH%"

:: Verify Python installation
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Python installed, but you may need to close and reopen CMD/setup to refresh PATH.
    echo Please reopen setup_windows.bat or run_demo.bat after finishing.
) else (
    echo [OK] Python installed successfully!
)

:INSTALL_DEPS
echo.
echo [3/3] Upgrading pip and installing required Python libraries...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if %errorlevel% equ 0 (
    echo.
    echo ============================================================
    echo  SUCCESS: Python and all project libraries are installed!
    echo  You can now start the platform by running: run_demo.bat
    echo ============================================================
) else (
    echo.
    echo [ERROR] Some packages failed to install. Check internet connection.
)

echo.
pause
