# 🚀 Quick Start Guide

Get your AI Avatar up and running in 5 minutes!

## Step 1: Get API Keys

### OpenAI (Required)
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy your API key

### D-ID (Optional - for avatar video)
1. Go to https://studio.d-id.com/
2. Sign up for free account
3. Navigate to Account Settings
4. Copy your API key

### ElevenLabs (Optional - for voice)
1. Go to https://elevenlabs.io/
2. Sign up for free account
3. Go to Profile Settings → API Keys
4. Copy your API key

## Step 2: Install

```bash
# Clone repository
git clone https://github.com/Sm0k367/epic-avatar.git
cd epic-avatar

# Copy environment file
cp config/.env.example config/.env

# Edit and add your API keys
nano config/.env
```

## Step 3: Configure

Edit `config/.env`:
```env
OPENAI_API_KEY=sk-your-key-here
D_ID_API_KEY=your-key-here  # Optional
ELEVENLABS_API_KEY=your-key-here  # Optional
```

## Step 4: Run

### Linux/Mac
```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

### Windows
```bash
scripts\start.bat
```

## Step 5: Use

1. Open http://localhost:5000
2. Start chatting with your AI avatar!

## Troubleshooting

### "Module not found" error
```bash
pip install -r requirements.txt
```

### "Port already in use"
Change PORT in config/.env:
```env
PORT=8000
```

### API key errors
- Verify keys are correct in config/.env
- Check API key has credits/quota
- Ensure no extra spaces in .env file

## Next Steps

- Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Customize settings in the UI

Need help? Open an issue on GitHub!
