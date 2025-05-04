# Deployment Guide for Stock Portfolio App

This guide provides instructions for deploying the Stock Portfolio application using Render (backend) and Vercel (frontend) for free.

## Backend Deployment on Render

### Step 1: Create a Render Account
Sign up for a free account at [Render](https://render.com/) if you don't have one.

### Step 2: Create a New Web Service
1. Click "New" and select "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - Name: `stock-portfolio-backend` (or your preferred name)
   - Environment: `Python`
   - Region: Choose one closest to your target users
   - Branch: `main` (or your default branch)
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Plan: Free

### Step 3: Add Environment Variables
Add the following environment variables in Render dashboard:
- `API_KEY`: Your Financial Modeling Prep API key
- `FLASK_ENV`: `production`
- `CORS_ORIGINS`: Your Vercel frontend URL (e.g., https://stock-portfolio-frontend.vercel.app)

## Frontend Deployment on Vercel

### Step 1: Create a Vercel Account
Sign up for a free account at [Vercel](https://vercel.com/) if you don't have one.

### Step 2: Import your GitHub Repository
1. Click "Add New..." and select "Project"
2. Import your GitHub repository
3. Configure the project:
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

### Step 3: Add Environment Variables
Add the following environment variable in Vercel dashboard:
- `REACT_APP_API_URL`: Your Render backend URL (e.g., https://stock-portfolio-backend.onrender.com)

### Step 4: Deploy
Click "Deploy" and wait for the deployment to complete.

## Verifying the Deployment

1. Visit your frontend URL (provided by Vercel) to check if the application is working correctly.
2. Test the API connection by making a request to your backend URL + `/api/health`.

## Troubleshooting

### CORS Issues
If you encounter CORS issues:
1. Check that your backend CORS configuration includes your Vercel domain.
2. Verify that your API URL in the frontend is correct.

### API Key Issues
If the stock data isn't loading:
1. Check that you've added your API key to the Render environment variables.
2. Verify that the key is valid by testing it directly with the Financial Modeling Prep API.

## Redeploying Changes

### Backend (Render)
Render automatically redeploys when you push changes to your connected repository.

### Frontend (Vercel)
Vercel automatically redeploys when you push changes to your connected repository. 