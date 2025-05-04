# Simplified Deployment Guide

This guide provides easy-to-follow instructions for deploying your Stock Portfolio application using free services.

## 1. Backend Deployment (Render)

### Option 1: One-click Deploy with Blueprint (Easiest)

1. Create a Render account at [render.com](https://render.com)
2. Click this button: [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/YOUR_USERNAME/stock-portfolio-modern)
3. Follow the prompts to connect your GitHub repository
4. Important: Add your API key in the environment variables section
5. Click "Apply"

### Option 2: Manual Deployment

1. Sign up at [render.com](https://render.com)
2. From your dashboard, click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure as follows:
   - Name: `stock-portfolio-backend`
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python start.py`
   - Plan: Free
5. Add environment variable:
   - `API_KEY`: Your Financial Modeling Prep API key
   - `FLASK_ENV`: `production`
6. Click "Create Web Service"

## 2. Frontend Deployment (Vercel)

### Important: Fixing 404 Errors

If you encounter 404 errors with Vercel, follow these exact steps:

1. Sign up at [vercel.com](https://vercel.com)
2. From dashboard, click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure as follows:
   - Framework Preset: `Create React App`
   - Root Directory: `/frontend` (make sure to include the leading slash)
   - Build Command: Leave default (`npm run build`)
   - Output Directory: Leave default (`build`)
   - Install Command: `npm install`
5. Click "Environment Variables" and add:
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://stock-portfolio-backend.onrender.com`)
6. Click "Deploy"

### If You Still Get 404 Errors:

1. Go to your project settings in Vercel
2. Navigate to the "Git" tab
3. Under "Ignored Build Step", add: `exit 1` (this will force a fresh rebuild)
4. Trigger a new deployment

## Connecting Frontend to Backend

Once both are deployed:

1. Copy your Render backend URL (e.g., `https://stock-portfolio-backend.onrender.com`)
2. Go to your Vercel project → Settings → Environment Variables
3. Add or update `REACT_APP_API_URL` with your backend URL
4. Redeploy the frontend by clicking "Redeploy" in the Deployments tab

## Testing Your Deployed App

1. Access your frontend URL (provided by Vercel)
2. Try to fetch investment strategies and create a portfolio
3. If it works, congratulations! Your app is deployed 🎉

## Troubleshooting

- **404 Errors on Vercel**: Make sure your "Root Directory" is set to `/frontend` with the leading slash
- **CORS Errors**: The backend is configured to accept requests from any origin in production mode
- **API Issues**: Make sure you've added your API key to Render environment variables
- **Deployment Failures**: Check build logs in Render/Vercel for specific error messages 