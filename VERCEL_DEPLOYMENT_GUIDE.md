# Vercel Deployment Guide

## Quick Setup Steps

### 1. Create New Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import from GitHub:
   - Select repository: `anteliteevents/anteliteeventmanagementsystem`
   - Make sure you're logged in with the **anteliteevents** GitHub account

### 2. Configure Project Settings

In the project configuration screen:

#### Framework Preset
- **Framework Preset**: `Create React App` (or `Other`)

#### Root Directory
- **Root Directory**: `frontend` ⚠️ **CRITICAL - Set this!**

#### Build and Output Settings
- **Build Command**: `npm run build` (or leave default)
- **Output Directory**: `build` (or leave default)
- **Install Command**: `npm install` (or leave default)

### 3. Environment Variables

Click **"Environment Variables"** and add:

#### Production Environment:
```
REACT_APP_API_URL=https://anteliteeventssystem.onrender.com
```

#### Preview Environment (optional):
```
REACT_APP_API_URL=https://anteliteeventssystem.onrender.com
```

#### Development Environment (optional):
```
REACT_APP_API_URL=http://localhost:3001
```

### 4. Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Your app will be available at: `https://[project-name].vercel.app`

### 5. Custom Domain (Optional)

If you want to use `https://eventsystem.antelite.digital`:

1. Go to **Settings** → **Domains**
2. Add domain: `eventsystem.antelite.digital`
3. Follow DNS configuration instructions
4. Update Cloudflare DNS if needed

## Important Notes

### ✅ Root Directory Must Be Set
The **Root Directory** must be set to `frontend` because your React app is in a subdirectory, not the repo root.

### ✅ Environment Variables
- `REACT_APP_API_URL` is required for production
- The frontend has fallback logic, but setting it explicitly is recommended
- Changes to environment variables require a **redeploy**

### ✅ Build Output
- React Scripts builds to `frontend/build/`
- Vercel will automatically detect this if Root Directory is set correctly

## Troubleshooting

### Build Fails: "No Output Directory named 'build' found"
**Solution**: Set **Root Directory** to `frontend` in project settings.

### API Calls Fail: "Unsupported protocol ttps:"
**Solution**: 
1. Set `REACT_APP_API_URL=https://anteliteeventssystem.onrender.com` in Vercel
2. Redeploy the project

### CORS Errors
**Solution**: Ensure backend CORS includes your Vercel domain:
- `https://[project-name].vercel.app`
- `https://eventsystem.antelite.digital` (if using custom domain)

## Verification Checklist

After deployment:

- [ ] Build completes successfully
- [ ] Frontend loads at Vercel URL
- [ ] Login page works
- [ ] Can login with admin credentials
- [ ] Admin dashboard loads data
- [ ] API calls go to Render backend (check browser Network tab)
- [ ] No CORS errors in console

## Current Configuration

- **GitHub Repo**: `https://github.com/anteliteevents/anteliteeventmanagementsystem`
- **Backend URL**: `https://anteliteeventssystem.onrender.com`
- **Frontend Root**: `frontend/`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

