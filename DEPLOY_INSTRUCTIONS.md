# 🚀 Deploy to Vercel - Step by Step

Since Vercel requires interactive authentication, please follow these steps:

---

## ✅ Option 1: GitHub Integration (EASIEST - Recommended)

This is the **easiest method** and requires no CLI!

### Step 1: Go to Vercel
Open: **https://vercel.com/new**

### Step 2: Sign Up / Login
- Use your GitHub account
- Authorize Vercel to access your repositories

### Step 3: Import Repository
1. Click **"Import Git Repository"**
2. Find and select: **`Sm0k367/epic-avatar`**
3. Click **"Import"**

### Step 4: Configure Project
Leave these settings as default:
- **Framework Preset:** Other
- **Root Directory:** `./`
- **Build Command:** (leave empty)
- **Output Directory:** `public`
- **Install Command:** (leave empty)

### Step 5: Add Environment Variable
1. Click **"Environment Variables"**
2. Add variable:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** `sk-your-openai-api-key-here`
   - **Environments:** Select all (Production, Preview, Development)

### Step 6: Deploy
Click the **"Deploy"** button

### Step 7: Wait
- Deployment takes ~2 minutes
- You'll see build logs in real-time
- When complete, you'll get your live URL!

### ✅ Done!
Your app will be live at: `https://your-project-name.vercel.app`

---

## ✅ Option 2: Vercel CLI (Advanced)

If you prefer using the command line:

### Step 1: Login to Vercel
```bash
cd ai-avatar-webapp
vercel login
```
This will open a browser for authentication.

### Step 2: Deploy
```bash
vercel
```

Answer the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** ai-avatar (or your choice)
- **Directory?** `./` (press Enter)
- **Override settings?** No

### Step 3: Add OpenAI API Key
```bash
vercel env add OPENAI_API_KEY
```
When prompted:
- Paste your OpenAI API key (starts with `sk-`)
- Select: **Production, Preview, Development** (all)

### Step 4: Deploy to Production
```bash
vercel --prod
```

### ✅ Done!
Your deployment URL will be shown in the terminal.

---

## 🔑 Get Your OpenAI API Key

If you don't have an OpenAI API key yet:

1. Go to: **https://platform.openai.com/api-keys**
2. Sign up or login
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-`)
5. Save it securely (you won't see it again!)

---

## 🧪 Test Your Deployment

After deployment, test these:

### 1. Visit Your App
Open: `https://your-project.vercel.app`

### 2. Test Chat
- Type a message: "Hello!"
- Verify AI responds

### 3. Test Voice (Optional)
- Click microphone button
- Allow microphone access
- Speak a message
- Verify transcription works

### 4. Check Health Endpoint
Visit: `https://your-project.vercel.app/api/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "platform": "vercel"
}
```

---

## 📊 View Your Deployment

### Vercel Dashboard
1. Go to: **https://vercel.com/dashboard**
2. Click on your project
3. View:
   - Deployment status
   - Build logs
   - Function logs
   - Analytics
   - Settings

### Get Deployment URL
```bash
vercel ls
```

### View Logs
```bash
vercel logs
```

### Open in Browser
```bash
vercel open
```

---

## 🔄 Update Your Deployment

### Automatic (GitHub Integration)
Every push to `main` branch automatically deploys!

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your project
3. Deploy to preview
4. Promote to production

### Manual (CLI)
```bash
vercel --prod
```

---

## ⚙️ Manage Environment Variables

### Add Variable
```bash
vercel env add VARIABLE_NAME
```

### List Variables
```bash
vercel env ls
```

### Remove Variable
```bash
vercel env rm VARIABLE_NAME
```

### Update Variable
```bash
vercel env rm VARIABLE_NAME
vercel env add VARIABLE_NAME
```

---

## 🌐 Add Custom Domain

### Via Dashboard
1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `ai-avatar.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

### Via CLI
```bash
vercel domains add yourdomain.com
```

---

## 💰 Pricing

### Free Tier (Hobby)
- ✅ 100 GB bandwidth/month
- ✅ 100 GB-hours serverless execution
- ✅ Unlimited deployments
- ✅ Free HTTPS
- **Perfect for personal projects!**

### Pro ($20/month)
- ✅ 1 TB bandwidth
- ✅ 1000 GB-hours execution
- ✅ Faster cold starts
- ✅ Team collaboration
- ✅ Advanced analytics

---

## 🆘 Troubleshooting

### Issue: "OPENAI_API_KEY not set"
**Solution:**
```bash
vercel env add OPENAI_API_KEY
vercel --prod
```

### Issue: "Module not found: openai"
**Solution:** Ensure `api/requirements.txt` exists with:
```
openai==1.6.1
```
Then redeploy: `vercel --prod`

### Issue: CORS errors
**Solution:** Already configured in `vercel.json`. Clear browser cache and try again.

### Issue: Slow first response
**Explanation:** Cold starts are normal (1-3 seconds). Subsequent requests are fast.

### Issue: Can't login to Vercel CLI
**Solution:** Use GitHub integration method instead (easier!)

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **GitHub Issues:** https://github.com/Sm0k367/epic-avatar/issues
- **OpenAI Docs:** https://platform.openai.com/docs

---

## ✅ Deployment Checklist

- [ ] Choose deployment method (GitHub or CLI)
- [ ] Get OpenAI API key
- [ ] Deploy to Vercel
- [ ] Add OPENAI_API_KEY environment variable
- [ ] Test health endpoint
- [ ] Test chat functionality
- [ ] Test voice recording
- [ ] Check deployment logs
- [ ] Add custom domain (optional)
- [ ] Share your live app!

---

## 🎉 Success!

Once deployed, your AI Avatar will be live at:
**`https://your-project.vercel.app`**

Share it with the world! 🚀

---

**Recommended:** Use **GitHub Integration** method - it's the easiest and enables auto-deploy!

**Need help?** Check `VERCEL_SETUP.md` for detailed documentation.
