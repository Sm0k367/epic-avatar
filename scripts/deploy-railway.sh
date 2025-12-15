#!/bin/bash

# ===================================
# Railway Deployment Script
# ===================================

echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║           🚀 Deploying to Railway...                    ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed."
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "✓ Railway CLI found"
echo ""

# Login to Railway
echo "🔐 Logging in to Railway..."
railway login

# Initialize project (if not already initialized)
if [ ! -f "railway.json" ]; then
    echo "📝 Initializing Railway project..."
    railway init
fi

# Prompt for environment variables
echo ""
echo "🔑 Setting up environment variables..."
echo ""
read -p "Enter your OPENAI_API_KEY: " OPENAI_KEY
read -p "Enter your D_ID_API_KEY (optional, press Enter to skip): " DID_KEY
read -p "Enter your ELEVENLABS_API_KEY (optional, press Enter to skip): " ELEVENLABS_KEY

# Set environment variables
railway variables set OPENAI_API_KEY="$OPENAI_KEY"
railway variables set PORT=5000
railway variables set HOST=0.0.0.0
railway variables set DEBUG=False

if [ ! -z "$DID_KEY" ]; then
    railway variables set D_ID_API_KEY="$DID_KEY"
fi

if [ ! -z "$ELEVENLABS_KEY" ]; then
    railway variables set ELEVENLABS_API_KEY="$ELEVENLABS_KEY"
fi

echo ""
echo "✓ Environment variables configured"
echo ""

# Deploy
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Getting your deployment URL..."
railway domain

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║           ✅ Deployment Successful!                     ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Your AI Avatar is now live!"
echo ""
echo "Next steps:"
echo "1. Visit your deployment URL above"
echo "2. Test all features"
echo "3. Monitor logs: railway logs"
echo "4. Add custom domain (optional): railway domain"
echo ""
