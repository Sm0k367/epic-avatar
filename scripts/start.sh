#!/bin/bash

# ===================================
# AI Avatar Startup Script (Linux/Mac)
# ===================================

echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║           🤖 AI Avatar - Starting Server...             ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python 3 found"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt --quiet

# Check if .env file exists
if [ ! -f "config/.env" ]; then
    echo "⚠️  Warning: config/.env file not found!"
    echo "📝 Creating from template..."
    cp config/.env.example config/.env
    echo ""
    echo "⚠️  IMPORTANT: Please edit config/.env and add your API keys before running the server."
    echo "   Required: OPENAI_API_KEY"
    echo "   Optional: D_ID_API_KEY, ELEVENLABS_API_KEY"
    echo ""
    read -p "Press Enter to continue after adding your API keys..."
fi

# Start the server
echo ""
echo "🚀 Starting AI Avatar server..."
echo ""
python3 backend/server.py
