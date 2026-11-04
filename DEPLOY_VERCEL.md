# 🚀 Quick Deploy to Vercel (5 Minutes)

## Why Vercel?

✅ **Free** - No cost for personal projects  
✅ **Easy** - Deploy with one command  
✅ **Fast** - Global CDN, automatic HTTPS  
✅ **Reliable** - Serverless functions bypass CORS  
✅ **Automatic** - Auto-deploy on git push  

---

## Step-by-Step Deployment

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

- Choose your login method (GitHub, GitLab, Email)
- Follow the authentication prompts

### Step 3: Deploy

```bash
vercel
```

**Follow the prompts:**
- Set up and deploy? → **Y**
- Which scope? → Choose your account
- Link to existing project? → **N**
- Project name? → **mamie-market-intelligence** (or any name)
- Directory? → **./** (current directory)
- Override settings? → **N**

### Step 4: Wait for Deployment

Vercel will:
- Upload your code
- Install dependencies
- Build your project
- Deploy to global CDN

**Expected output:**
```
🔍  Inspecting: mamie-market-intelligence
...
✅  Production: https://mamie-market-intelligence.vercel.app
```

### Step 5: Access Your App

Open the URL provided by Vercel:
```
https://mamie-market-intelligence.vercel.app
```

**Done!** 🎉 CORS errors are now resolved!

---

## What Happens Behind the Scenes

1. **Serverless Function Deployed**: `/api/proxy.ts` is automatically deployed
2. **CORS Headers Added**: All API requests go through the serverless function
3. **No More CORS Errors**: Browser requests are proxied through Vercel's servers
4. **Automatic HTTPS**: Secure connections by default
5. **Global CDN**: Fast responses from edge locations worldwide

---

## Verify Deployment

### Test the Serverless Function

Open this URL in your browser:
```
https://your-app.vercel.app/api/proxy?symbol=AAPL&range=1d&interval=1d
```

**Expected result:**
```json
{
  "chart": {
    "result": [...],
    "error": null
  }
}
```

### Test Your App

1. Open your Vercel URL
2. Navigate to Executive Dashboard
3. Open browser console (F12)
4. Check for:
   - ✅ No CORS errors
   - ✅ Data loading successfully
   - ✅ Console logs showing successful proxy usage

---

## Environment Variables (Optional)

If you want to use backend API instead:

1. Go to Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   ```
   VITE_API_BASE=https://your-backend-url.com
   ```
5. Redeploy:
   ```bash
   vercel --prod
   ```

---

## Custom Domain (Optional)

To use your own domain:

1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings** → **Domains**
4. Add your domain
5. Follow DNS configuration instructions

---

## Auto-Deploy on Git Push

### Connect GitHub Repository

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/mamie.git
   git push -u origin main
   ```

2. Go to Vercel dashboard
3. Click **Add New Project**
4. Import your GitHub repository
5. Configure settings (usually defaults are fine)
6. Click **Deploy**

**Now every push to main branch auto-deploys!** 🚀

---

## Troubleshooting

### Issue: Deployment failed

**Solution:**
```bash
# Check build logs
vercel logs

# Redeploy with debug
vercel --debug
```

### Issue: Serverless function not working

**Solution:**
1. Check if `api/proxy.ts` exists
2. Verify `vercel.json` configuration
3. Check Vercel function logs:
   ```bash
   vercel logs https://your-app.vercel.app/api/proxy
   ```

### Issue: Still getting CORS errors

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Check if serverless function is deployed:
   ```bash
   vercel ls
   ```

---

## Cost & Limits

### Vercel Free Tier

✅ **Bandwidth:** 100 GB/month  
✅ **Serverless Function Executions:** 100,000/month  
✅ **Build Minutes:** 6,000 minutes/month  
✅ **Serverless Function Size:** 50 MB  
✅ **Serverless Function Duration:** 10 seconds  

**For MAMIE:** These limits are more than enough for personal use!

---

## Performance

### Expected Performance

- **First Load:** 2-3 seconds
- **Subsequent Loads:** < 1 second (cached)
- **API Response:** 200-500ms (with caching)
- **Global CDN:** Fast responses worldwide

---

## Next Steps

After deployment:

1. ✅ Test all features
2. ✅ Verify no CORS errors
3. ✅ Check data loading correctly
4. ✅ Share your Vercel URL with others
5. ⏳ (Optional) Connect GitHub for auto-deploy
6. ⏳ (Optional) Add custom domain

---

## Alternative: Deploy to Netlify

If you prefer Netlify:

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

3. **Create Netlify Function:**
   - Create `netlify/functions/proxy.js`
   - Similar to Vercel serverless function

**Note:** Vercel is recommended because the serverless function is already configured!

---

## Support

### Vercel Documentation
- https://vercel.com/docs
- https://vercel.com/docs/serverless-functions

### Common Issues
- https://vercel.com/support
- https://github.com/vercel/vercel/discussions

---

**Deployment Time:** ~5 minutes  
**Cost:** FREE  
**Difficulty:** Easy  
**Reliability:** ⭐⭐⭐⭐⭐

---

## Quick Command Reference

```bash
# Deploy
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm <deployment-url>

# Inspect deployment
vercel inspect
```

---

**Ready to deploy?** Run:
```bash
vercel
```

**That's it!** 🎉
