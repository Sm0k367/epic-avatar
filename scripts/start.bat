@echo off
REM ===================================
REM AI Avatar Startup Script (Windows)
REM ===================================

echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║           🤖 AI Avatar - Starting Server...             ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo ✓ Python found

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/update dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt --quiet

REM Check if .env file exists
if not exist "config\.env" (
    echo ⚠️  Warning: config\.env file not found!
    echo 📝 Creating from template...
    copy config\.env.example config\.env
    echo.
    echo ⚠️  IMPORTANT: Please edit config\.env and add your API keys before running the server.
    echo    Required: OPENAI_API_KEY
    echo    Optional: D_ID_API_KEY, ELEVENLABS_API_KEY
    echo.
    pause
)

REM Start the server
echo.
echo 🚀 Starting AI Avatar server...
echo.
python backend\server.py

pause
