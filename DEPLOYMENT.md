# 🚀 GradKart Marketplace - Railway Deployment Guide

## 📋 Prerequisites

- [GitHub](https://github.com) account
- [Railway](https://railway.app) account
- Node.js 18+ installed locally
- Git installed locally

## 🏗️ Project Structure

```
gradkart-marketplace/
├── client/                 # Next.js frontend
│   ├── package.json
│   ├── src/
│   └── ...
├── server/                 # Express backend
│   ├── package.json
│   ├── src/
│   │   └── index.js
│   └── ...
├── package.json            # Root monorepo config
├── railway.json           # Railway deployment config
├── env.example            # Environment variables template
└── DEPLOYMENT.md          # This file
```

## 🚀 Step-by-Step Deployment

### 1. Local Setup & Testing

```bash
# Install all dependencies
npm run install:all

# Test development mode
npm run dev

# Test production build
npm run build
npm start
```

### 2. Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial monorepo setup for Railway deployment"

# Create new repository on GitHub, then:
git remote add origin https://github.com/yourusername/gradkart-marketplace.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Set Root Directory to `/server`** (important!)
7. **Click "Deploy"**

### 4. Configure Environment Variables

In Railway dashboard:
1. Go to your project
2. Click "Variables" tab
3. Add these variables:

```env
NODE_ENV=production
PORT=5000
ALLOWED_ORIGINS=https://your-app.up.railway.app
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api
NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
```

### 5. Get Your Public URL

- Railway will provide: `https://your-app.up.railway.app`
- Update the CORS origins in the variables above
- Test the health endpoint: `https://your-app.up.railway.app/api/health`

## 🔧 Configuration Details

### Railway.json
- **Builder**: NIXPACKS (automatic Node.js detection)
- **Build Command**: Installs dependencies and builds Next.js
- **Start Command**: Runs the Express server
- **Health Check**: `/api/health` endpoint

### Express Server (server/src/index.js)
- **Port**: Uses `process.env.PORT` (Railway sets this)
- **Static Files**: Serves Next.js build from `/client/.next`
- **API Routes**: `/api/*` endpoints
- **Fallback**: Serves Next.js app for all other routes

### Next.js Client
- **Build Output**: `.next` directory
- **Static Export**: Not needed (served by Express)
- **Environment**: Uses Railway environment variables

## 🐛 Common Issues & Fixes

### Build Fails
```bash
# Check logs in Railway dashboard
# Common causes:
# 1. Missing dependencies in package.json
# 2. Build script errors
# 3. Node version incompatibility
```

### App Crashes on Start
```bash
# Check:
# 1. PORT environment variable is set
# 2. All dependencies are installed
# 3. Build files exist in client/.next
```

### 404 on Refresh
```bash
# Ensure catch-all route is last in Express:
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/.next/server/pages/index.html'));
});
```

### CORS Errors
```bash
# Update ALLOWED_ORIGINS in Railway variables
# Include your Railway URL and localhost for development
```

## 📱 Mobile Access

Your app will be accessible at:
- **Desktop**: `https://your-app.up.railway.app`
- **Mobile**: Same URL, responsive design
- **API**: `https://your-app.up.railway.app/api/*`

## 🔗 Custom Domain (Optional)

1. **In Railway Dashboard:**
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Update Environment Variables:**
   - Replace Railway URL with your custom domain
   - Update CORS origins

## 📊 Monitoring

- **Railway Dashboard**: Real-time logs and metrics
- **Health Check**: `/api/health` endpoint
- **Error Logs**: Available in Railway dashboard

## 🔄 Continuous Deployment

- **Automatic**: Every push to main branch triggers deployment
- **Manual**: Trigger from Railway dashboard
- **Rollback**: Available in Railway dashboard

## 🛠️ Development Workflow

```bash
# Local development
npm run dev

# Production testing
npm run build
npm start

# Deploy
git add .
git commit -m "Your changes"
git push origin main
# Railway automatically deploys
```

## 📞 Support

- **Railway Docs**: https://docs.railway.app
- **Express Docs**: https://expressjs.com
- **Next.js Docs**: https://nextjs.org/docs

---

**🎉 Your app is now live and accessible from anywhere!** 