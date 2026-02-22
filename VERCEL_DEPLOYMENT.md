# Vercel Deployment Guide - Namohomes Admin

## ✅ Project Ready for Vercel

Your project is configured for Vercel deployment with:
- **vercel.json** - SPA routing (React Router) and build configuration
- **Environment variables** - API URL via `REACT_APP_API_URL`

---

## Deploy Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already)

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Import your repository**
   - Click "Add New..." → "Project"
   - Select `unitechcyber1/namohomes-admin` (or your repo)
   - Click "Import"

4. **Configure Project**
   - **Framework Preset**: Create React App (auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)

5. **Add Environment Variable** (Important!)
   - Expand "Environment Variables"
   - Add: `REACT_APP_API_URL` = `https://your-production-api-url.com`
   - Replace with your actual backend API URL

6. **Click Deploy**

---

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Add environment variable
vercel env add REACT_APP_API_URL
# Enter your API URL when prompted

# Production deploy
vercel --prod
```

---

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Your backend API URL | `https://api.yourdomain.com` |

**Important:** Use `https://` in production. Your backend must have CORS configured to allow requests from your Vercel domain (e.g., `https://namohomes-admin.vercel.app`).

---

## Post-Deploy Checklist

- [ ] Set `REACT_APP_API_URL` in Vercel dashboard
- [ ] Verify login works
- [ ] Check API connectivity
- [ ] Configure custom domain (optional) - Project Settings → Domains
- [ ] Enable HTTPS (automatic on Vercel)

---

## Automatic Deployments

Once connected to GitHub, Vercel will:
- **Production**: Auto-deploy on push to `main` branch
- **Preview**: Create preview deployments for other branches/PRs

---

## Troubleshooting

**404 on page refresh?**  
- The `vercel.json` rewrites should fix this. If not, ensure the rewrite rule is present.

**API calls failing?**  
- Check `REACT_APP_API_URL` is set correctly
- Verify backend CORS allows your Vercel domain
- Use browser DevTools → Network to see actual request URLs

**Build fails?**  
- Check build logs in Vercel dashboard
- Ensure `npm install` works locally
- Try: `npm run build` locally first
