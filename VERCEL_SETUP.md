# 🚀 Vercel Deployment Guide - AI Avatar

Complete guide to deploy your AI Avatar to Vercel (Serverless Architecture).

---

## ⚠️ Important Changes

Your project has been **converted to serverless architecture** for Vercel compatibility:

### What Changed:
- ❌ **Removed:** WebSocket real-time communication
- ✅ **Added:** HTTP-based serverless API endpoints
- ✅ **Added:** Vercel Python serverless functions
- ✅ **Modified:** Frontend to use REST API instead of WebSocket

### Limitations:
- ⚠️ No real-time WebSocket (uses HTTP polling instead)
- ⚠️ Conversation history resets on cold starts
- ⚠️ No avatar video generation (D-ID requires persistent server)
- ⚠️ Limited to OpenAI API only

---

## 📁 New Project Structure

```
ai-avatar-webapp/
├── api/                      # Vercel Serverless Functions
│   ├── chat.py              # AI chat endpoint
│   ├── transcribe.py        # Audio transcription
│   ├── health.py            # Health check
│   └── requirements.txt     # Python dependencies
├── public/                   # Static frontend files
│   ├── index.html           # Main page
│   ├── styles.css           # Styling
│   └── app.js               # Frontend logic (serverless version)
└── vercel.json              # Vercel configuration
```

---

## 🚀 Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
cd ai-avatar-webapp
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** ai-avatar (or your choice)
- **Directory?** `./`
- **Override settings?** No

#### Step 4: Set Environment Variables

```bash
# Set OpenAI API Key
vercel env add OPENAI_API_KEY

# When prompted, paste your OpenAI API key
# Select: Production, Preview, Development (all)
```

#### Step 5: Deploy to Production

```bash
vercel --prod
```

**Your app will be live at:** `https://your-project.vercel.app`

---

### Method 2: GitHub Integration (Easiest)

#### Step 1: Push to GitHub

Your code is already on GitHub: https://github.com/Sm0k367/epic-avatar

#### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository: `Sm0k367/epic-avatar`
4. Click "Import"

#### Step 3: Configure Project

**Framework Preset:** Other  
**Root Directory:** `./`  
**Build Command:** (leave empty)  
**Output Directory:** `public`  
**Install Command:** (leave empty)

#### Step 4: Add Environment Variables

Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `OPENAI_API_KEY` | `sk-your-openai-key-here` |

**Important:** Select all environments (Production, Preview, Development)

#### Step 5: Deploy

Click "Deploy" button

**Your app will be live in ~2 minutes!**

---

## 🔑 Required Environment Variables

### OpenAI API Key (Required)

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key (starts with `sk-`)
4. Add to Vercel:

```bash
vercel env add OPENAI_API_KEY
```

Or in Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add `OPENAI_API_KEY` = `sk-your-key-here`

---

## 🧪 Testing Your Deployment

### 1. Test Health Endpoint

```bash
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-15T...",
  "platform": "vercel",
  "message": "AI Avatar API is running"
}
```

### 2. Test Chat Endpoint

```bash
curl -X POST https://your-project.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "session_id": "test123"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Hello! How can I help you today?",
  "session_id": "test123"
}
```

### 3. Test Frontend

Visit: `https://your-project.vercel.app`

- Type a message and send
- Verify AI responds
- Test voice recording (if microphone available)

---

## 📊 API Endpoints

### GET /api/health

Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-15T10:30:00",
  "platform": "vercel"
}
```

### POST /api/chat

Send message to AI

**Request:**
```json
{
  "message": "Your message here",
  "session_id": "unique-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI response here",
  "session_id": "unique-session-id"
}
```

### POST /api/transcribe

Transcribe audio to text

**Request:**
```json
{
  "audio": "base64-encoded-audio-data"
}
```

**Response:**
```json
{
  "success": true,
  "text": "Transcribed text here"
}
```

---

## 🔧 Configuration

### vercel.json

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
      "src": "/",
      "dest": "/public/index.html"
    }
  ]
}
```

---

## 🎨 Custom Domain

### Add Custom Domain

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your domain (e.g., `ai-avatar.yourdomain.com`)
5. Follow DNS configuration instructions
6. Wait for SSL certificate (automatic)

---

## 📈 Monitoring & Logs

### View Logs

**Vercel Dashboard:**
1. Go to your project
2. Click "Deployments"
3. Click on a deployment
4. View "Functions" tab for logs

**Vercel CLI:**
```bash
vercel logs
```

### Monitor Performance

- Go to Project → Analytics
- View:
  - Request count
  - Response times
  - Error rates
  - Geographic distribution

---

## 🐛 Troubleshooting

### Issue: "Module not found" error

**Solution:** Ensure `api/requirements.txt` exists with:
```txt
openai==1.6.1
```

### Issue: "OPENAI_API_KEY not set"

**Solution:** Add environment variable:
```bash
vercel env add OPENAI_API_KEY
```

Then redeploy:
```bash
vercel --prod
```

### Issue: CORS errors

**Solution:** Already configured in `vercel.json`. If issues persist, check browser console for specific errors.

### Issue: Cold start delays

**Explanation:** Serverless functions have cold starts (1-3 seconds). This is normal for Vercel's free tier.

**Solution:** Upgrade to Pro plan for faster cold starts.

### Issue: Conversation history lost

**Explanation:** Serverless functions are stateless. History resets on cold starts.

**Solution:** Implement external storage (Redis, Database) for persistent history.

---

## 💰 Pricing

### Vercel Free Tier (Hobby)
- ✅ 100 GB bandwidth/month
- ✅ 100 GB-hours serverless function execution
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ⚠️ Cold starts

### Vercel Pro ($20/month)
- ✅ 1 TB bandwidth/month
- ✅ 1000 GB-hours execution
- ✅ Faster cold starts
- ✅ Team collaboration
- ✅ Analytics

**Note:** OpenAI API costs are separate (pay-as-you-go)

---

## 🔄 Updating Your Deployment

### Update via Git

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main
```

Vercel automatically deploys on push!

### Update via CLI

```bash
vercel --prod
```

---

## 🎯 Performance Tips

1. **Optimize API Calls**
   - Reduce max_tokens in chat.py
   - Use GPT-3.5-turbo instead of GPT-4 (faster, cheaper)

2. **Cache Responses**
   - Implement caching for common queries
   - Use Vercel Edge Config

3. **Minimize Cold Starts**
   - Keep functions warm with scheduled pings
   - Upgrade to Pro plan

---

## 📚 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Python:** https://vercel.com/docs/functions/serverless-functions/runtimes/python
- **OpenAI API:** https://platform.openai.com/docs
- **GitHub Repo:** https://github.com/Sm0k367/epic-avatar

---

## ✅ Deployment Checklist

- [ ] Install Vercel CLI
- [ ] Login to Vercel account
- [ ] Deploy project (`vercel`)
- [ ] Add OPENAI_API_KEY environment variable
- [ ] Deploy to production (`vercel --prod`)
- [ ] Test health endpoint
- [ ] Test chat functionality
- [ ] Test voice recording
- [ ] Add custom domain (optional)
- [ ] Monitor logs and performance

---

## 🎉 Success!

Your AI Avatar is now live on Vercel!

**Next Steps:**
1. Share your URL: `https://your-project.vercel.app`
2. Monitor usage in Vercel Dashboard
3. Check OpenAI API usage: https://platform.openai.com/usage
4. Customize and improve!

---

**Need help?** Open an issue: https://github.com/Sm0k367/epic-avatar/issues
