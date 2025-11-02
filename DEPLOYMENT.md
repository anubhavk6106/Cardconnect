# CardConnect Deployment Guide - Render

This guide will walk you through deploying CardConnect to Render via GitHub.

## 📋 Prerequisites

- GitHub account with your CardConnect repository
- Render account (sign up at https://render.com)
- MongoDB Atlas account with a cluster
- Cloudinary account
- Razorpay account (with API keys)
- Gmail account (for email notifications)

## 🚀 Deployment Steps

### Step 1: Prepare Your GitHub Repository

1. **Ensure your code is pushed to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Verify .gitignore is correct:**
   - `.env` files should NOT be committed
   - `node_modules/` should be ignored
   - `dist/` and `build/` folders should be ignored

### Step 2: Deploy Backend to Render

#### 2.1 Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your **CardConnect** repository
5. Configure the service:

   **Basic Settings:**
   - **Name:** `cardconnect-backend` (or your preferred name)
   - **Region:** Choose closest to your users (e.g., Singapore, Oregon)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

#### 2.2 Add Environment Variables

In the "Environment" section, add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | `10000` | Render's default port |
| `MONGO_URI` | Your MongoDB Atlas connection string | From MongoDB Atlas |
| `JWT_SECRET` | Generate a random 32+ character string | Use: `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | From Cloudinary dashboard |
| `RAZORPAY_KEY_ID` | Your Razorpay Key ID | From Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | Your Razorpay Key Secret | From Razorpay dashboard |
| `EMAIL_USER` | Your Gmail address | e.g., youremail@gmail.com |
| `EMAIL_PASS` | Your Gmail App Password | Generate from Google Account settings |
| `FRONTEND_URL` | `https://your-frontend-url.onrender.com` | Update after frontend deployment |

#### 2.3 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Your backend will be available at: `https://cardconnect-backend.onrender.com`
4. Test the API: Visit `https://your-backend-url.onrender.com/` - you should see the API welcome message

### Step 3: Deploy Frontend to Render

#### 3.1 Create Static Site

1. Go to Render dashboard
2. Click **"New +"** → **"Static Site"**
3. Select your **CardConnect** repository
4. Configure the site:

   **Basic Settings:**
   - **Name:** `cardconnect-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

#### 3.2 Add Environment Variables

In the "Environment" section, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://cardconnect-backend.onrender.com` (your backend URL) |
| `VITE_RAZORPAY_KEY_ID` | Your Razorpay Key ID (same as backend) |

#### 3.3 Configure Redirects for React Router

Create a file `frontend/_redirects` (if it doesn't exist):
```
/*    /index.html   200
```

Or add to `frontend/public/_redirects` if using public folder.

#### 3.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for build and deployment (5-10 minutes)
3. Your frontend will be available at: `https://cardconnect-frontend.onrender.com`

### Step 4: Update Backend CORS Configuration

1. Go back to your backend service in Render dashboard
2. Update the `FRONTEND_URL` environment variable:
   - **Value:** `https://cardconnect-frontend.onrender.com` (your actual frontend URL)
3. Save and redeploy the backend

### Step 5: Update MongoDB Atlas IP Whitelist

1. Go to MongoDB Atlas dashboard
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Add `0.0.0.0/0` (allow access from anywhere)
   - Or add Render's IP ranges for better security
5. Save changes

### Step 6: Create Admin User

After backend is deployed, create an admin user:

**Option 1: Using Render Shell**
1. Go to backend service in Render dashboard
2. Click **"Shell"** tab
3. Run: `node scripts/createAdmin.js`

**Option 2: Using Local Script (Connect to Production DB)**
1. Temporarily set your local `.env` to use production `MONGO_URI`
2. Run: `node backend/scripts/createAdmin.js`
3. Revert `.env` back to local settings

Default admin credentials:
- **Email:** `admin@cardconnect.com`
- **Password:** `admin123`

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

## 🔧 Configuration Files Updates

### Update backend/server.js CORS (if needed)

Ensure CORS is configured to accept your frontend URL:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Add _redirects file for Frontend

Create `frontend/public/_redirects`:
```
/*    /index.html   200
```

## 📝 Post-Deployment Checklist

- [ ] Backend API is accessible and returns welcome message
- [ ] Frontend site loads properly
- [ ] Login and registration work
- [ ] MongoDB connection is successful
- [ ] Image uploads work (Cloudinary)
- [ ] Payment gateway test works (Razorpay test mode)
- [ ] Email notifications are sent
- [ ] Real-time chat and notifications work (Socket.io)
- [ ] Admin panel is accessible
- [ ] Changed default admin password

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Backend fails to start
- **Solution:** Check logs in Render dashboard under "Logs" tab
- Verify all environment variables are set correctly
- Ensure `npm start` script exists in `backend/package.json`

**Problem:** Database connection fails
- **Solution:** Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Ensure MongoDB cluster is running

**Problem:** CORS errors
- **Solution:** Update `FRONTEND_URL` environment variable in backend
- Ensure CORS middleware is configured in `server.js`

### Frontend Issues

**Problem:** Frontend shows "Cannot connect to server"
- **Solution:** Verify `VITE_API_URL` is set to correct backend URL
- Check backend is running and accessible

**Problem:** 404 on page refresh
- **Solution:** Ensure `_redirects` file exists in build output
- Verify publish directory is set to `dist`

**Problem:** Payment fails
- **Solution:** Verify `VITE_RAZORPAY_KEY_ID` matches backend
- Check Razorpay keys are in test mode for testing

### Socket.io Issues

**Problem:** Real-time features not working
- **Solution:** Check backend logs for Socket.io connection errors
- Verify frontend connects to correct backend URL
- Ensure WebSocket connections are allowed

## 🔄 Continuous Deployment

Render automatically redeploys when you push to your GitHub repository:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. Render will automatically detect changes and redeploy

**Note:** Free tier services may spin down after inactivity. First request after inactivity may be slow (30-60 seconds).

## 💰 Render Free Tier Limits

- **Web Services:** 750 hours/month (shared across all services)
- **Static Sites:** 100GB bandwidth/month
- **Build Time:** 500 minutes/month
- **Services spin down after 15 minutes of inactivity**

Consider upgrading to paid plan for:
- No spin down
- More resources
- Custom domains
- SSL certificates

## 🌐 Custom Domain (Optional)

### Backend Domain
1. Go to backend service settings
2. Click "Custom Domain"
3. Add your domain (e.g., `api.cardconnect.com`)
4. Update DNS records as instructed
5. Update `FRONTEND_URL` to match production frontend domain

### Frontend Domain
1. Go to frontend static site settings
2. Click "Custom Domain"
3. Add your domain (e.g., `cardconnect.com`)
4. Update DNS records as instructed
5. Update backend `FRONTEND_URL` environment variable

## 📊 Monitoring

1. **Logs:** Check Render dashboard → Your service → Logs tab
2. **Metrics:** Monitor request volume, response times
3. **Health Checks:** Render automatically monitors service health
4. **Alerts:** Set up email alerts for deployment failures

## 🔐 Security Best Practices

- ✅ Use strong JWT_SECRET (32+ characters)
- ✅ Enable HTTPS (automatic on Render)
- ✅ Restrict MongoDB IP access (use Render IP ranges)
- ✅ Use environment variables for all secrets
- ✅ Change default admin password
- ✅ Use Razorpay live mode keys for production
- ✅ Enable 2FA on all service accounts

## 📞 Support

If you encounter issues:
1. Check Render documentation: https://render.com/docs
2. Review service logs in Render dashboard
3. Check MongoDB Atlas status
4. Verify all API keys and credentials

---

**Deployment Complete! 🎉**

Your CardConnect application is now live on Render!

- **Frontend:** https://cardconnect-frontend.onrender.com
- **Backend:** https://cardconnect-backend.onrender.com
