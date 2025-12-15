#!/bin/bash

# ===================================
# Vercel Deployment Script
# ===================================

echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║           🚀 Deploying to Vercel...                     ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✓ Vercel CLI found"
echo ""

# Login to Vercel
echo "🔐 Please login to Vercel..."
echo "This will open a browser window for authentication."
echo ""
vercel login

echo ""
echo "✓ Logged in to Vercel"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
vercel --yes

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📝 Next steps:"
echo "1. Add your OpenAI API key:"
echo "   vercel env add OPENAI_API_KEY"
echo ""
echo "2. Deploy to production:"
echo "   vercel --prod"
echo ""
echo "3. View your deployment:"
echo "   vercel open"
echo ""
