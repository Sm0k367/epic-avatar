# 🚀 Vercel Deployment Guide

Complete guide to deploy your AI Avatar project to Vercel.

---

## ⚠️ Important Note

**Vercel is primarily designed for frontend and serverless functions.** Your AI Avatar project uses:
- Python Flask (backend server)
- WebSocket connections (real-time communication)
- Long-running processes

### Recommended Approach:

**Option 1: Hybrid Deployment (Recommended)**
- Deploy **frontend** to Vercel (static files)
- Deploy **backend** to a Python-friendly platform (Heroku, Railway, Render, AWS)

**Option 2: Serverless Functions**
- Convert backend to Vercel serverless functions (requires significant refactoring)
- Limited WebSocket support

**Option 3: Full Backend Platform**
- Deploy entire project to Railway, Render, or Heroku (easier, better for WebSockets)

---

## 🎯 Option 1: Hybrid Deployment (Best for Vercel)

### Step 1: Deploy Frontend to Vercel

#### A. Prepare Frontend for Static Deployment

1. **Create `vercel.json` in project root:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

2. **Update WebSocket URL in `frontend/app.js`:**

```javascript
// Change this line (around line 140):
const wsUrl = `${protocol}//${window.location.host}/ws`;

// To point to your backend server:
const wsUrl = 'wss://your-backend-url.herokuapp.com/ws';
// Or use environment variable:
const wsUrl = process.env.BACKEND_URL || 'ws://localhost:5000/ws';
```

#### B. Deploy to Vercel

**Method 1: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd ai-avatar-webapp
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? epic-avatar
# - Directory? ./
# - Override settings? No
```

**Method 2: GitHub Integration**

1. Go to https://vercel.com/new
2. Import your GitHub repository: `Sm0k367/epic-avatar`
3. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** (leave empty for static)
   - **Output Directory:** `frontend`
4. Add Environment Variables:
   - `BACKEND_URL` = `https://your-backend-url.herokuapp.com`
5. Click **Deploy**

### Step 2: Deploy Backend to Railway/Render/Heroku

**Railway (Recommended for Python + WebSocket):**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
cd ai-avatar-webapp
railway init

# Add environment variables
railway variables set OPENAI_API_KEY=your_key
railway variables set D_ID_API_KEY=your_key
railway variables set ELEVENLABS_API_KEY=your_key

# Deploy
railway up
```

**Your backend will be at:** `https://your-app.railway.app`

### Step 3: Connect Frontend to Backend

Update `frontend/app.js` with your Railway backend URL:

```javascript
const BACKEND_URL = 'https://your-app.railway.app';
const wsUrl = `wss://your-app.railway.app/ws`;
```

---

## 🔧 Option 2: Vercel Serverless Functions

### Requirements:
- Convert Flask routes to Vercel serverless functions
- Use Vercel's WebSocket alternative (Pusher, Ably, or polling)
- Significant code refactoring needed

### Structure:

```
ai-avatar-webapp/
├── api/
│   ├── chat.py          # Serverless function for chat
│   ├── health.py        # Health check
│   └── config.py        # Configuration
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── vercel.json
```

### Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.py",
      "use": "@vercel/python"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ],
  "env": {
    "OPENAI_API_KEY": "@openai_api_key",
    "D_ID_API_KEY": "@d_id_api_key",
    "ELEVENLABS_API_KEY": "@elevenlabs_api_key"
  }
}
```

### Create `api/chat.py`:

```python
from http.server import BaseHTTPRequestHandler
import json
import openai
import os

openai.api_key = os.getenv('OPENAI_API_KEY')

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        
        # Generate AI response
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": data.get('message', '')}
            ]
        )
        
        result = {
            'message': response.choices[0].message.content
        }
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())
```

### Create `requirements.txt` in root:

```txt
openai==1.6.1
requests==2.31.0
```

### Update `frontend/app.js`:

```javascript
// Replace WebSocket with HTTP requests
async sendMessage() {
    const message = this.messageInput.value.trim();
    
    if (!message) return;
    
    this.addMessage('user', message);
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        this.addMessage('assistant', data.message);
    } catch (error) {
        console.error('Error:', error);
        this.showError('Failed to get response');
    }
}
```

---

## 🌐 Option 3: Full Deployment to Backend Platform

### Railway (Easiest for Python + WebSocket)

**1. Create `railway.json`:**

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python backend/server.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**2. Create `Procfile`:**

```
web: python backend/server.py
```

**3. Deploy:**

```bash
railway login
railway init
railway up
```

### Render (Alternative)

**1. Create `render.yaml`:**

```yaml
services:
  - type: web
    name: ai-avatar
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python backend/server.py
    envVars:
      - key: OPENAI_API_KEY
        sync: false
      - key: D_ID_API_KEY
        sync: false
      - key: ELEVENLABS_API_KEY
        sync: false
```

**2. Deploy:**
- Go to https://render.com
- Connect GitHub repository
- Render will auto-detect `render.yaml`
- Add environment variables
- Deploy

---

## 📋 Comparison Table

| Platform | Frontend | Backend | WebSocket | Python | Cost | Ease |
|----------|----------|---------|-----------|--------|------|------|
| **Vercel** | ✅ Excellent | ⚠️ Limited | ❌ No | ⚠️ Serverless only | Free tier | Medium |
| **Railway** | ✅ Good | ✅ Excellent | ✅ Yes | ✅ Full support | $5/mo | Easy |
| **Render** | ✅ Good | ✅ Excellent | ✅ Yes | ✅ Full support | Free tier | Easy |
| **Heroku** | ✅ Good | ✅ Excellent | ✅ Yes | ✅ Full support | $7/mo | Easy |
| **Hybrid** | ✅ Vercel | ✅ Railway | ✅ Yes | ✅ Full support | Mixed | Medium |

---

## 🎯 Recommended Solution

### For Your AI Avatar Project:

**Best Option: Railway (Full Stack)**
- ✅ Supports Python Flask
- ✅ Supports WebSocket
- ✅ Easy deployment
- ✅ Affordable ($5/month)
- ✅ No code changes needed

**Alternative: Hybrid (Vercel + Railway)**
- ✅ Frontend on Vercel (fast CDN)
- ✅ Backend on Railway (full Python support)
- ⚠️ Requires updating WebSocket URL
- ✅ Best performance

---

## 🚀 Quick Start: Deploy to Railway (Recommended)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Navigate to project
cd ai-avatar-webapp

# 4. Initialize Railway project
railway init

# 5. Set environment variables
railway variables set OPENAI_API_KEY=your_openai_key
railway variables set D_ID_API_KEY=your_did_key
railway variables set ELEVENLABS_API_KEY=your_elevenlabs_key
railway variables set PORT=5000

# 6. Deploy
railway up

# 7. Get your URL
railway domain
```

**Your app will be live at:** `https://your-app.railway.app`

---

## 🔐 Environment Variables

For any platform, you'll need:

```env
OPENAI_API_KEY=sk-...
D_ID_API_KEY=...
ELEVENLABS_API_KEY=...
PORT=5000
HOST=0.0.0.0
DEBUG=False
```

---

## 📞 Need Help?

- **Railway Docs:** https://docs.railway.app/
- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **GitHub Issues:** https://github.com/Sm0k367/epic-avatar/issues

---

## ✅ Deployment Checklist

- [ ] Choose deployment platform
- [ ] Set up account (Railway/Vercel/Render)
- [ ] Configure environment variables
- [ ] Update WebSocket URLs (if using hybrid)
- [ ] Deploy application
- [ ] Test all features
- [ ] Monitor logs
- [ ] Set up custom domain (optional)

---

**Recommendation:** Start with **Railway** for the easiest deployment with full Python and WebSocket support!
