# Vercel Deployment Guide

This guide will help you deploy your e-commerce application to Vercel.

## Prerequisites

1. **Vercel Account**: Create a free account at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional but recommended):
   ```bash
   npm install -g vercel
   ```

## Project Structure

Your application has two separate deployments:
- **Frontend**: React application (root directory)
- **Backend**: Express API (backend directory)

## Deployment Steps

> [!IMPORTANT]
> **Vercel Serverless Architecture**: Your backend uses a special structure for Vercel:
> - Entry point: `backend/api/index.js` (exports Express app)
> - Original: `backend/server.js` (for local development with `app.listen()`)
> - Vercel automatically handles the serverless function execution

### 1. Deploy Backend (API)

#### Option A: Using Vercel Dashboard (Recommended for first deployment)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (not needed for Node.js)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. Add Environment Variables (click "Environment Variables"):
   
   > **Important**: Replace `your-backend-domain` and `your-frontend-domain` with actual domains after deployment.
   > - `GOOGLE_CALLBACK_URL` should point to your **BACKEND** domain
   > - `FRONTEND_URL` should point to your **FRONTEND** domain
   > 
   > Example:
   > - Backend deployed at: `https://gag-backend.vercel.app`
   > - Frontend deployed at: `https://gag-store.vercel.app`
   > 
   > Then:
   > - `GOOGLE_CALLBACK_URL=https://gag-backend.vercel.app/api/auth/google/callback`
   > - `FRONTEND_URL=https://gag-store.vercel.app`

   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SESSION_SECRET=your_session_secret_key
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=https://your-backend-domain.vercel.app/api/auth/google/callback
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

5. Click **Deploy**

#### Option B: Using Vercel CLI

```bash
cd backend
vercel
# Follow the prompts
# Add environment variables when prompted or via dashboard
vercel --prod
```

### 2. Deploy Frontend

#### Option A: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the same repository (create a new project)
3. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-domain.vercel.app
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

5. Click **Deploy**

#### Option B: Using Vercel CLI

```bash
# From root directory
vercel
# Follow the prompts
# Add environment variables when prompted or via dashboard
vercel --prod
```

### 3. Update Environment Variables

After both deployments are complete:

1. **Update Backend `FRONTEND_URL`**:
   - Go to your backend project in Vercel dashboard
   - Settings → Environment Variables
   - Update `FRONTEND_URL` to your frontend domain

2. **Update Frontend `REACT_APP_API_URL`**:
   - Go to your frontend project in Vercel dashboard
   - Settings → Environment Variables
   - Update `REACT_APP_API_URL` to your backend domain

3. **Redeploy both projects** for changes to take effect:
   - Go to Deployments tab
   - Click "..." on the latest deployment
   - Click "Redeploy"

### 4. Update Google OAuth Callback URLs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your OAuth 2.0 Client
3. Add Authorized redirect URIs:
   ```
   https://your-backend-domain.vercel.app/api/auth/google/callback
   ```

### 5. Update Razorpay Webhook (if applicable)

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Settings → Webhooks
3. Update webhook URL to:
   ```
   https://your-backend-domain.vercel.app/api/payment/webhook
   ```

## Important Notes

### CORS Configuration
The backend is configured to accept requests from your frontend URL. Make sure the `FRONTEND_URL` environment variable is correctly set.

### MongoDB Atlas IP Whitelist
Vercel uses dynamic IPs, so you need to:
1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (allows all IPs)
   - **Note**: This is required for Vercel serverless functions

### Serverless Function Limitations
- **Execution Time**: Max 10 seconds on free plan, 60 seconds on Pro
- **Payload Size**: Max 4.5MB request/response
- **Cold Starts**: First request may be slower

### Environment Variables
- Use Vercel's environment variable system (not `.env` files)
- Variables prefixed with `REACT_APP_` are exposed to the browser
- Backend variables are kept secret

## Verification

After deployment, test the following:

1. **Health Check**: Visit `https://your-backend-domain.vercel.app/api/health`
2. **Frontend**: Visit `https://your-frontend-domain.vercel.app`
3. **Authentication**: Test login/signup
4. **API Calls**: Check browser console for any CORS errors
5. **Payment**: Test Razorpay integration

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in backend environment variables
- Check that it matches your frontend domain exactly (no trailing slash)

### API Not Found (404)
- Ensure backend `vercel.json` is in the `backend` directory
- Check that root directory is set to `backend` in Vercel project settings

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check `MONGODB_URI` environment variable

## Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

You can configure this in: Project Settings → Git

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables with new domain

---

## Quick Reference

### Backend Domain
```
https://your-backend-domain.vercel.app
```

### Frontend Domain
```
https://your-frontend-domain.vercel.app
```

### Vercel CLI Commands
```bash
vercel login          # Login to Vercel
vercel                # Deploy to preview
vercel --prod         # Deploy to production
vercel env ls         # List environment variables
vercel logs           # View logs
```

---

**Need Help?** Check [Vercel Documentation](https://vercel.com/docs) or [Vercel Support](https://vercel.com/support)
